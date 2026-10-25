import { QuestionType } from '@/types/test';

// Sample groups for the question-type preview. Stored fields (instruction,
// wordLimit, content, questions) follow english-service/docs/question-formats.md;
// passage / passageText / audio / figure / transcript are preview-only.

export type PreviewView =
  | 'mcq'
  | 'multi'
  | 'judge'
  | 'matching'
  | 'template'
  | 'sentence'
  | 'summary'
  | 'table'
  | 'diagram'
  | 'map'
  | 'short'
  | 'photo'
  | 'qresp'
  | 'textcomp'
  | 'speak'
  | 'write';

export type SampleOption = { key: string; text?: string };

export type SampleAnswer = {
  key?: string;
  keys?: string[];
  accepted?: string[];
  sample?: string;
  rubric?: Record<string, string>;
};

export type SampleQuestionContent = {
  options?: SampleOption[];
  prepSeconds?: number;
  responseSeconds?: number;
};

export type SampleGroupContent = {
  options?: SampleOption[];
  allowReuse?: boolean;
  template?: string;
  table?: { headers?: string[]; rows: string[][] };
  info?: { title?: string; rows: string[][] };
};

export type SampleQuestion = {
  n: number;
  nTo?: number;
  prompt?: string | null;
  content?: SampleQuestionContent;
  answer: SampleAnswer;
};

export type Passage = { title: string; paragraphs: [string, string][] };

export type Figure = 'photo' | 'diagram' | 'map';

export type TypeSample = {
  id: string;
  type: QuestionType;
  also?: QuestionType[];
  section: string;
  view: PreviewView;
  tags: string[];
  desc: string;
  group: {
    instruction: string;
    wordLimit?: number;
    content?: SampleGroupContent;
  };
  questions: SampleQuestion[];
  passage?: Passage;
  passageText?: string;
  transcript?: string;
  audio?: string;
  figure?: Figure;
  boxTitle?: string;
  variant?: 'form' | 'note' | 'flow';
  email?: boolean;
  rows?: number;
  minWords?: number;
};

const URBAN: Passage = {
  title: 'The rise of urban farming',
  paragraphs: [
    [
      'A',
      'In the last two decades, cities around the world have seen a quiet revival of food growing. Rooftops, abandoned lots and even shipping containers now produce vegetables for local markets.',
    ],
    [
      'B',
      'Early projects were run by volunteers and depended on donated land. Many closed within a few years when owners sold the plots to developers.',
    ],
    [
      'C',
      'More recent schemes use hydroponics, growing plants in nutrient-rich water instead of soil. Supporters claim this uses up to 90 percent less water than conventional farming.',
    ],
    [
      'D',
      'Critics point out that the energy needed for lighting and climate control can be high. A 2019 study in Singapore found that indoor farms used more electricity per kilogram than imported produce required for transport.',
    ],
    [
      'E',
      'City governments have begun to respond. Paris now requires new commercial buildings to include either green roofs or solar panels, and several cities offer tax reductions for rooftop farms.',
    ],
  ],
};

const letters = (...keys: string[]) => keys.map((key) => ({ key }));

export const SAMPLES: TypeSample[] = [
  // ===== Multiple choice =====
  {
    section: 'Multiple choice',
    id: 'mc',
    type: QuestionType.MULTIPLE_CHOICE,
    view: 'mcq',
    tags: ['IELTS Listening', 'IELTS Reading', 'TOEIC Part 3, 4, 5, 7'],
    desc: 'One question, one correct letter. The student clicks a single option.',
    group: { instruction: 'Choose the correct letter, A, B or C.' },
    audio: '0:48',
    questions: [
      {
        n: 1,
        prompt: 'Where will the speakers meet on Friday?',
        content: {
          options: [
            { key: 'A', text: 'at the station' },
            { key: 'B', text: 'in the office' },
            { key: 'C', text: 'at the café' },
          ],
        },
        answer: { key: 'B' },
      },
      {
        n: 2,
        prompt: 'What does the woman need to bring?',
        content: {
          options: [
            { key: 'A', text: 'a passport photo' },
            { key: 'B', text: 'a utility bill' },
            { key: 'C', text: 'her student card' },
          ],
        },
        answer: { key: 'C' },
      },
    ],
  },
  {
    section: 'Multiple choice',
    id: 'mcm',
    type: QuestionType.MULTIPLE_CHOICE_MULTI,
    view: 'multi',
    tags: ['IELTS Listening', 'IELTS Reading'],
    desc: 'One question row covers a number range (here 3–4). The student ticks exactly N boxes; each correct key scores one mark, order does not matter.',
    group: { instruction: 'Choose TWO letters, A–E.' },
    questions: [
      {
        n: 3,
        nTo: 4,
        prompt:
          'Which TWO benefits of the new library does the speaker mention?',
        content: {
          options: [
            { key: 'A', text: 'longer opening hours' },
            { key: 'B', text: 'free parking' },
            { key: 'C', text: "a larger children's section" },
            { key: 'D', text: 'quiet study rooms' },
            { key: 'E', text: 'a rooftop café' },
          ],
        },
        answer: { keys: ['A', 'D'] },
      },
    ],
  },

  // ===== Judgement =====
  {
    section: 'Judgement',
    id: 'tfng',
    type: QuestionType.TRUE_FALSE_NOT_GIVEN,
    also: [QuestionType.YES_NO_NOT_GIVEN],
    view: 'judge',
    tags: ['IELTS Reading'],
    passage: URBAN,
    desc: "The passage sits next to a list of statements. The student picks TRUE / FALSE / NOT GIVEN for each. YES_NO_NOT_GIVEN looks the same with YES / NO / NOT GIVEN (used for the writer's opinions). No content is stored — the statement is the question prompt.",
    group: {
      instruction:
        'Do the following statements agree with the information given in the reading passage?\nWrite TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.',
    },
    questions: [
      {
        n: 5,
        prompt:
          'Most early urban farming projects were on land owned by the farmers.',
        answer: { key: 'FALSE' },
      },
      {
        n: 6,
        prompt:
          'Hydroponic systems can use far less water than traditional farms.',
        answer: { key: 'TRUE' },
      },
      {
        n: 7,
        prompt:
          'Indoor farms in Singapore are more profitable than imported produce.',
        answer: { key: 'NOT GIVEN' },
      },
    ],
  },

  // ===== Matching =====
  {
    section: 'Matching',
    id: 'mh',
    type: QuestionType.MATCHING_HEADINGS,
    view: 'matching',
    boxTitle: 'List of Headings',
    tags: ['IELTS Reading'],
    passage: URBAN,
    desc: 'The list of options is stored once on the group; each question is a paragraph and gets a dropdown of option keys.',
    group: {
      instruction:
        'The reading passage has five paragraphs, A–E. Choose the correct heading for paragraphs B–E from the list of headings below.',
      content: {
        options: [
          { key: 'i', text: 'Weighing the environmental cost' },
          { key: 'ii', text: 'From empty spaces to productive land' },
          { key: 'iii', text: 'A short-lived first wave' },
          { key: 'iv', text: 'Official encouragement' },
          { key: 'v', text: 'Technology replaces soil' },
          { key: 'vi', text: 'The rising price of vegetables' },
        ],
        allowReuse: false,
      },
    },
    questions: [
      { n: 8, prompt: 'Paragraph B', answer: { key: 'iii' } },
      { n: 9, prompt: 'Paragraph C', answer: { key: 'v' } },
      { n: 10, prompt: 'Paragraph D', answer: { key: 'i' } },
      { n: 11, prompt: 'Paragraph E', answer: { key: 'iv' } },
    ],
  },
  {
    section: 'Matching',
    id: 'mi',
    type: QuestionType.MATCHING_INFORMATION,
    view: 'matching',
    tags: ['IELTS Reading'],
    passage: URBAN,
    desc: 'Keys are the paragraph letters; option text is optional, so there is no list box — only the letter dropdown.',
    group: {
      instruction:
        'The reading passage has five paragraphs, A–E. Which paragraph contains the following information?\nNB You may use any letter more than once.',
      content: { options: letters('A', 'B', 'C', 'D', 'E'), allowReuse: true },
    },
    questions: [
      {
        n: 12,
        prompt: 'a reference to a legal requirement',
        answer: { key: 'E' },
      },
      { n: 13, prompt: 'a comparison of energy use', answer: { key: 'D' } },
      {
        n: 14,
        prompt: 'a reason why some projects failed',
        answer: { key: 'B' },
      },
    ],
  },
  {
    section: 'Matching',
    id: 'mf',
    type: QuestionType.MATCHING_FEATURES,
    view: 'matching',
    boxTitle: 'List of People',
    tags: ['IELTS Reading', 'IELTS Listening'],
    desc: 'Match each statement to a person / place / feature. With allowReuse the same letter can be picked for several questions.',
    group: {
      instruction:
        'Match each statement with the correct person, A, B or C.\nNB You may use any letter more than once.',
      content: {
        options: [
          { key: 'A', text: 'Dr Lena Ortiz' },
          { key: 'B', text: 'Prof. Kenji Sato' },
          { key: 'C', text: 'Maria Bell' },
        ],
        allowReuse: true,
      },
    },
    questions: [
      {
        n: 15,
        prompt: 'Rooftop farms improve relations between neighbours.',
        answer: { key: 'A' },
      },
      {
        n: 16,
        prompt: 'The cost of artificial lighting is often underestimated.',
        answer: { key: 'B' },
      },
      {
        n: 17,
        prompt: 'Small farms will never meet the demand of a large city.',
        answer: { key: 'B' },
      },
    ],
  },
  {
    section: 'Matching',
    id: 'mse',
    type: QuestionType.MATCHING_SENTENCE_ENDINGS,
    view: 'matching',
    boxTitle: 'Endings',
    tags: ['IELTS Reading'],
    desc: 'Each question prompt is a sentence beginning; the student chooses the ending letter.',
    group: {
      instruction: 'Complete each sentence with the correct ending, A–E.',
      content: {
        options: [
          { key: 'A', text: 'were often lost to property development.' },
          { key: 'B', text: 'must include green roofs or solar panels.' },
          { key: 'C', text: 'use less water than soil-based farms.' },
          { key: 'D', text: 'are cheaper than imported vegetables.' },
          { key: 'E', text: 'may consume a lot of electricity.' },
        ],
      },
    },
    questions: [
      { n: 18, prompt: 'Hydroponic farms', answer: { key: 'C' } },
      { n: 19, prompt: 'Early volunteer projects', answer: { key: 'A' } },
      {
        n: 20,
        prompt: 'New commercial buildings in Paris',
        answer: { key: 'B' },
      },
    ],
  },
  {
    section: 'Matching',
    id: 'cls',
    type: QuestionType.CLASSIFICATION,
    view: 'matching',
    boxTitle: 'Categories',
    tags: ['IELTS Reading'],
    desc: 'Same UI as other matching types; the options are categories that can be reused.',
    group: {
      instruction:
        'Classify the following features as belonging to\nA  volunteer farms   B  hydroponic farms   C  both',
      content: {
        options: [
          { key: 'A', text: 'volunteer farms' },
          { key: 'B', text: 'hydroponic farms' },
          { key: 'C', text: 'both' },
        ],
        allowReuse: true,
      },
    },
    questions: [
      { n: 21, prompt: 'grow food for local markets', answer: { key: 'C' } },
      { n: 22, prompt: 'rely on donated land', answer: { key: 'A' } },
      { n: 23, prompt: 'need climate control', answer: { key: 'B' } },
    ],
  },

  // ===== Completion =====
  {
    section: 'Completion',
    id: 'form',
    type: QuestionType.FORM_COMPLETION,
    view: 'template',
    variant: 'form',
    tags: ['IELTS Listening'],
    audio: '1:12',
    desc: 'The whole form lives in group.content.template; every {{n}} becomes a text box for question n. Graded against accepted after normalising + word limit.',
    group: {
      instruction:
        'Complete the form below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 1,
      content: {
        template:
          '# Customer details\nName: Sarah {{1}}\nAddress: 42 {{2}} Street, Bristol\nPostcode: {{3}}\nPreferred day for delivery: {{4}}',
      },
    },
    questions: [
      { n: 1, answer: { accepted: ['Jenkins'] } },
      { n: 2, answer: { accepted: ['Hill'] } },
      { n: 3, answer: { accepted: ['BS84RE', 'BS8 4RE'] } },
      { n: 4, answer: { accepted: ['Thursday'] } },
    ],
  },
  {
    section: 'Completion',
    id: 'note',
    type: QuestionType.NOTE_COMPLETION,
    view: 'template',
    variant: 'note',
    tags: ['IELTS Listening', 'IELTS Reading'],
    audio: '1:30',
    desc: 'Same storage as FORM_COMPLETION, rendered as headed bullet notes.',
    group: {
      instruction:
        'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 2,
      content: {
        template:
          '# Museum tour\n- Meeting point: the {{5}}\n- Tour lasts about {{6}} minutes\n# Facilities\n- Café closes at {{7}}\n- Lockers cost £{{8}}',
      },
    },
    questions: [
      { n: 5, answer: { accepted: ['main entrance', 'entrance'] } },
      { n: 6, answer: { accepted: ['90', 'ninety'] } },
      { n: 7, answer: { accepted: ['5 pm', '5pm', 'five pm', '17:00'] } },
      { n: 8, answer: { accepted: ['2', 'two'] } },
    ],
  },
  {
    section: 'Completion',
    id: 'flow',
    type: QuestionType.FLOW_CHART_COMPLETION,
    view: 'template',
    variant: 'flow',
    tags: ['IELTS Reading', 'IELTS Listening'],
    desc: 'Same storage; each line of the template is drawn as a step box with arrows between them.',
    group: {
      instruction:
        'Complete the flow-chart below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.',
      wordLimit: 2,
      content: {
        template:
          'Seeds are placed in trays of {{9}}\nTrays move to the germination room for {{10}} days\nSeedlings are transferred to floating {{11}}\nPlants are harvested and {{12}}',
      },
    },
    questions: [
      { n: 9, answer: { accepted: ['rock wool', 'rockwool'] } },
      { n: 10, answer: { accepted: ['5', 'five'] } },
      { n: 11, answer: { accepted: ['rafts'] } },
      { n: 12, answer: { accepted: ['packed', 'packaged'] } },
    ],
  },
  {
    section: 'Completion',
    id: 'sent',
    type: QuestionType.SENTENCE_COMPLETION,
    view: 'sentence',
    tags: ['IELTS Reading', 'IELTS Listening'],
    passage: URBAN,
    desc: "Usually no group template: each question's prompt holds its own sentence with {{n}}.",
    group: {
      instruction:
        'Complete the sentences below.\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.',
      wordLimit: 2,
    },
    questions: [
      {
        n: 13,
        prompt:
          'Hydroponics may use up to {{13}} less water than conventional farming.',
        answer: { accepted: ['90 percent', '90%', 'ninety percent'] },
      },
      {
        n: 14,
        prompt: 'Many early projects closed when land was sold to {{14}}.',
        answer: { accepted: ['developers'] },
      },
      {
        n: 15,
        prompt:
          'A study in {{15}} compared the electricity used by indoor farms with transport.',
        answer: { accepted: ['Singapore'] },
      },
    ],
  },
  {
    section: 'Completion',
    id: 'sum',
    type: QuestionType.SUMMARY_COMPLETION,
    view: 'summary',
    boxTitle: 'Word bank',
    tags: ['IELTS Reading', 'IELTS Listening'],
    passage: URBAN,
    desc: 'Template + optional word bank. With options, each gap is a letter dropdown and the answer is a key. Without options it behaves like note completion with accepted.',
    group: {
      instruction: 'Complete the summary using the list of words, A–F, below.',
      content: {
        template:
          'Urban farming first grew through {{16}} effort, but many early sites were lost to {{17}}. Newer farms rely on {{18}}, although their {{19}} remains a concern for critics.',
        options: [
          { key: 'A', text: 'volunteer' },
          { key: 'B', text: 'developers' },
          { key: 'C', text: 'technology' },
          { key: 'D', text: 'energy use' },
          { key: 'E', text: 'government' },
          { key: 'F', text: 'rainfall' },
        ],
      },
    },
    questions: [
      { n: 16, answer: { key: 'A' } },
      { n: 17, answer: { key: 'B' } },
      { n: 18, answer: { key: 'C' } },
      { n: 19, answer: { key: 'D' } },
    ],
  },
  {
    section: 'Completion',
    id: 'table',
    type: QuestionType.TABLE_COMPLETION,
    view: 'table',
    tags: ['IELTS Listening', 'IELTS Reading'],
    audio: '1:05',
    desc: 'group.content.table holds headers (optional) and rows; any cell may contain {{n}}.',
    group: {
      instruction:
        'Complete the table below.\nWrite ONE WORD ONLY for each answer.',
      wordLimit: 1,
      content: {
        table: {
          headers: ['Event', 'Day', 'Location'],
          rows: [
            ['Opening talk', 'Monday', '{{20}} hall'],
            ['Cookery class', '{{21}}', 'Kitchen 2'],
            ['{{22}} tour', 'Friday', 'Main gate'],
          ],
        },
      },
    },
    questions: [
      { n: 20, answer: { accepted: ['main'] } },
      { n: 21, answer: { accepted: ['Wednesday'] } },
      { n: 22, answer: { accepted: ['garden'] } },
    ],
  },

  // ===== Labelling =====
  {
    section: 'Labelling',
    id: 'diag',
    type: QuestionType.DIAGRAM_LABELLING,
    view: 'diagram',
    figure: 'diagram',
    tags: ['IELTS Reading', 'IELTS Listening'],
    desc: 'No content: the image (image_media_id) already shows the numbers. Each question is a text box graded with accepted.',
    group: {
      instruction:
        'Label the diagram below.\nChoose ONE WORD from the passage for each answer.',
      wordLimit: 1,
    },
    questions: [
      { n: 23, answer: { accepted: ['filter'] } },
      { n: 24, answer: { accepted: ['tank'] } },
      { n: 25, answer: { accepted: ['pump'] } },
    ],
  },
  {
    section: 'Labelling',
    id: 'map',
    type: QuestionType.MAP_LABELLING,
    also: [QuestionType.PLAN_LABELLING],
    view: 'map',
    figure: 'map',
    tags: ['IELTS Listening'],
    audio: '1:40',
    desc: 'group.content.options lists the letters printed on the map. The student fills a grid: one row per place, one column per letter. PLAN_LABELLING is identical with a floor plan.',
    group: {
      instruction:
        'Label the map below.\nWrite the correct letter, A–F, next to Questions 26–29.',
      content: { options: letters('A', 'B', 'C', 'D', 'E', 'F') },
    },
    questions: [
      { n: 26, prompt: 'Café', answer: { key: 'C' } },
      { n: 27, prompt: 'Gift shop', answer: { key: 'A' } },
      { n: 28, prompt: 'Toilets', answer: { key: 'F' } },
      { n: 29, prompt: 'Picnic area', answer: { key: 'D' } },
    ],
  },
  {
    section: 'Labelling',
    id: 'short',
    type: QuestionType.SHORT_ANSWER,
    view: 'short',
    tags: ['IELTS Reading', 'IELTS Listening'],
    passage: URBAN,
    desc: 'A direct question with a free-text box. No content; graded with accepted.',
    group: {
      instruction:
        'Answer the questions below.\nChoose NO MORE THAN THREE WORDS from the passage for each answer.',
      wordLimit: 3,
    },
    questions: [
      {
        n: 30,
        prompt: 'What do hydroponic plants grow in instead of soil?',
        answer: { accepted: ['nutrient-rich water', 'water'] },
      },
      {
        n: 31,
        prompt: 'Which city requires green roofs or solar panels?',
        answer: { accepted: ['Paris'] },
      },
    ],
  },

  // ===== TOEIC Listening & Reading =====
  {
    section: 'TOEIC Listening & Reading',
    id: 'photo',
    type: QuestionType.PHOTO_DESCRIPTION,
    view: 'photo',
    figure: 'photo',
    tags: ['TOEIC Part 1'],
    audio: '0:20',
    desc: 'A photo plus audio with four statements. The options carry no text (students only hear them), so the student just picks a bubble.',
    group: {
      instruction:
        'Look at the picture. You will hear four statements. Choose the one that best describes the picture.',
    },
    transcript:
      "(A) The man is opening a window.\n(B) The woman is putting on her coat.\n(C) They're looking at a laptop screen.\n(D) Some chairs are being stacked.",
    questions: [
      {
        n: 1,
        content: { options: letters('A', 'B', 'C', 'D') },
        answer: { key: 'C' },
      },
    ],
  },
  {
    section: 'TOEIC Listening & Reading',
    id: 'qr',
    type: QuestionType.QUESTION_RESPONSE,
    view: 'qresp',
    tags: ['TOEIC Part 2'],
    audio: '0:12',
    desc: 'Only audio: a question and three responses. Options A–C without text.',
    group: {
      instruction:
        'You will hear a question or statement and three responses. Select the best response.',
    },
    transcript:
      'When is the sales report due?\n(A) In the conference room.\n(B) By Thursday afternoon.\n(C) Yes, I reported it.',
    questions: [
      {
        n: 7,
        prompt: 'Mark your answer.',
        content: { options: letters('A', 'B', 'C') },
        answer: { key: 'B' },
      },
    ],
  },
  {
    section: 'TOEIC Listening & Reading',
    id: 'tc',
    type: QuestionType.TEXT_COMPLETION,
    view: 'textcomp',
    tags: ['TOEIC Part 6'],
    desc: 'The passage comes from group_passages with numbered gaps; each question has four text options. Choosing one fills the gap.',
    group: {
      instruction:
        'Read the text. Choose the best answer to complete each blank.',
    },
    passageText:
      'To: All staff\nFrom: Facilities Team\nSubject: Parking changes\n\nStarting next Monday, the east parking lot will be [[131]] for resurfacing. Employees who normally park there should use the visitor lot on Grove Street. [[132]], a shuttle bus will run every ten minutes between Grove Street and the main entrance.\n\nWe expect the work to be [[133]] by the end of the month. [[134]]',
    questions: [
      {
        n: 131,
        content: {
          options: [
            { key: 'A', text: 'close' },
            { key: 'B', text: 'closed' },
            { key: 'C', text: 'closing' },
            { key: 'D', text: 'closure' },
          ],
        },
        answer: { key: 'B' },
      },
      {
        n: 132,
        content: {
          options: [
            { key: 'A', text: 'However' },
            { key: 'B', text: 'Instead' },
            { key: 'C', text: 'In addition' },
            { key: 'D', text: 'Otherwise' },
          ],
        },
        answer: { key: 'C' },
      },
      {
        n: 133,
        content: {
          options: [
            { key: 'A', text: 'completed' },
            { key: 'B', text: 'complete' },
            { key: 'C', text: 'completing' },
            { key: 'D', text: 'completion' },
          ],
        },
        answer: { key: 'A' },
      },
      {
        n: 134,
        content: {
          options: [
            { key: 'A', text: 'Thank you for your patience.' },
            { key: 'B', text: 'The lot opened in 2015.' },
            { key: 'C', text: 'Please submit your report.' },
            { key: 'D', text: 'Visitors are welcome.' },
          ],
        },
        answer: { key: 'A' },
      },
    ],
  },

  // ===== Speaking =====
  {
    section: 'Speaking',
    id: 'ra',
    type: QuestionType.READ_ALOUD,
    view: 'speak',
    tags: ['TOEIC Speaking Q1–2'],
    desc: 'The text to read is the prompt. Timing (prepSeconds / responseSeconds) drives the countdown; the student records, then the sample is shown for review.',
    group: {
      instruction:
        'Read the text on the screen aloud. You will have 45 seconds to prepare and 45 seconds to read.',
    },
    questions: [
      {
        n: 1,
        prompt:
          'Welcome to Harbor City Museum. Today, our modern art gallery, sculpture garden, and history wing are open until six p.m. Guided tours begin every hour at the main desk. Please remember that photography is not permitted inside the special exhibition.',
        content: { prepSeconds: 45, responseSeconds: 45 },
        answer: {
          sample: '(Reference reading recorded by a native speaker.)',
          rubric: {
            pronunciation: 'Clear individual sounds',
            intonation: 'Natural stress and rhythm',
          },
        },
      },
    ],
  },
  {
    section: 'Speaking',
    id: 'dp',
    type: QuestionType.DESCRIBE_PICTURE,
    view: 'speak',
    figure: 'photo',
    tags: ['TOEIC Speaking Q3–4'],
    desc: 'Picture comes from the question image; student describes it in detail.',
    group: {
      instruction:
        'Describe the picture in as much detail as you can. You will have 45 seconds to prepare and 30 seconds to speak.',
    },
    questions: [
      {
        n: 3,
        prompt: null,
        content: { prepSeconds: 45, responseSeconds: 30 },
        answer: {
          sample:
            'This picture was taken in an office. Two people are sitting side by side at a desk, looking at a laptop. The woman on the left is pointing at the screen...',
        },
      },
    ],
  },
  {
    section: 'Speaking',
    id: 'rtq',
    type: QuestionType.RESPOND_TO_QUESTIONS,
    view: 'speak',
    tags: ['TOEIC Speaking Q5–7'],
    desc: 'Three short questions on one topic, each with its own timing.',
    group: {
      instruction:
        'Imagine that a marketing firm is doing research in your area. You have agreed to participate in a telephone interview about coffee shops.',
    },
    questions: [
      {
        n: 5,
        prompt:
          'How often do you go to a coffee shop, and who do you usually go with?',
        content: { prepSeconds: 3, responseSeconds: 15 },
        answer: {
          sample:
            'I go about twice a week, usually with colleagues after lunch.',
        },
      },
      {
        n: 6,
        prompt: 'What do you usually order?',
        content: { prepSeconds: 3, responseSeconds: 15 },
        answer: { sample: 'I normally get a latte and sometimes a pastry.' },
      },
      {
        n: 7,
        prompt:
          'What would make you visit a new coffee shop in your neighbourhood? Why?',
        content: { prepSeconds: 3, responseSeconds: 30 },
        answer: {
          sample:
            'A quiet place to work would attract me, because I often study on weekends...',
        },
      },
    ],
  },
  {
    section: 'Speaking',
    id: 'rui',
    type: QuestionType.RESPOND_USING_INFO,
    view: 'speak',
    tags: ['TOEIC Speaking Q8–10'],
    desc: 'group.content.info is a small table (optional title) the student reads before answering questions about it.',
    group: {
      instruction:
        'Answer three questions based on the information provided. You will have 45 seconds to read the information.',
      content: {
        info: {
          title: 'Regional Sales Conference — Grand Hotel, May 12',
          rows: [
            ['9:00 a.m.', 'Welcome speech — Linda Park'],
            ['10:00 a.m.', 'Workshop: Online marketing'],
            ['12:00 p.m.', 'Lunch (Garden Room)'],
            ['1:30 p.m.', 'Workshop: Customer retention (cancelled)'],
            ['3:00 p.m.', 'Panel discussion'],
          ],
        },
      },
    },
    questions: [
      {
        n: 8,
        prompt:
          'What time does the conference start, and who gives the first talk?',
        content: { prepSeconds: 3, responseSeconds: 15 },
        answer: {
          sample: 'It starts at 9 a.m. with a welcome speech by Linda Park.',
        },
      },
      {
        n: 9,
        prompt:
          'I heard there is a workshop on customer retention in the afternoon. Is that right?',
        content: { prepSeconds: 3, responseSeconds: 15 },
        answer: { sample: 'Actually, that workshop has been cancelled.' },
      },
      {
        n: 10,
        prompt: 'Could you tell me about everything scheduled before lunch?',
        content: { prepSeconds: 3, responseSeconds: 30 },
        answer: {
          sample:
            'Sure. At 9 there is a welcome speech, then at 10 a workshop on online marketing...',
        },
      },
    ],
  },
  {
    section: 'Speaking',
    id: 'eo',
    type: QuestionType.EXPRESS_OPINION,
    view: 'speak',
    tags: ['TOEIC Speaking Q11'],
    desc: 'One opinion question with a long response window.',
    group: {
      instruction:
        'Give your opinion about a specific topic. Say as much as you can in the time allowed.',
    },
    questions: [
      {
        n: 11,
        prompt:
          'Some people think employees should be allowed to work from home every day. Do you agree or disagree? Give reasons and examples.',
        content: { prepSeconds: 45, responseSeconds: 60 },
        answer: {
          sample:
            'I partly agree. Working from home saves commuting time, but teams also need face-to-face contact...',
          rubric: {
            organisation: 'Clear opinion + 2 supported reasons',
            language: 'Range of vocabulary and grammar',
          },
        },
      },
    ],
  },

  // ===== Writing =====
  {
    section: 'Writing',
    id: 'wsp',
    type: QuestionType.WRITE_SENTENCE_PICTURE,
    view: 'write',
    figure: 'photo',
    rows: 2,
    tags: ['TOEIC Writing Q1–5'],
    desc: 'Picture + two words or phrases (in the prompt). The student writes ONE sentence that uses both.',
    group: {
      instruction:
        'Write ONE sentence based on the picture, using the TWO words or phrases given. You can change the forms of the words and use them in any order.',
    },
    questions: [
      {
        n: 1,
        prompt: 'woman / laptop',
        content: { responseSeconds: 480 },
        answer: {
          sample: 'The woman is pointing at something on the laptop.',
        },
      },
    ],
  },
  {
    section: 'Writing',
    id: 'rwr',
    type: QuestionType.RESPOND_WRITTEN_REQUEST,
    view: 'write',
    email: true,
    rows: 8,
    tags: ['TOEIC Writing Q6–7'],
    desc: 'An email is shown (prompt); the student writes a reply that completes the stated tasks.',
    group: {
      instruction:
        'Read the e-mail. Respond as if you are the store manager. In your e-mail, give TWO pieces of information and make ONE request.',
    },
    questions: [
      {
        n: 6,
        prompt:
          'From: Daniel Moore\nTo: Store manager\nSubject: Order #4471\n\nHello, I ordered a desk lamp from your website two weeks ago, but it has not arrived yet. Could you tell me what is happening with my order?',
        content: { responseSeconds: 600 },
        answer: {
          sample:
            'Dear Mr Moore,\nThank you for contacting us. Your lamp was delayed because... It will be shipped tomorrow and should arrive by Friday. Could you please confirm your delivery address?',
        },
      },
    ],
  },
  {
    section: 'Writing',
    id: 'oe',
    type: QuestionType.OPINION_ESSAY,
    view: 'write',
    rows: 12,
    minWords: 300,
    tags: ['TOEIC Writing Q8', 'IELTS Writing Task 2'],
    desc: 'A single essay question; long timer and a live word counter.',
    group: {
      instruction:
        'Write an essay in response to the question. Typically, an effective response will contain a minimum of 300 words.',
    },
    questions: [
      {
        n: 8,
        prompt:
          'Some people believe that university education should be free for everyone. Do you agree or disagree? Use specific reasons and examples to support your opinion.',
        content: { responseSeconds: 1800 },
        answer: {
          sample:
            'In many countries the cost of higher education has risen sharply...',
          rubric: {
            TA: 'Task achievement',
            CC: 'Coherence & cohesion',
            LR: 'Lexical resource',
            GRA: 'Grammar range & accuracy',
          },
        },
      },
    ],
  },
];

const YES_NO: Record<string, string> = { TRUE: 'YES', FALSE: 'NO' };

// YES_NO_NOT_GIVEN reuses the TRUE_FALSE_NOT_GIVEN sample with its own keys
const toYesNo = (sample: TypeSample): TypeSample => ({
  ...sample,
  type: QuestionType.YES_NO_NOT_GIVEN,
  also: [QuestionType.TRUE_FALSE_NOT_GIVEN],
  group: {
    ...sample.group,
    instruction: sample.group.instruction.replace(
      /\b(TRUE|FALSE)\b/g,
      (word) => YES_NO[word],
    ),
  },
  questions: sample.questions.map((q) => ({
    ...q,
    answer: { key: YES_NO[q.answer.key ?? ''] ?? q.answer.key },
  })),
});

export const findSample = (type: QuestionType) => {
  const sample =
    SAMPLES.find((s) => s.type === type || s.also?.includes(type)) ??
    SAMPLES[0];
  return type === QuestionType.YES_NO_NOT_GIVEN ? toYesNo(sample) : sample;
};

// question_groups + questions as the service stores them
export const storedShape = (sample: TypeSample) => ({
  questionType: sample.type,
  instruction: sample.group.instruction,
  ...(sample.group.wordLimit != null && { wordLimit: sample.group.wordLimit }),
  content: sample.group.content ?? null,
  questions: sample.questions.map((q) => ({
    numberFrom: q.n,
    numberTo: q.nTo ?? q.n,
    prompt: q.prompt ?? null,
    content: q.content ?? null,
    answer: q.answer,
  })),
});
