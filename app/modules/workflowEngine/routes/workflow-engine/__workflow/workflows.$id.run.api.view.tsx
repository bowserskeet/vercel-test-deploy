import { Link, useParams, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import MonacoEditor from "~/components/editors/MonacoEditor";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import InputText from "~/components/ui/input/InputText";
import WorkflowInputExamplesDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowInputExamplesDropdown";
import WorkflowRunDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowRunDropdown";
import WorkflowUtils from "~/modules/workflowEngine/helpers/WorkflowUtils";
import UrlUtils from "~/utils/app/UrlUtils";
import { WorkflowsIdRunApiApi } from "./workflows.$id.run.api.server";
import { WorkflowExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowExecutionDto";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";

export default function WorkflowsIdRunApiApiView() {
  const data = useTypedLoaderData<WorkflowsIdRunApiApi.LoaderData>();
  const actionData = useTypedActionData<WorkflowsIdRunApiApi.ActionData>();
  const params = useParams();
  const submit = useSubmit();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [execution, setExecution] = useState<WorkflowExecutionDto | null>(null);
  const [inputData, setInputData] = useState("{}");

  useEffect(() => {
    if (data.workflow.inputExamples.length > 0) {
      setSelectedTemplate(data.workflow.inputExamples[0].title);
      setInputData(JSON.stringify(data.workflow.inputExamples[0].input, null, 2));
    }
  }, [data]);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success);
    }

    if (actionData?.execution) {
      setExecution(actionData.execution);
    }
  }, [actionData]);

  function onExecute() {
    const form = new FormData();
    form.append("action", "execute");
    form.append("input", inputData);
    submit(form, {
      method: "post",
    });
  }

  return (
    <div>
      <div className="w-full border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        <BreadcrumbSimple
          menu={[{ title: "Workflows", routePath: UrlUtils.getModulePath(params, `workflow-engine/workflows`) }, { title: data.workflow.name }]}
        />
      </div>
      <div className="w-full border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        <div className="flex justify-between">
          <Link
            to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${data.workflow.id}/executions`)}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <span className="mr-1">&larr;</span> Back to executions
          </Link>
          <WorkflowRunDropdown workflow={data.workflow} />
        </div>
      </div>
      <div className="mx-auto max-w-2xl space-y-2 p-4">
        <div className="flex justify-between space-x-2">
          <div className="text-lg font-semibold">Run Workflow using the API</div>
        </div>

        {!execution ? (
          <div>
            <div className="space-y-1">
              <div className="flex items-center justify-between space-x-2">
                <div className="text-sm font-medium">{selectedTemplate || "Body"}</div>
                {data.workflow.inputExamples.length > 0 && (
                  <WorkflowInputExamplesDropdown
                    workflow={data.workflow}
                    onSelected={(item) => {
                      setSelectedTemplate(item.title);
                      setInputData(JSON.stringify(item.input, null, 2));
                    }}
                  />
                )}
              </div>

              <div className="overflow-hidden rounded-md border border-gray-200">
                <MonacoEditor className="h-20" theme="light" value={inputData} onChange={setInputData} hideLineNumbers tabSize={2} language="json" />
              </div>
              <InputText title="URL" defaultValue={`/api/workflows/run/${data.workflow.id}`} readOnly />
              <InputText title="Method" defaultValue="POST" readOnly />
              <InputText title="Header: X-Api-Key" defaultValue="Your API key" readOnly />
            </div>
            <div className="flex justify-end pt-2">
              <LoadingButton actionName="execute" onClick={onExecute} disabled={!WorkflowUtils.canRun(data.workflow)}>
                Run {!WorkflowUtils.canRun(data.workflow) && <span className="ml-1 text-xs opacity-50"> (not live)</span>}
              </LoadingButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link
                target="_blank"
                to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${data.workflow.id}/executions?executionId=${execution.id}`)}
                className="flex w-full flex-col items-center rounded-lg border-2 border-dotted border-gray-300 bg-white p-3 text-sm font-medium hover:border-dashed hover:border-gray-800"
              >
                <>
                  <div className="flex justify-center">
                    <div className=" ">View execution flow</div>
                  </div>
                </>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setExecution(null);
                }}
                className="flex w-full flex-col items-center rounded-lg border-2 border-dotted border-gray-300 bg-white p-3 text-sm font-medium hover:border-dashed hover:border-gray-800"
              >
                <div className="flex justify-center">
                  <div className=" ">Run again</div>
                </div>
              </button>
            </div>

            <div className="overflow-hidden rounded-md border border-gray-200">
              <MonacoEditor className="h-40" theme="vs-dark" value={JSON.stringify({ execution }, null, 2)} hideLineNumbers tabSize={2} language="json" />
            </div>
          </div>
        )}

        {actionData?.error && (
          <ErrorBanner title="Error">
            <div>{actionData.error}</div>
            {actionData.error === "No valid API key found" && params.tenant && (
              <div>
                <Link className="underline" target="_blank" to={`/app/${params.tenant}/settings/api/keys`}>
                  Click here to create a new API key.
                </Link>
              </div>
            )}
          </ErrorBanner>
        )}
      </div>
    </div>
  );
}
