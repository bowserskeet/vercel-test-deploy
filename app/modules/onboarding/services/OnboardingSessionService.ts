import { json } from "@remix-run/node";
import { OnboardingSessionWithDetails } from "../db/onboardingSessions.db.server";
import { OnboardingSessionActionDto } from "../dtos/OnboardingSessionActionDto";

async function started(session: OnboardingSessionWithDetails) {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function dismissed(session: OnboardingSessionWithDetails) {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function setStep(session: OnboardingSessionWithDetails, data: { fromIdx: number; toIdx: number; actions: OnboardingSessionActionDto[] }) {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function addActions(session: OnboardingSessionWithDetails, data: { actions: OnboardingSessionActionDto[] }) {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

async function complete(session: OnboardingSessionWithDetails, data: { fromIdx: number; actions: OnboardingSessionActionDto[] }) {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

export default {
  started,
  dismissed,
  setStep,
  complete,
  addActions,
};
