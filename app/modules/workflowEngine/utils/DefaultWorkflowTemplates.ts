import { WorkflowsTemplateDto } from "../dtos/WorkflowsTemplateDto";

const templates: WorkflowsTemplateDto[] = [
  {
    title: "Sample HTTP Requests",
    workflows: [
      {
        name: "Get JSONPlaceholder TODO Item",
        description: "Uses HTTP Request, IF, Switch, and Alert User blocks",
        blocks: [
          {
            id: "manualTrigger",
            type: "manual",
            description: "Triggers the workflow",
            input: {
              validation: JSON.stringify(
                {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                  },
                  required: ["id"],
                },
                null,
                2
              ),
            },
          },
          {
            id: "httpRequest",
            type: "httpRequest",
            description: "Fetches a todo item from JSONPlaceholder",
            input: {
              url: "{{$vars.jsonPlaceholderUrl}}/todos/{{$params.id}}",
              method: "GET",
              // body: "",
              // headers: {},
              throwsError: true,
            },
          },
          {
            id: "if",
            type: "if",
            description: "Checks if the request was successful",
            conditionGroups: [
              {
                type: "AND",
                conditions: [
                  {
                    variable: "{{httpRequest.statusCode}}",
                    operator: "=",
                    value: "200",
                  },
                ],
              },
            ],
          },
          {
            id: "logNotFound",
            type: "alertUser",
            description: "Logs not found",
            input: {
              type: "error",
              message: "Error: {{httpRequest.error}}",
            },
          },
          {
            id: "logFound",
            type: "alertUser",
            description: "Logs HTTP Request body",
            input: {
              message: `ID: {{httpRequest.body.id}},
  Title ({{httpRequest.body.title}},
  Completed: {{httpRequest.body.completed}}),
  User ID: {{httpRequest.body.userId}}`,
            },
          },
          {
            id: "switchTitle",
            type: "switch",
            description: "Switches based on the title",
            conditionGroups: [
              {
                type: "AND",
                case: "case1",
                conditions: [
                  {
                    variable: "{{httpRequest.body.title}}",
                    operator: "=",
                    value: "delectus aut autem",
                  },
                ],
              },
              {
                type: "AND",
                case: "case2",
                conditions: [
                  {
                    variable: "{{httpRequest.body.title}}",
                    operator: "contains",
                    value: "quis",
                  },
                ],
              },
            ],
          },
          {
            id: "switchCase1",
            type: "alertUser",
            description: "Logs equals: delectus aut autem",
            input: {
              message: "Case 1: {{httpRequest.body.title}}",
            },
          },
          {
            id: "switchCase2",
            type: "alertUser",
            description: "Logs contains: quis",
            input: {
              message: "Case 2: {{httpRequest.body.title}}",
            },
          },
          {
            id: "switchDefault",
            type: "alertUser",
            description: "Logs default case",
            input: {
              message: "Default case: {{httpRequest.body.title}}",
            },
          },
          {
            id: "alertUser",
            type: "alertUser",
            description: "Alerts user once the workflow is done",
            input: {
              message: `Workflow done!`,
            },
          },
        ],
        toBlocks: [
          { fromBlockId: "manualTrigger", toBlockId: "httpRequest" },
          { fromBlockId: "httpRequest", toBlockId: "if" },
          { fromBlockId: "if", toBlockId: "logNotFound", condition: "false" },
          { fromBlockId: "if", toBlockId: "logFound", condition: "true" },
          { fromBlockId: "logFound", toBlockId: "switchTitle" },
          { fromBlockId: "switchTitle", toBlockId: "switchCase1", condition: "case1" },
          { fromBlockId: "switchTitle", toBlockId: "switchCase2", condition: "case2" },
          { fromBlockId: "switchTitle", toBlockId: "switchDefault", condition: "default" },
          { fromBlockId: "switchCase1", toBlockId: "alertUser" },
          { fromBlockId: "switchCase2", toBlockId: "alertUser" },
          { fromBlockId: "switchDefault", toBlockId: "alertUser" },
        ],
        inputExamples: [
          { title: "Existing item", input: { id: 10 } },
          { title: "Non-existing item", input: { id: -1 } },
          {
            title: "ID parameter not provided",
            input: {},
          },
          {
            title: "ID parameter is not a number",
            input: { id: "abc" },
          },
          {
            title: "Case 1: is equal to 'delectus aut autem'",
            input: { id: 1 },
          },
          {
            title: "Case 2: contains 'quis'",
            input: { id: 2 },
          },
          {
            title: "Default case",
            input: { id: 3 },
          },
        ],
      },
    ],
    variables: [{ name: "jsonPlaceholderUrl", value: "https://jsonplaceholder.typicode.com" }],
  },
  {
    title: "Alert User",
    workflows: [
      {
        name: "Alert User",
        description: "Alerts the user",
        blocks: [
          {
            id: "manualTrigger",
            type: "manual",
            description: "Triggers the workflow",
            input: {
              validation: JSON.stringify(
                {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                  required: ["message"],
                },
                null,
                2
              ),
            },
          },
          {
            id: "alertUser",
            type: "alertUser",
            description: "Alerts user once the workflow is done",
            input: {
              message: `{{$params.message}}`,
            },
          },
        ],
        toBlocks: [{ fromBlockId: "manualTrigger", toBlockId: "alertUser" }],
        inputExamples: [{ title: "Existing item", input: { message: "Hello world!" } }],
      },
    ],
    variables: [],
  },
  {
    title: "Iterator",
    workflows: [
      {
        name: "Loop items",
        description: "Iterate a string array",
        blocks: [
          {
            id: "iterator",
            type: "iterator",
            description: "Gets the array from {{$params.array}}",
            input: {
              variableName: "{{$params.array}}",
            },
            conditionGroups: [],
          },
          {
            id: "manual",
            type: "manual",
            description: "Send $params.array",
            input: {},
            conditionGroups: [],
          },
          {
            id: "log1",
            type: "log",
            description: "Logs item and index",
            input: {
              message: "{{iterator.index}}: {{iterator.item}}",
            },
            conditionGroups: [],
          },
          {
            id: "log2",
            type: "log",
            description: "Logs ended",
            input: {
              message: "Ended",
            },
            conditionGroups: [],
          },
        ],
        toBlocks: [
          {
            fromBlockId: "iterator",
            toBlockId: "log1",
            condition: "loopNext",
          },
          {
            fromBlockId: "iterator",
            toBlockId: "log2",
            condition: "loopEnd",
          },
          {
            fromBlockId: "manual",
            toBlockId: "iterator",
          },
        ],
        inputExamples: [
          {
            title: "String array",
            input: {
              array: ["value 1", "value 2"],
            },
          },
          {
            title: "Object array",
            input: {
              array: [
                {
                  name: "Value 1",
                  value: "value 1",
                },
                {
                  name: "Value 2",
                  value: "value 2",
                },
              ],
            },
          },
        ],
      },
    ],
    variables: [],
    credentialsRequired: [],
  },
];

export default templates;
