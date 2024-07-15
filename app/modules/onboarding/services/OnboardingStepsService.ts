import { TFunction } from "i18next";
import { OnboardingWithDetails } from "../db/onboarding.db.server";
import { json } from "@remix-run/node";

async function setSteps(_: { item: OnboardingWithDetails; form: FormData; t: TFunction }) {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}
export default {
  setSteps,
};
