/* eslint-disable no-console */
import { Event } from "@prisma/client";
import NotificationService from "~/modules/notifications/services/.server/NotificationService";
import { getBaseURL } from "~/utils/url.server";
import { createEventWebhookAttempt, updateEventWebhookAttempt } from "../../db/eventWebhookAttempts.db.server";
import { createEvent } from "../../db/events.db.server";
import { ApplicationEvent, ApplicationEvents } from "../../types/ApplicationEvent";
import EventUtils from "../../utils/EventUtils";

type ICreateApplicationEvent = {
  request: Request;
  event: ApplicationEvent;
  tenantId: string | null;
  userId: string | null;
  data: any;
};
async function create({
  request,
  event,
  tenantId,
  userId,
  data,
  endpoints,
}: ICreateApplicationEvent & {
  endpoints?: string[];
}) {
  const description = EventUtils.getDescription(event, data) ?? "";
  const item = await createEvent({
    name: event,
    tenantId,
    userId,
    data: JSON.stringify(data),
    description,
  });

  await onEvent({ request, event, tenantId, userId, data, description }).catch((e) => {
    console.log("[Events] onEvent Error", e);
  });

  if (endpoints && endpoints.length > 0) {
    await Promise.all(
      endpoints.map(async (endpoint) => {
        return await callEventEndpoint({ request, event: item, endpoint, body: JSON.stringify(data) }).catch((e) => {
          console.log("[Events] callEventEndpoint Error", e);
        });
      })
    );
  }

  return event;
}

async function callEventEndpoint({ request, event, endpoint, body }: { request: Request; event: Event; endpoint: string; body: string }) {
  const webhookAttempt = await createEventWebhookAttempt({ eventId: event.id, endpoint });
  try {
    await fetch(getBaseURL(request) + `/api/events/webhooks/attempts/${webhookAttempt.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  } catch (e: any) {
    // While seeding the database it should not call endpoints
    await updateEventWebhookAttempt(webhookAttempt.id, {
      startedAt: new Date(),
      finishedAt: new Date(),
      success: false,
      status: 500,
      message: "Could not call webhook endpoint: " + e.message,
    });
  }
}

function assertNever(x: never): never {
  throw new Error("Unexpected event: " + x);
}

async function onEvent(params: ICreateApplicationEvent & { description: string }) {
  console.log(`[Events] ${params.event}: ${params.description}`);
  const event = ApplicationEvents.find((f) => f.value === params.event);
  if (!event) {
    console.log("[Events] Event not found: " + params.event);
    return;
  }
  const tenantId = params.tenantId;
  try {
    switch (event.value) {
      case "user.profile.updated": {
        break;
      }
      case "user.profile.deleted": {
        break;
      }
      case "account.created": {
        await NotificationService.sendToRoles({
          channel: "admin-accounts",
          tenantId,
          notification: {
            message: params.description,
            action: {
              title: "View account",
              url: `/admin/accounts/${tenantId}`,
            },
          },
        });
        break;
      }
      case "member.invitation.created": {
        break;
      }
      case "member.invitation.accepted": {
        break;
      }
      case "role.assigned": {
        await NotificationService.sendToRoles({
          channel: "roles",
          tenantId,
          notification: {
            message: params.description,
          },
        });
        break;
      }
      case "subscription.subscribed": {
        await NotificationService.sendToRoles({
          channel: "admin-subscriptions",
          tenantId,
          notification: {
            message: params.description,
          },
        });
        break;
      }
      case "subscription.cancelled": {
        await NotificationService.sendToRoles({
          channel: "admin-subscriptions",
          tenantId,
          notification: {
            message: params.description,
            action: { url: `/admin/accounts/${tenantId}` },
          },
        });
        break;
      }
      case "subscription.ended": {
        await NotificationService.sendToRoles({
          channel: "admin-subscriptions",
          tenantId,
          notification: {
            message: params.description,
            action: { url: `/admin/accounts/${tenantId}` },
          },
        });
        break;
      }
      default:
      // return assertNever(event);
    }
  } catch (e: any) {
    // ignore
  }
}

export default {
  create,
};
