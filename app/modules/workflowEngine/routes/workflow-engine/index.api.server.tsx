import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { db } from "~/utils/db.server";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";

export namespace WorkflowEngineIndexApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    summary: {
      workflowsTotal: number;
      credentialsTotal: number;
      variablesTotal: number;
      executionsTotal: number;
    };
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const data: LoaderData = {
      metatags: [{ title: `Workflows | ${process.env.APP_NAME}` }],
      summary: {
        workflowsTotal: await db.workflow.count({ where: { tenantId } }),
        credentialsTotal: await db.workflowCredential.count({ where: { tenantId } }),
        variablesTotal: await db.workflowVariable.count({ where: { tenantId } }),
        executionsTotal: await db.workflowExecution.count({ where: { tenantId } }),
      },
    };
    return json(data);
  };
}
