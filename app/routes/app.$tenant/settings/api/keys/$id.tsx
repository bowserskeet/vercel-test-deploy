import { ActionFunction, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useNavigate, useParams } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import ApiKeyForm from "~/components/core/apiKeys/ApiKeyForm";
import OpenModal from "~/components/ui/modals/OpenModal";
import { getTranslations } from "~/locale/i18next.server";
import UrlUtils from "~/utils/app/UrlUtils";
import { useAppData } from "~/utils/data/useAppData";
import { ApiKeyWithDetails, deleteApiKey, getApiKeyById, getApiKeys, updateApiKey } from "~/utils/db/apiKeys.db.server";
import { createLog } from "~/utils/db/logs.db.server";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";

type LoaderData = {
  item: ApiKeyWithDetails;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const item = await getApiKeyById(params.id ?? "");
  if (!item) {
    return redirect(UrlUtils.currentTenantUrl(params, "settings/api/keys"));
  }
  const data: LoaderData = {
    item,
  };
  return json(data);
};

type ActionData = {
  error?: string;
};
const badRequest = (data: ActionData) => json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  const { t } = await getTranslations(request);
  const tenantId = await getTenantIdFromUrl(params);
  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  const existing = await getApiKeyById(params.id ?? "");
  if (!existing) {
    return badRequest({ error: t("shared.notFound") });
  }
  if (action === "edit") {
    await verifyUserHasPermission(request, "app.settings.apiKeys.update", tenantId);
    const entities: { entityId: string; create: boolean; read: boolean; update: boolean; delete: boolean }[] = form
      .getAll("entities[]")
      .map((f: FormDataEntryValue) => {
        return JSON.parse(f.toString());
      });
    let expirationDate: Date | null = null;
    let expires = form.get("expires")?.toString();
    if (expires) {
      expirationDate = new Date(expires);
    }
    const alias = form.get("alias")?.toString() ?? "";
    const existingAlias = await getApiKeys(existing.tenantId);
    if (existingAlias.filter((f) => f.id !== existing.id && f.alias === alias).length > 0) {
      return badRequest({ error: "API key with this alias already exists: " + alias });
    }
    const active = Boolean(form.get("active"));
    await updateApiKey(
      params.id ?? "",
      {
        tenantId: tenantId,
        alias,
        expires: expirationDate,
        active,
      },
      entities
    );
    await createLog(request, tenantId, "API Key Updated", JSON.stringify({ tenantId: tenantId, alias, expirationDate, active, entities }));
    return redirect(UrlUtils.currentTenantUrl(params, "settings/api/keys"));
  } else if (action === "delete") {
    await verifyUserHasPermission(request, "app.settings.apiKeys.delete", tenantId);
    await deleteApiKey(params.id ?? "");
    await createLog(request, tenantId, "API Key Deleted", "");
    return redirect(UrlUtils.currentTenantUrl(params, "settings/api/keys"));
  } else {
    return badRequest({ error: t("shared.invalidForm") });
  }
};

export default function ApiEditKeyRoute() {
  const data = useTypedLoaderData<LoaderData>();
  const navigate = useNavigate();
  const appData = useAppData();
  const params = useParams();
  return (
    <>
      <OpenModal className="sm:max-w-xl" onClose={() => navigate(UrlUtils.currentTenantUrl(params, "settings/api/keys"))}>
        <ApiKeyForm
          entities={appData.entities}
          item={data.item}
          canUpdate={getUserHasPermission(appData, "app.settings.apiKeys.update")}
          canDelete={getUserHasPermission(appData, "app.settings.apiKeys.delete")}
        />
      </OpenModal>
    </>
  );
}
