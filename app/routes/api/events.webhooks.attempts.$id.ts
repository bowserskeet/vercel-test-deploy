import { EventWebhookAttempt } from "@prisma/client";
import { ActionFunction, json } from "@remix-run/node";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { time, getServerTimingHeader } = await createMetrics({ request, params, enabled: false }, `api.events.webhooks.attempts.$id`);
  let attempt: EventWebhookAttempt | null = null;
  try {
    if (request.method === "POST") {
      attempt = await time(db.eventWebhookAttempt.findUnique({ where: { id: params.id ?? "" } }), "eventWebhookAttempt.findUnique");
      if (!attempt) {
        throw new Error("Invalid event webhook attempt");
      }
      await time(
        db.eventWebhookAttempt.update({
          where: {
            id: attempt.id,
          },
          data: {
            startedAt: new Date(),
          },
        }),
        "eventWebhookAttempt.update"
      );
      // eslint-disable-next-line no-console
      console.log("event-webhook-endpoint", attempt.endpoint);
      const body = await request.json();
      const response = await time(
        fetch(attempt.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }),
        "fetch"
      );
      if (response.ok) {
        await time(
          db.eventWebhookAttempt.update({
            where: {
              id: attempt.id,
            },
            data: {
              finishedAt: new Date(),
              success: true,
              status: response.status,
              message: response.statusText,
              body: JSON.stringify(await response.json()),
            },
          }),
          "eventWebhookAttempt.update"
        );
      } else {
        await time(
          db.eventWebhookAttempt.update({
            where: {
              id: attempt.id,
            },
            data: {
              finishedAt: new Date(),
              success: false,
              status: response.status,
              message: response.statusText,
            },
          }),
          "eventWebhookAttempt.update"
        );
      }

      return json({}, { status: 200, headers: getServerTimingHeader() });
    }
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log("event-webhook-attempt-error", e.message);
    if (attempt) {
      await time(
        db.eventWebhookAttempt.update({
          where: {
            id: attempt.id,
          },
          data: {
            finishedAt: new Date(),
            success: false,
            status: 400,
            message: e.message,
          },
        }),
        "eventWebhookAttempt.update"
      );
    }
    return json({ error: e.message }, { status: 400 });
  }
};
