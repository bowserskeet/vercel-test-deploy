import { useMatches } from "@remix-run/react";
import { AppConfiguration } from "../db/appConfiguration.db.server";
import { UserSession } from "../session.server";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { ImpersonatingSessionDto } from "~/application/dtos/session/ImpersonatingSessionDto";
import { VersionDto } from "~/modules/shared/dtos/VersionDto";
import { UserWithoutPassword } from "../db/users.db.server";
import { TenantSimple } from "../db/tenants.db.server";

export type AppRootData = {
  metatags: MetaTagsDto;
  user: UserWithoutPassword | null;
  currentTenant: TenantSimple | null;
  theme: string;
  locale: string;
  serverUrl: string;
  domainName: string;
  userSession: UserSession;
  authenticated: boolean;
  debug: boolean;
  isStripeTest: boolean;
  chatWebsiteId?: string;
  appConfiguration: AppConfiguration;
  csrf?: string;
  featureFlags: string[];
  impersonatingSession: ImpersonatingSessionDto | null;
  version: VersionDto;
};

export function useRootData(): AppRootData {
  return (useMatches().find((f) => f.pathname === "/" || f.pathname === "")?.data ?? {}) as AppRootData;
}
