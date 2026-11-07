# Teacher Grading (Backoffice) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a teacher on the backoffice see the shared queue of IELTS Writing/Speaking sections, grade a section by entering criteria, correct an earlier grade, and see every revision; and let content editors author the five new IELTS question types.

**Architecture:** A new `grading` feature (types → `gradingApi` → React Query hooks → `src/components/grading/*` → `src/pages/grading/{list,detail}.tsx`), gated by the new CASL subject `assessment`. The server computes every band; the client mirrors the rounding only to show a live preview. Optimistic concurrency uses `expectedRevision`, and a 409 keeps the teacher's input on screen.

**Tech Stack:** React Router v7 (SPA), React Query v5, axios, react-hook-form + yup, HeroUI v3, Tailwind v4, i18next, Vitest + RTL + MSW, Playwright (mock project).

**Spec:** `../english-service/docs/superpowers/specs/2026-11-05-teacher-grading-design.md` (server design), `docs/api-grading-change.md` (oasdiff of the API). Backend DTOs to mirror: `../english-service/src/modules/grading/dto/grading-response.dto.ts` and `grading.dto.ts`.

## Global Constraints

- New enum values, verbatim: `PermissionSubject` `assessment`; `MediaScope` `ATTEMPT`; `QuestionType` `IELTS_WRITING_TASK_1`, `IELTS_WRITING_TASK_2`, `IELTS_SPEAKING_PART_1`, `IELTS_SPEAKING_PART_2`, `IELTS_SPEAKING_PART_3`; `AttemptSectionGradingStatus` `AUTO_GRADED` | `PENDING` | `GRADED`.
- Endpoints (all under `/api`): `GET /grading/queue` (READ assessment), `GET /grading/sections/:id` (READ), `GET /grading/sections/:id/assessments` (READ), `POST /grading/sections/:id/assessments` (CREATE). `:id` is the attempt section uuid.
- Queue query: `page`, `take`, `gradingStatus` (`PENDING` default | `GRADED`), `skill` (`WRITING` | `SPEAKING`), `testId`, `search` (≤100 chars, student name/email). Oldest first is server order; don't send `sort`.
- Criteria codes: Task 1 `TA CC LR GRA`, Task 2 `TR CC LR GRA`, Speaking `FC LR GRA P`. Always render the codes the server sends in `expectedEntries[].criteria`, never a hard-coded list.
- Each criterion is 0–9 in steps of 0.5. `feedback` optional, ≤ 5000 chars.
- Writing sends exactly one entry per task (`partId` = task's part id); Speaking sends exactly one entry with `partId: null`.
- Rounding (preview only): `Math.floor(v * 2 + 0.5) / 2`. Task band = mean of criteria; Writing = `(task1 + 2 × task2) / 3`; Speaking = mean of criteria.
- Error codes: 409 `ASSESSMENT_REVISION_CONFLICT`, 409 `SECTION_NOT_GRADABLE`; 400 `message` names the entry. Rejections arrive as `ErrorResponseDto` (`{ message, statusCode, code? }`) via the axios interceptor.
- `ATTEMPT` media is private (presigned URLs, default TTL 3600 s) and max 20 MB audio; the BO never uploads it.
- No AI grading, assignment, locking, inline annotation, or TOEIC S&W grading.
- Every new user-facing string goes in both `src/i18n/locales/en.ts` and `vi.ts`.
- Comments only for non-obvious constraints (CLAUDE.md).

## Review Focus

1. **Stale revision (409 `ASSESSMENT_REVISION_CONFLICT`)** — the teacher's typed criteria and feedback must stay in the form; the page refetches, shows the newer grade with its grader, and the next save uses the new revision. Test: Task 6 `keeps the input and shows the newer grade on a revision conflict`.
2. **One Writing task left blank by the student** (`response` null or `text` empty) — the screen shows "No response" for that task and still requires its criteria, because the server requires an entry per task. Test: Task 6 `shows no response but still requires the blank task`.
3. **Presigned audio expired** (page open > 1 h) — an `<audio>` `error` event refetches the section once so a fresh URL loads. Test: Task 6 `refetches the section when a recording fails to load`.
4. **Unfilled criterion** — submit is blocked with a field error; `null`/`NaN` is never sent. Test: Task 4 `rejects a missing criterion`.
5. **Correcting a GRADED section** — the form is prefilled from `assessment.entries` matched by `partId`, and `expectedRevision` is the current `revision`, not 0. Test: Task 4 `prefills from the current assessment`.

---

### Task 1: Permission subject and ATTEMPT media scope

**Files:**

- Modify: `src/types/auth.ts` (`SubjectName`)
- Modify: `src/types/media.ts` (`MediaScope`)
- Modify: `src/constants/media.ts` (`MEDIA_MAX_BYTES`)
- Modify: `src/components/media/constants.ts` (`scopeColorMap`, `ownerHref`)
- Modify: `src/components/media/ViewMedia.tsx` / `MediaTable.tsx` (wherever `ownerHref` is rendered)
- Modify: `src/i18n/locales/en.ts`, `vi.ts` (`media.scope.ATTEMPT`)
- Test: `src/components/media/constants.test.ts` (new)

**Interfaces:**

- Produces: `SubjectName.Assessments = 'assessment'`; `MediaScope.ATTEMPT = 'ATTEMPT'`; `ownerHref(scope, ownerId): string | null`.

- [ ] **Step 1: Write the failing test**

```ts
describe('ownerHref', () => {
  it('links tests and users', () => {
    expect(ownerHref(MediaScope.TEST, '5')).toBe('/tests/5/edit');
    expect(ownerHref(MediaScope.AVATAR, 'u1')).toBe('/users/u1');
  });
  it('has no page for attempt recordings', () => {
    expect(ownerHref(MediaScope.ATTEMPT, 'a1')).toBeNull();
  });
});
```

- [ ] **Step 2: Run** `pnpm vitest run src/components/media/constants.test.ts` — Expected: FAIL (`ATTEMPT` undefined).
- [ ] **Step 3: Implement** — add the enum values; `MEDIA_MAX_BYTES[ATTEMPT] = { AUDIO: 20 * MB }`; `scopeColorMap[ATTEMPT] = 'default'`; `ownerHref` returns `null` for `LIBRARY`/`ATTEMPT`; callers render the owner id as plain text when `null`. Labels: en `Attempt recording`, vi `Bản ghi bài làm`. The media list scope filter picks up `ATTEMPT` automatically via `Object.values(MediaScope)`.
- [ ] **Step 4: Run** `pnpm vitest run src/components/media && pnpm typecheck` — Expected: PASS.
- [ ] **Step 5: Commit** `feat: add assessment permission and attempt media scope`

### Task 2: IELTS Writing/Speaking question types in the test editor

**Files:**

- Modify: `src/types/test.ts` (`QuestionType`)
- Modify: `src/constants/questionTypes.ts` (`TypeSpec`, `QUESTION_TYPES`, `getTypesForSkill`)
- Modify: `src/components/tests/editor/PartPanel.tsx:354`, `src/components/tests/editor/group/GroupPanel.tsx:399,839` (pass `test.examType`)
- Modify: `src/components/tests/editor/typePreview/samples.ts` (new samples)
- Modify: `src/i18n/locales/en.ts`, `vi.ts` (`tests.questionType.*`)
- Test: `src/constants/questionTypes.test.ts`, `src/components/tests/editor/typePreview/grading.test.ts` (existing "has a sample for every question type" covers samples)

**Interfaces:**

- Produces: `TypeSpec.exams?: ExamType[]`; `getTypesForSkill(skill: SkillType, examType?: ExamType): QuestionType[]` — a type with `exams` is listed only when `examType` is in it.

- [ ] **Step 1: Write the failing tests** in `questionTypes.test.ts`:

```ts
it('offers IELTS writing tasks only to IELTS tests', () => {
  expect(getTypesForSkill(SkillType.WRITING, ExamType.IELTS_ACADEMIC)).toEqual(
    expect.arrayContaining([
      QuestionType.IELTS_WRITING_TASK_1,
      QuestionType.IELTS_WRITING_TASK_2,
    ]),
  );
  expect(getTypesForSkill(SkillType.WRITING, ExamType.TOEIC_SW)).not.toContain(
    QuestionType.IELTS_WRITING_TASK_1,
  );
});
it('offers the three IELTS speaking parts to IELTS General', () => {
  expect(getTypesForSkill(SkillType.SPEAKING, ExamType.IELTS_GENERAL)).toEqual(
    expect.arrayContaining([
      QuestionType.IELTS_SPEAKING_PART_1,
      QuestionType.IELTS_SPEAKING_PART_2,
      QuestionType.IELTS_SPEAKING_PART_3,
    ]),
  );
});
```

- [ ] **Step 2: Run** `pnpm vitest run src/constants src/components/tests/editor/typePreview` — Expected: FAIL (enum missing; then sample test fails for the new types).
- [ ] **Step 3: Implement** — five enum values. Each spec: `skills: [WRITING]` or `[SPEAKING]`, `groupContent: 'none'`, `questionContent: 'timing'`, `answer: 'sample'`, `exams: [IELTS_ACADEMIC, IELTS_GENERAL]`. Samples: one `view: 'write'` sample for `IELTS_WRITING_TASK_1` (`figure: 'diagram'`, `minWords: 150`, rubric `TA CC LR GRA`), one for `IELTS_WRITING_TASK_2` (`minWords: 250`, rubric `TR CC LR GRA`), one `view: 'speak'` sample for `IELTS_SPEAKING_PART_2` with `also: [PART_1, PART_3]` (cue card, `prepSeconds: 60`, `responseSeconds: 120`, rubric `FC LR GRA P`). Labels en: `IELTS Writing Task 1`, `IELTS Writing Task 2`, `IELTS Speaking Part 1/2/3`; vi: `IELTS Writing Task 1`, … (same, product names). The Task 1 chart uses the existing question `imageMediaId` picker — no editor change.
- [ ] **Step 4: Run** `pnpm vitest run src/constants src/components/tests && pnpm typecheck` — Expected: PASS.
- [ ] **Step 5: Commit** `feat: add IELTS writing and speaking question types`

### Task 3: Grading types, API module and React Query hooks

**Files:**

- Create: `src/types/grading.ts`
- Create: `src/services/apis/grading.ts`; Modify: `src/services/apis/index.ts`
- Modify: `src/constants/reactQuery.ts` (`GRADING`)
- Create: `src/hooks/apis/grading/{index.ts,useGetGradingQueue.tsx,useGetGradingSection.tsx,useGetAssessments.tsx,useCreateAssessment.tsx}`
- Modify: `src/i18n/locales/en.ts`, `vi.ts` (`grading.toast.*`)
- Test: `src/hooks/apis/grading/queries.test.tsx`, `src/hooks/apis/grading/mutations.test.tsx`

**Interfaces:**

- Produces (`src/types/grading.ts`, field names mirror the backend DTOs exactly):
  - `enum GradingStatus { AUTO_GRADED, PENDING, GRADED }`; `type GradingQueueStatus = GradingStatus.PENDING | GradingStatus.GRADED`; `type GradingSkill = SkillType.WRITING | SkillType.SPEAKING`
  - `GradingUser { id; email; firstName; lastName }` (nullable strings)
  - `AssessmentEntry { partId: number | null; criteria: Record<string, number>; band: number; feedback: string | null }`
  - `Assessment { id: string; revision: number; band: number; entries: AssessmentEntry[]; grader: GradingUser; createdAt: string }`
  - `GradingTest { id: number; title: string; examType: ExamType }`
  - `GradingQueueItem { attemptSectionId; attemptId; student; test; skill; submittedAt: string | null; gradingStatus; band: number | null; grader: GradingUser | null }`
  - `GradingExpectedEntry { partId: number | null; task: 1 | 2 | null; criteria: string[] }`
  - `GradingResponse { text: string | null; wordCount: number | null; audioUrl: string | null }`
  - `GradingQuestion { questionId; numberFrom; questionType; instruction; prompt; content; imageUrl; audioUrl; sample; rubric: Record<string, unknown> | null; response: GradingResponse | null }`
  - `GradingPart { partId; order; title; instruction; questions: GradingQuestion[] }`
  - `GradingSection { attemptSectionId; attemptId; student; test; skill; submittedAt; gradingStatus; revision: number; assessment: Assessment | null; expectedEntries: GradingExpectedEntry[]; parts: GradingPart[] }`
  - `GetGradingQueueParams = Params & Partial<{ gradingStatus: GradingQueueStatus; skill: GradingSkill; testId: number }>`; `GetGradingQueueResponse = Response<GradingQueueItem[]>`
  - `CreateAssessmentPayload { id: string; expectedRevision: number; entries: { partId: number | null; criteria: Record<string, number>; feedback?: string }[] }`
  - `const ASSESSMENT_ERROR = { REVISION_CONFLICT: 'ASSESSMENT_REVISION_CONFLICT', NOT_GRADABLE: 'SECTION_NOT_GRADABLE' } as const`
- Produces (`gradingApi`): `getQueue(params)`, `getSection(id): Promise<GradingSection>`, `getAssessments(id): Promise<Assessment[]>`, `createAssessment({ id, ...body }): Promise<Assessment>`.
- Produces (keys): `REACT_QUERY_KEYS.GRADING = { QUEUE: 'grading.queue', SECTION: 'grading.section', ASSESSMENTS: 'grading.assessments' }`.
- Produces (hooks): `useGetGradingQueue(params)` (`keepPreviousData`), `useGetGradingSection(id)`, `useGetAssessments(id)`, `useCreateAssessment()`.

- [ ] **Step 1: Write the failing tests** (pattern: `src/hooks/apis/passages/*.test.tsx`)

```ts
it('sends the queue filters as query params', async () => {
  // MSW GET `${API_URL}/grading/queue`, record searchParams
  // useGetGradingQueue({ page: 1, take: 10, gradingStatus: GradingStatus.GRADED, skill: SkillType.WRITING, search: 'an' })
  expect(Object.fromEntries(queries[0])).toEqual({ page: '1', take: '10', gradingStatus: 'GRADED', skill: 'WRITING', search: 'an' });
});
it('posts the assessment without the id and invalidates section, revisions and queue', async () => {
  // POST `${API_URL}/grading/sections/s1/assessments` → 201
  // mutate({ id: 's1', expectedRevision: 0, entries: [...] })
  expect(body).toEqual({ expectedRevision: 0, entries: [...] });
  expect(invalidate).toHaveBeenCalledWith({ queryKey: [REACT_QUERY_KEYS.GRADING.SECTION, 's1'] });
  expect(invalidate).toHaveBeenCalledWith({ queryKey: [REACT_QUERY_KEYS.GRADING.ASSESSMENTS, 's1'] });
  expect(invalidate).toHaveBeenCalledWith({ queryKey: [REACT_QUERY_KEYS.GRADING.QUEUE] });
  expect(toast.success).toHaveBeenCalled();
});
it('refreshes the section and shows the conflict message on a stale revision', async () => {
  // POST → 409 { code: 'ASSESSMENT_REVISION_CONFLICT', message: '...' }
  expect(toast.danger).toHaveBeenCalledWith(i18n.t('grading.toast.conflict'), expect.anything());
  expect(invalidate).toHaveBeenCalledWith({ queryKey: [REACT_QUERY_KEYS.GRADING.SECTION, 's1'] });
});
```

- [ ] **Step 2: Run** `pnpm vitest run src/hooks/apis/grading` — Expected: FAIL (modules missing).
- [ ] **Step 3: Implement** — follow `passageApi`/`useEditPassage`. `useCreateAssessment.onError` picks the toast title by `err.code`: `REVISION_CONFLICT` → `grading.toast.conflict` and invalidates SECTION + ASSESSMENTS for that id; `NOT_GRADABLE` → `grading.toast.notGradable`; otherwise `grading.toast.saveError` with `description: message` (join when `message` is an array). Copy en: success `Grade saved`, conflict `Someone else graded this section first. Their grade is shown below; review it and save again.`, notGradable `This section can no longer be graded.`, saveError `Could not save the grade`. Provide vi equivalents.
- [ ] **Step 4: Run** `pnpm vitest run src/hooks/apis/grading && pnpm typecheck` — Expected: PASS.
- [ ] **Step 5: Commit** `feat: add grading API and hooks`

### Task 4: Band preview and assessment form model

**Files:**

- Create: `src/utils/ieltsBand.ts`
- Create: `src/constants/grading.ts`
- Create: `src/schemas/assessment.ts`
- Test: `src/utils/ieltsBand.test.ts`, `src/schemas/assessment.test.ts`

**Interfaces:**

- Consumes: `GradingSection`, `GradingExpectedEntry`, `CreateAssessmentPayload` (Task 3).
- Produces:
  - `BAND_STEPS: number[]` = `[0, 0.5, …, 9]` (19 values) in `constants/grading.ts`; `FEEDBACK_MAX = 5000`.
  - `roundBand(v: number): number`, `criteriaBand(scores: number[]): number`, `writingBand(t1: number, t2: number): number`.
  - `previewBands(expected: GradingExpectedEntry[], values: AssessmentFormValues): { entries: (number | null)[]; section: number | null }` — an entry is `null` until all its criteria are set; Writing section uses the `task === 1` and `task === 2` entries; Speaking section is entry 0.
  - `type AssessmentFormValues = { entries: { partId: number | null; criteria: Record<string, number | null>; feedback: string }[] }`
  - `toAssessmentFormValues(section: GradingSection): AssessmentFormValues` — one row per `expectedEntries`, prefilled from `section.assessment?.entries` matched by `partId`, else every criterion `null` and feedback `''`.
  - `buildAssessmentSchema(expected: GradingExpectedEntry[])` — yup; each `criteria[code]` required and `oneOf(BAND_STEPS)`; `feedback` max `FEEDBACK_MAX`.
  - `toCreateAssessmentPayload(id: string, revision: number, values): CreateAssessmentPayload` — trims feedback and omits it when empty.

- [ ] **Step 1: Write the failing tests**

```ts
// ieltsBand.test.ts
it.each([
  [6.25, 6.5],
  [6.75, 7],
  [6.2, 6],
  [6.7, 6.5],
  [6.24, 6],
])('rounds %s to %s', (v, b) => expect(roundBand(v)).toBe(b));
it('weights task 2 double', () => expect(writingBand(6, 7)).toBe(6.5)); // 20/3 ≈ 6.67
it('averages criteria', () => expect(criteriaBand([7, 6.5, 7, 6])).toBe(6.5)); // 6.625 → 6.5
// previewBands: Writing with task 1 TA/CC/LR/GRA = 6 and task 2 = 7 → { entries: [6, 7], section: 6.5 }
// previewBands: one criterion null → that entry null and section null

// assessment.test.ts
it('prefills from the current assessment', () => {
  /* GRADED section, assessment.entries for partId 12 & 13 → values carry their criteria/feedback */
});
it('starts empty when ungraded', () => {
  /* revision 0 → criteria all null, feedback '' */
});
it('rejects a missing criterion', async () => {
  /* TA null → validate rejects at entries[0].criteria.TA */
});
it('rejects a score off the half-band grid', async () => {
  /* 6.3 rejected */
});
it('builds the payload without empty feedback', () => {
  expect(toCreateAssessmentPayload('s1', 2, values)).toEqual({
    id: 's1',
    expectedRevision: 2,
    entries: [{ partId: null, criteria: { FC: 7, LR: 6.5, GRA: 7, P: 6 } }],
  });
});
```

- [ ] **Step 2: Run** `pnpm vitest run src/utils/ieltsBand.test.ts src/schemas/assessment.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** — `roundBand` uses the exact formula from Global Constraints (keep a one-line comment that it must match `english-service/src/shared/scoring/ielts-band.ts`).
- [ ] **Step 4: Run** the same command — Expected: PASS.
- [ ] **Step 5: Commit** `feat: add assessment form model and band preview`

### Task 5: Grading queue page

**Files:**

- Create: `src/components/grading/{constants.ts,GradingStatusChip.tsx,GradingQueueTable.tsx,index.ts}`
- Create: `src/pages/grading/list.tsx`
- Modify: `src/routes.ts` (`...prefix('grading', [index('./pages/grading/list.tsx'), route(':id', './pages/grading/detail.tsx')])` — create `detail.tsx` as a stub that Task 6 fills)
- Modify: `src/configs/menu.ts` (assessment group, after `tests`: `{ id: 9, title: 'grading', route: '/grading', icon: LuClipboardCheck, object: SubjectName.Assessments }`)
- Modify: `src/i18n/locales/en.ts`, `vi.ts` (`sidebar.grading`, `grading.*`)
- Test: `e2e/mock/grading.spec.ts` (new; queue tests here, screen tests added in Task 6), fixtures in `e2e/fixtures/data.ts` (`makeQueueItem`, `makeGradingSection`)

**Interfaces:**

- Consumes: `useGetGradingQueue`, `GradingQueueItem`, `GradingStatus` (Task 3).
- Produces: `GradingStatusChip({ status })`; `gradingStatusColorMap: Record<GradingStatus, ChipProps["color"]>` (`PENDING` warning, `GRADED` success, `AUTO_GRADED` default); `formatPersonName(user: GradingUser): string` in `src/utils/common.ts` (`firstName lastName` trimmed, else email, else id).

- [ ] **Step 1: Write the failing e2e tests** (pattern: `e2e/mock/passages.spec.ts`)

```ts
test('lists pending sections and filters by status, skill and search', async ({
  page,
  api,
}) => {
  // api.loginAs(FULL_ACCESS); api.on('GET', '/grading/queue', paginate(ITEMS))
  await page.goto('/grading');
  // row shows student name, test title, skill "Writing", submitted date, status "Pending"
  // switch status tab to "Graded" → last call query gradingStatus=GRADED, page=1; band column shows "6.5" and grader name
  // pick skill Speaking → skill=SPEAKING; type in search → search=<text> (debounced, page reset to 1)
});
test('opens the grading screen from a row', async ({ page }) => {
  /* click "Grade" → URL /grading/<attemptSectionId> */
});
test('hides grading from users without the assessment permission', async ({
  page,
  api,
}) => {
  // loginAs([{ action: 'read', subject: 'test' }]) → sidebar has no "Grading"
});
```

- [ ] **Step 2: Run** `pnpm e2e -- grading.spec.ts` — Expected: FAIL (route missing).
- [ ] **Step 3: Implement** — copy the URL-state pattern of `src/pages/passages/list.tsx` (`page`, `take`, `search`, plus `status` and `skill` params; `testId` read from the URL and passed through, no picker). Status as HeroUI `Tabs` (`Pending` / `Graded`), skill via `FilterSelect` (All / Writing / Speaking). Columns: student (name + email), test title + exam type, skill, submitted at (`src/utils/datetime.ts`), status chip, band (`—` when null), grader, and a `MyButton I={PermissionAction.Read} a={SubjectName.Assessments}` labelled `Grade` for PENDING / `View` for GRADED. Empty state: `No sections waiting for grading`.
- [ ] **Step 4: Run** `pnpm e2e -- grading.spec.ts && pnpm typecheck` — Expected: PASS.
- [ ] **Step 5: Commit** `feat: add grading queue page`

### Task 6: Grading screen

**Files:**

- Create: `src/components/grading/{GradingWorkspace.tsx,PartReview.tsx,AssessmentForm.tsx,CriterionSelect.tsx}`
- Create: `src/hooks/forms/useGradeSection.tsx`; Modify: `src/hooks/forms/index.ts`
- Modify: `src/pages/grading/detail.tsx`
- Modify: `src/i18n/locales/en.ts`, `vi.ts` (`grading.criteria.*`, `grading.screen.*`)
- Test: `src/components/grading/AssessmentForm.test.tsx`, `e2e/mock/grading.spec.ts`

**Interfaces:**

- Consumes: `useGetGradingSection`, `useCreateAssessment` (Task 3); `toAssessmentFormValues`, `buildAssessmentSchema`, `toCreateAssessmentPayload`, `previewBands`, `BAND_STEPS` (Task 4); `GradingStatusChip`, `formatPersonName` (Task 5).
- Produces: `useGradeSection(section: GradingSection)` → `{ form, onSubmit, isPending, bands }`; `AssessmentForm({ section, readOnly })`; `PartReview({ part, skill, onAudioError })`.

Layout: two columns on `lg` (work on the left, sticky form on the right), stacked on mobile. Header: student, test, skill, submitted at, status chip, `Revision N` (or `Not graded yet`), current band.

`PartReview` per part: title/instruction; per question: prompt, `imageUrl` (Task 1 chart), `audioUrl`; the student's work — Writing: text in a `whitespace-pre-wrap` block with `wordCount` words; Speaking: `<audio controls src={response.audioUrl}>`; `No response` when `response` is null or has neither text nor audio. `sample` and `rubric` collapsed behind a `Sample answer` disclosure (teacher-only content).

`AssessmentForm`: one card per `expectedEntries` row titled `Task 1` / `Task 2` / `Speaking`; one `CriterionSelect` per code (HeroUI `Select` over `BAND_STEPS`, label from `grading.criteria.<CODE>`: TA `Task Achievement`, TR `Task Response`, CC `Coherence & Cohesion`, LR `Lexical Resource`, GRA `Grammatical Range & Accuracy`, FC `Fluency & Coherence`, P `Pronunciation`; unknown codes fall back to the code); feedback `TextArea` with a `n / 5000` counter; entry band preview and section band preview labelled `Estimated band` (server value replaces it after save). Submit `Save grade` (first grade) / `Save correction` (revision > 0). `readOnly` when the user lacks `create assessment` → selects disabled and no submit.

Behaviour that fixes Review Focus 1 and 3:

- The form resets from `toAssessmentFormValues(section)` only when `section.attemptSectionId` changes or after a successful save — not on every refetch, so a conflict refetch keeps the input. `expectedRevision` is read from the latest `section.revision` at submit time.
- After a 409 conflict, show an inline warning above the submit naming the new grader and band from the refetched `section.assessment`.
- `GradingWorkspace` passes `onAudioError` that calls `refetch()` at most once per mount.

- [ ] **Step 1: Write the failing tests**

`AssessmentForm.test.tsx` (RTL + MSW, `renderWithProviders` with `[{ action: 'manage', subject: 'all' }]`):

```ts
it('shows one block per writing task with its criteria', () => {
  /* Task 1: TA CC LR GRA, Task 2: TR CC LR GRA */
});
it('updates the estimated band as criteria are picked', async () => {
  /* all 6 for task 1, all 7 for task 2 → "6.5" */
});
it('blocks submit until every criterion is set', async () => {
  /* click Save grade → field error, no POST */
});
it('posts expectedRevision from the section and the entries', async () => {
  /* body matches toCreateAssessmentPayload */
});
it('keeps the input and shows the newer grade on a revision conflict', async () => {
  // POST → 409 ASSESSMENT_REVISION_CONFLICT; GET section now revision 1 with grader "Lan Pham", band 7
  // selected criteria still selected; warning mentions "Lan Pham" and "7"; next POST sends expectedRevision 1
});
it('is read-only without the create permission', () => {
  /* permissions read assessment only → no Save button */
});
```

`e2e/mock/grading.spec.ts` additions:

```ts
test('shows no response but still requires the blank task', ...);   // task 1 response null → "No response"; saving without its criteria shows errors
test('grades a speaking section and shows the recording', ...);     // <audio> src = response.audioUrl; POST entries [{ partId: null, ... }]
test('refetches the section when a recording fails to load', ...);  // audio URL 404 → a second GET /grading/sections/:id
test('shows a not gradable error', ...);                            // POST → 409 SECTION_NOT_GRADABLE → toast text
```

- [ ] **Step 2: Run** `pnpm vitest run src/components/grading && pnpm e2e -- grading.spec.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** the components and `useGradeSection` (react-hook-form + `yupResolver(buildAssessmentSchema(section.expectedEntries))`, `useWatch` for `previewBands`). Loading: skeleton like `src/components/passages/Skeleton.tsx`; 404 → `Section not found` with a link back to `/grading`.
- [ ] **Step 4: Run** the same commands plus `pnpm typecheck` — Expected: PASS.
- [ ] **Step 5: Commit** `feat: add grading screen`

### Task 7: Revision history

**Files:**

- Create: `src/components/grading/RevisionHistory.tsx`
- Modify: `src/components/grading/GradingWorkspace.tsx`
- Modify: `src/i18n/locales/en.ts`, `vi.ts` (`grading.history.*`)
- Test: `src/components/grading/RevisionHistory.test.tsx`

**Interfaces:**

- Consumes: `useGetAssessments(id)` (Task 3), `formatPersonName` (Task 5).
- Produces: `RevisionHistory({ attemptSectionId })`, rendered under the form only when `section.revision > 0`.

- [ ] **Step 1: Write the failing test**

```ts
it('lists every revision newest first with grader, time and bands', async () => {
  // GET /grading/sections/s1/assessments → [rev 2 band 7 by "Lan Pham", rev 1 band 6.5 by "Minh Tran"]
  // rows in order "Revision 2", "Revision 1"; each shows band, grader, createdAt; expanding a row shows per-entry criteria and feedback
  // the first row is marked "Current"
});
```

- [ ] **Step 2: Run** `pnpm vitest run src/components/grading/RevisionHistory.test.tsx` — Expected: FAIL.
- [ ] **Step 3: Implement** — HeroUI `Accordion`, one item per revision; body lists each entry (`Task 1` / `Task 2` / `Speaking`), its criteria as `CODE band` chips, its band and feedback. Keep server order (already newest first).
- [ ] **Step 4: Run** `pnpm vitest run src/components/grading && pnpm lint` — Expected: PASS, no lint or type errors.
- [ ] **Step 5: Commit** `feat: show grading revision history`

### Task 8: Docs and final verification

**Files:**

- Modify: `CLAUDE.md` (one line under Architecture: the `grading` feature, its subject `assessment`, and that bands are server-computed with a client preview only)

- [ ] **Step 1:** Run `pnpm lint && pnpm test:run && pnpm e2e && pnpm build` — Expected: all green.
- [ ] **Step 2 (optional, needs the real stack on `feat/teacher-grading-speaking`):** start `english-service`, log in as a role with `read`/`create assessment`, finish an IELTS Writing section as a student, grade it, correct it, and confirm the queue, band and revision list match the API.
- [ ] **Step 3: Commit** `docs: describe the grading feature`
