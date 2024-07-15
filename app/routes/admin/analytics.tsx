import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import AnalyticsOverview from "~/components/analytics/AnalyticsOverview";
import IndexPageLayout from "~/components/ui/layouts/IndexPageLayout";
import EnterpriseFeature from "~/components/ui/misc/EnterpriseFeature";
import { getTranslations } from "~/locale/i18next.server";
import { AnalyticsOverviewDto } from "~/utils/helpers/AnalyticsHelper";

type LoaderData = {
  title: string;
  overview: AnalyticsOverviewDto;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
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
  return json({
    title: `${t("analytics.title")} | ${process.env.APP_NAME}`,
    overview,
  });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function AdminAnalticsRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  return (
    <IndexPageLayout
      replaceTitleWithTabs={true}
      tabs={[
        {
          name: t("analytics.overview"),
          routePath: "/admin/analytics/overview",
        },
        {
          name: t("analytics.uniqueVisitors"),
          routePath: "/admin/analytics/visitors",
        },
        {
          name: t("analytics.pageViews"),
          routePath: "/admin/analytics/page-views",
        },
        {
          name: t("analytics.events"),
          routePath: "/admin/analytics/events",
        },
        {
          name: t("analytics.settings"),
          routePath: "/admin/analytics/settings",
        },
      ]}
    >
      <EnterpriseFeature />
      <AnalyticsOverview overview={data.overview} />
    </IndexPageLayout>
  );
}
