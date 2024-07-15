import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useTypedLoaderData } from "remix-typedjson";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { PortalWithDetails, getPortalById } from "~/modules/portals/db/portals.db.server";
import UrlUtils from "~/utils/app/UrlUtils";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import AnalyticsOverview from "~/components/analytics/AnalyticsOverview";
import { AnalyticsOverviewDto } from "~/utils/helpers/AnalyticsHelper";
import EnterpriseFeature from "~/components/ui/misc/EnterpriseFeature";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";

type LoaderData = {
  item: PortalWithDetails;
  overview: AnalyticsOverviewDto;
};
export let loader = async ({ request, params }: LoaderFunctionArgs) => {
  const appConfiguration = await getAppConfiguration({ request });
  if (!appConfiguration.portals?.analytics) {
    throw json({ error: "Analytics are not enabled" }, { status: 400 });
  }

  const tenantId = await getTenantIdOrNull({ request, params });
  const item = await getPortalById(tenantId, params.portal!);
  if (!item) {
    return redirect(UrlUtils.getModulePath(params, "portals"));
  }
  const overview: AnalyticsOverviewDto = {
    uniqueVisitors: 0,
    pageViews: 0,
    events: 0,
    liveVisitors: 0,
    top: {
      httpReferrers: [
        { name: "HTTP Referrer 1", count: 1 },
        { name: "HTTP Referrer 2", count: 2 },
      ],
      sources: [
        { name: "Source 1", count: 1 },
        { name: "Source 2", count: 2 },
      ],
      urls: [
        { name: "URL 1", count: 1 },
        { name: "URL 2", count: 2 },
      ],
      routes: [
        { name: "Route 1", count: 1 },
        { name: "Route 2", count: 2 },
      ],
      os: [
        { name: "OS 1", count: 1 },
        { name: "OS 2", count: 2 },
      ],
      devices: [
        { name: "Device 1", count: 1 },
        { name: "Device 2", count: 2 },
      ],
      countries: [
        { name: "Country 1", count: 1 },
        { name: "Country 2", count: 2 },
      ],
    },
  };
  const data: LoaderData = {
    item,
    overview,
  };
  return json(data);
};

export default function () {
  const { t } = useTranslation();
  const data = useTypedLoaderData<LoaderData>();
  const params = useParams();

  return (
    <EditPageLayout
      title={t("analytics.title")}
      withHome={false}
      menu={[
        // {
        //   title: t("models.portal.plural"),
        //   routePath: UrlUtils.getModulePath(params, "portals"),
        // },
        {
          title: data.item.title,
          routePath: UrlUtils.getModulePath(params, `portals/${data.item.subdomain}`),
        },
        {
          title: "Domain",
        },
      ]}
    >
      <div className="space-y-2 pb-10">
        <EnterpriseFeature />
        <AnalyticsOverview overview={data.overview} />
      </div>
    </EditPageLayout>
  );
}
