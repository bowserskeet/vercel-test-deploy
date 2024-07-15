import { ApplicationEvents } from "~/modules/events/types/ApplicationEvent";
import WorkflowBlockActionIcon from "../components/icons/WorkflowBlockActionIcon";
import ConditionalIcon from "../components/nodes/flow/conditional/ConditionalIcon";
import DoNothingIcon from "../components/nodes/helpers/doNothing/DoNothingIcon";
import HttpRequestIcon from "../components/nodes/helpers/httpRequest/HttpRequestIcon";
import LogIcon from "../components/nodes/helpers/log/LogIcon";
import TriggerManualIcon from "../components/nodes/triggers/manual/TriggerManualIcon";

export const WorkflowBlockTypes: WorkflowBlockTypeDto[] = [
  {
    type: "trigger",
    category: "Misc",
    name: "Manual Trigger",
    value: "manual",
    icon: TriggerManualIcon,
    inputs: [
      { name: "validation", type: "monaco", label: "Validation", required: false, href: { url: "https://github.com/ajv-validator/ajv", label: "Learn more" } },
    ],
    outputs: [],
  },
  {
    type: "trigger",
    category: "App",
    name: "App Event",
    value: "event",
    icon: WorkflowBlockActionIcon,
    appliesToAllTenants: true,
    inputs: [
      {
        name: "event",
        type: "select",
        label: "Event",
        required: true,
        options: ApplicationEvents.map((f) => ({ value: f.value, label: `${f.value} (${f.value})`, adminOnly: f.adminOnly })),
      },
    ],
    outputs: [{ name: "data", label: "Data" }],
  },
  {
    type: "action",
    category: "Flow",
    name: "IF",
    value: "if",
    icon: ConditionalIcon,
    inputs: [],
    outputs: [],
  },
  {
    type: "action",
    category: "Flow",
    name: "Switch",
    value: "switch",
    icon: ConditionalIcon,
    inputs: [],
    outputs: [],
  },
  {
    type: "action",
    category: "Helpers",
    name: "HTTP Request",
    value: "httpRequest",
    icon: HttpRequestIcon,
    inputs: [
      { name: "url", type: "string", label: "URL", required: true, placeholder: "https://api.example.com" },
      {
        name: "method",
        type: "select",
        label: "Method",
        required: true,
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" },
          { label: "PATCH", value: "PATCH" },
          { label: "HEAD", value: "HEAD" },
          { label: "OPTIONS", value: "OPTIONS" },
        ],
      },
      { name: "body", type: "monaco", label: "Body", required: false },
      { name: "headers", type: "keyValue", label: "Headers", required: false },
      { name: "throwsError", type: "boolean", label: "Throws error", defaultValue: true },
    ],
    outputs: [
      { name: "statusCode", label: "Status Code" },
      { name: "body", label: "Body" },
      { name: "error", label: "Error" },
    ],
  },
  {
    type: "action",
    category: "Helpers",
    name: "Log",
    value: "log",
    icon: LogIcon,
    inputs: [{ name: "message", type: "string", label: "Message", required: true, placeholder: "Message to log..." }],
    outputs: [],
  },
  {
    type: "action",
    category: "Helpers",
    name: "Alert User",
    value: "alertUser",
    icon: LogIcon,
    inputs: [
      { name: "message", type: "string", label: "Message", required: true, placeholder: "Message to alert..." },
      {
        name: "type",
        type: "select",
        label: "Type",
        required: false,
        defaultValue: "success",
        options: [
          { label: "Success", value: "success" },
          { label: "Error", value: "error" },
        ],
      },
    ],
    outputs: [],
  },
  {
    type: "action",
    category: "Helpers",
    name: "Do Nothing",
    value: "doNothing",
    icon: DoNothingIcon,
    inputs: [],
    outputs: [],
  },
  {
    type: "action",
    category: "Flow",
    name: "Iterator",
    value: "iterator",
    icon: WorkflowBlockActionIcon,
    inputs: [{ name: "variableName", type: "string", label: "Variable Name", required: true }],
    outputs: [
      { name: "index", label: "Index" },
      { name: "item", label: "Item" },
      { name: "isFirst", label: "Is First" },
      { name: "isLast", label: "Is Last" },
    ],
  },
  {
    type: "action",
    category: "Flow",
    name: "Variable",
    value: "variable",
    icon: WorkflowBlockActionIcon,
    inputs: [
      { name: "variableName", type: "string", label: "Variable Name", required: true },
      { name: "value", type: "string", label: "Value", required: true },
    ],
    outputs: [],
  },
];
export type WorkflowBlockType = "manual" | "if" | "switch" | "httpRequest" | "log" | "alertUser" | "doNothing" | "iterator" | "variable" | "event";
export type WorkflowBlockTypeDto = {
  type: "trigger" | "action";
  category: "Misc" | "Flow" | "Helpers" | "Interaction" | "AI" | "Entities" | "App";
  name: string;
  value: WorkflowBlockType;
  icon: any;
  inputs: WorkflowBlockInput[];
  outputs: WorkflowBlockOutput[];
  appliesToAllTenants?: boolean;
};
export type WorkflowBlockInput = {
  name: string;
  type: "string" | "monaco" | "keyValue" | "select" | "boolean";
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
    adminOnly?: boolean;
  }[];
  defaultValue?: string | boolean;
  href?: { url: string; label: string };
};
export type WorkflowBlockOutput = {
  name: string;
  label: string;
};
