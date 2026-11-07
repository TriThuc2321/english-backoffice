API Changes
GET /api/auth/profile
⚠️ added the new assessment enum value to the role/permissions/items/subject/allOf[#/components/schemas/PermissionSubject]/ response property for the response status 200
GET /api/grading/queue
endpoint added
GET /api/grading/sections/{id}
endpoint added
GET /api/grading/sections/{id}/assessments
endpoint added
POST /api/grading/sections/{id}/assessments
endpoint added
GET /api/media
⚠️ added the new ATTEMPT enum value to the data/items/scope/allOf[#/components/schemas/MediaScope]/ response property for the response status 200
added the new enum value ATTEMPT to the query request parameter scope
POST /api/media
⚠️ added the new ATTEMPT enum value to the scope/allOf[#/components/schemas/MediaScope]/ response property for the response status 201
added the new ATTEMPT enum value to the request property scope/allOf[#/components/schemas/MediaScope]/
POST /api/media/upload-url
added the new ATTEMPT enum value to the request property scope/allOf[#/components/schemas/MediaScope]/
GET /api/media/{id}
⚠️ added the new ATTEMPT enum value to the scope/allOf[#/components/schemas/MediaScope]/ response property for the response status 200
PATCH /api/media/{id}
⚠️ added the new ATTEMPT enum value to the scope/allOf[#/components/schemas/MediaScope]/ response property for the response status 200
GET /api/permissions
⚠️ added the new assessment enum value to the items/subject/allOf[#/components/schemas/PermissionSubject]/ response property for the response status 200
GET /api/question-groups
⚠️ added the new IELTS_SPEAKING_PART_1 enum value to the items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_2 enum value to the items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_3 enum value to the items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_1 enum value to the items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_2 enum value to the items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
POST /api/question-groups
⚠️ added the new IELTS_SPEAKING_PART_1 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 201
⚠️ added the new IELTS_SPEAKING_PART_2 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 201
⚠️ added the new IELTS_SPEAKING_PART_3 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 201
⚠️ added the new IELTS_WRITING_TASK_1 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 201
⚠️ added the new IELTS_WRITING_TASK_2 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 201
added the new IELTS_SPEAKING_PART_1 enum value to the request property questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_SPEAKING_PART_2 enum value to the request property questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_SPEAKING_PART_3 enum value to the request property questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_WRITING_TASK_1 enum value to the request property questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_WRITING_TASK_2 enum value to the request property questionType/allOf[#/components/schemas/QuestionType]/
PATCH /api/question-groups/reorder
⚠️ added the new IELTS_SPEAKING_PART_1 enum value to the items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_2 enum value to the items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_3 enum value to the items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_1 enum value to the items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_2 enum value to the items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
GET /api/question-groups/{id}
⚠️ added the new IELTS_SPEAKING_PART_1 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_2 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_3 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_1 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_2 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
PATCH /api/question-groups/{id}
⚠️ added the new IELTS_SPEAKING_PART_1 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_2 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_3 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_1 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_2 enum value to the questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
added the new IELTS_SPEAKING_PART_1 enum value to the request property questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_SPEAKING_PART_2 enum value to the request property questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_SPEAKING_PART_3 enum value to the request property questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_WRITING_TASK_1 enum value to the request property questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_WRITING_TASK_2 enum value to the request property questionType/allOf[#/components/schemas/QuestionType]/
POST /api/roles
⚠️ added the new assessment enum value to the permissions/items/subject/allOf[#/components/schemas/PermissionSubject]/ response property for the response status 201
GET /api/roles/{id}
⚠️ added the new assessment enum value to the permissions/items/subject/allOf[#/components/schemas/PermissionSubject]/ response property for the response status 200
PATCH /api/roles/{id}
⚠️ added the new assessment enum value to the permissions/items/subject/allOf[#/components/schemas/PermissionSubject]/ response property for the response status 200
GET /api/student/attempts
added the required property data/items/sections/items/gradingStatus to the response with the 200 status
POST /api/student/attempts
added the required property sections/items/gradingStatus to the response with the 201 status
GET /api/student/attempts/{id}
added the required property sections/items/gradingStatus to the response with the 200 status
POST /api/student/attempts/{id}/audio
endpoint added
POST /api/student/attempts/{id}/audio/upload-url
endpoint added
GET /api/student/attempts/{id}/content
⚠️ added the new IELTS_SPEAKING_PART_1 enum value to the testSections/items/testParts/items/questionGroups/items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_2 enum value to the testSections/items/testParts/items/questionGroups/items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_3 enum value to the testSections/items/testParts/items/questionGroups/items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_1 enum value to the testSections/items/testParts/items/questionGroups/items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_2 enum value to the testSections/items/testParts/items/questionGroups/items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
GET /api/student/attempts/{id}/result
added the required property assessments to the response with the 200 status
added the required property attempt/sections/items/gradingStatus to the response with the 200 status
added the required property questions/items/audioUrl to the response with the 200 status
POST /api/student/attempts/{id}/sections/{sectionId}/submit
added the required property sections/items/gradingStatus to the response with the 201 status
POST /api/student/attempts/{id}/submit
added the required property sections/items/gradingStatus to the response with the 201 status
GET /api/student/tests/{slug}
⚠️ added the new IELTS_SPEAKING_PART_1 enum value to the testSections/items/testParts/items/questionGroups/items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_2 enum value to the testSections/items/testParts/items/questionGroups/items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_SPEAKING_PART_3 enum value to the testSections/items/testParts/items/questionGroups/items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_1 enum value to the testSections/items/testParts/items/questionGroups/items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
⚠️ added the new IELTS_WRITING_TASK_2 enum value to the testSections/items/testParts/items/questionGroups/items/questionType/allOf[#/components/schemas/QuestionType]/ response property for the response status 200
POST /api/tests/import
added the new IELTS_SPEAKING_PART_1 enum value to the request property sections/items/parts/items/groups/items/questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_SPEAKING_PART_2 enum value to the request property sections/items/parts/items/groups/items/questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_SPEAKING_PART_3 enum value to the request property sections/items/parts/items/groups/items/questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_WRITING_TASK_1 enum value to the request property sections/items/parts/items/groups/items/questionType/allOf[#/components/schemas/QuestionType]/
added the new IELTS_WRITING_TASK_2 enum value to the request property sections/items/parts/items/groups/items/questionType/allOf[#/components/schemas/QuestionType]/
