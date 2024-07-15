import { OnboardingFilter } from "@prisma/client";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { OnboardingWithDetails } from "../db/onboarding.db.server";
import { OnboardingSessionWithDetails } from "../db/onboardingSessions.db.server";
import { OnboardingCandidateDto } from "../dtos/OnboardingCandidateDto";
import { OnboardingFilterMetadataDto } from "../dtos/OnboardingFilterMetadataDto";
import { json } from "@remix-run/node";

async function getUserActiveOnboarding({
  userId,
  tenantId,
  request,
}: {
  userId: string;
  tenantId: string | null;
  request: Request;
}): Promise<OnboardingSessionWithDetails | null> {
  const appConfiguration = await getAppConfiguration({ request });
  if (!appConfiguration.onboarding.enabled) {
    return null;
  }
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function getMatchingFilters(_: { userId: string; tenantId: string | null; filters: OnboardingFilter[] }): Promise<OnboardingFilter[]> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function setOnboardingStatus(_id: string, _active: boolean): Promise<void> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function getCandidates(_: OnboardingWithDetails): Promise<OnboardingCandidateDto[]> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function getMetadata(): Promise<OnboardingFilterMetadataDto> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

export type OnboardingSummaryDto = {
  onboardings: { all: number; active: number };
  sessions: { all: number; active: number; dismissed: number; completed: number };
};
async function getSummary(): Promise<OnboardingSummaryDto> {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

export default {
  getUserActiveOnboarding,
  getMatchingFilters,
  setOnboardingStatus,
  getCandidates,
  getMetadata,
  getSummary,
};
