import CryptoApi from "~/utils/api/.server/CryptoApi";
import { getAllWorkflowCredentials } from "../db/workflowCredentials.db.server";
import { getAllWorkflowVariables } from "../db/workflowVariable.db.server";

async function getCredentialsContext({ tenantId }: { tenantId: string | null }): Promise<{ [key: string]: string }> {
  let credentials: { [key: string]: string } = {};

  const items = await getAllWorkflowCredentials({ tenantId });
  items.forEach((item) => {
    const value = CryptoApi.decrypt(item.value);
    credentials[item.name] = value;
  });
  return credentials;
}

async function getVariablesContext({ tenantId }: { tenantId: string | null }): Promise<{ [key: string]: string }> {
  let variables: { [key: string]: string } = {};

  const items = await getAllWorkflowVariables({ tenantId });
  items.forEach((item) => {
    variables[item.name] = item.value;
  });
  return variables;
}

export default {
  getCredentialsContext,
  getVariablesContext,
};
