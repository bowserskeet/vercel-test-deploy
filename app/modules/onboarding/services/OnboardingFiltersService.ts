import { OnboardingFilter } from "@prisma/client";
import { json } from "@remix-run/node";

async function matches({ userId, tenantId, filter }: { userId: string; tenantId: string | null; filter: OnboardingFilter }) {
  throw json({ message: "Enterprise feature 🚀" }, { status: 501 });
}

export default {
  matches,
};
