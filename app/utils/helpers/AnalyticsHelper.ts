import { CookieCategory } from "~/application/cookies/CookieCategory";
import { AppConfiguration } from "../db/appConfiguration.db.server";
import CookieHelper from "../helpers/CookieHelper";
import { UserSession } from "../session.server";

declare global {
  interface Window {
    gtag?: (option: string, gaTrackingId: string, options: Record<string, unknown>) => void;
  }
}

type AnalyticsProps = {
  url: string;
  rootData: { userSession: UserSession; appConfiguration: AppConfiguration };
  route?: string;
};

function addPageView({ url, rootData, route }: AnalyticsProps) {
  const gaTrackingId = rootData.appConfiguration?.analytics.googleAnalyticsTrackingId;
  if (CookieHelper.hasConsent(rootData.userSession, CookieCategory.ADVERTISEMENT) && gaTrackingId) {
    // console.log("[PAGE VIEW] Google Analytics");
    if (!window.gtag) {
      // eslint-disable-next-line no-console
      console.warn("window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet.");
    } else {
      window.gtag("config", gaTrackingId, {
        page_path: url,
      });
    }
  }
}

type EventProps = AnalyticsProps & {
  url?: string;
  action: string;
  category: string;
  label: string;
  value: string;
};
function addEvent({ url, route, action, category, label, value, rootData }: EventProps) {
  const gaTrackingId = rootData.appConfiguration?.analytics.googleAnalyticsTrackingId;
  if (CookieHelper.hasConsent(rootData.userSession, CookieCategory.ADVERTISEMENT) && gaTrackingId) {
    // console.log("[EVENT] Google Analytics");
    if (!window.gtag) {
      // eslint-disable-next-line no-console
      console.warn("window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet.");
    } else {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }
}

export type AnalyticsOverviewDto = {
  uniqueVisitors: number;
  pageViews: number;
  events: number;
  liveVisitors: number;
  top: {
    sources: { name: string | null; count: number }[];
    httpReferrers: { name: string | null; count: number }[];
    urls: { name: string | null; count: number }[];
    routes: { name: string | null; count: number }[];
    os: { name: string | null; count: number }[];
    devices: { name: string | null; count: number }[];
    countries: { name: string | null; count: number }[];
  };
};

export default {
  addPageView,
  addEvent,
};
