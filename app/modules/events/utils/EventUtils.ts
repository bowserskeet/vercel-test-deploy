import { AccountCreatedDto } from "../dtos/AccountCreatedDto";
import { MemberInvitationAcceptedDto } from "../dtos/MemberInvitationAcceptedDto";
import { MemberInvitationCreatedDto } from "../dtos/MemberInvitationCreatedDto";
import { RoleAssignedDto } from "../dtos/RoleAssignedDto";
import { SubscriptionCancelledDto } from "../dtos/SubscriptionCancelledDto";
import { SubscriptionEndedDto } from "../dtos/SubscriptionEndedDto";
import { SubscriptionSubscribedDto } from "../dtos/SubscriptionSubscribedDto";
import { UserProfileUpdatedDto } from "../dtos/UserProfileUpdatedDto";
import { ApplicationEvent, ApplicationEvents } from "../types/ApplicationEvent";
import { Event } from "@prisma/client";

function parseDescription(event: Event) {
  if (event.description) {
    return event.description;
  }
  try {
    const data = JSON.parse(event.data);
    return getDescription(event.name as ApplicationEvent, data);
  } catch (e) {
    return "Unknown event: " + event.name;
  }
}

function getDescription(event: ApplicationEvent, data: any) {
  const eventDescription = ApplicationEvents.find((f) => f.value === event)?.name;
  if (!eventDescription) {
    return "Unknown event";
  }
  try {
    switch (event) {
      case "user.profile.updated": {
        const payload = data as UserProfileUpdatedDto;
        return `${payload.email} updated their profile`;
      }
      case "account.created": {
        const payload = data as AccountCreatedDto;
        return `Account created: ${payload.tenant.name}`;
      }
      case "member.invitation.created": {
        const payload = data as MemberInvitationCreatedDto;
        return `${payload.fromUser.email} invited ${payload.user.email} to ${payload.tenant.name}`;
        break;
      }
      case "member.invitation.accepted": {
        const payload = data as MemberInvitationAcceptedDto;
        let prefix = payload.newUser ? "(New user) " : "";
        if (payload.fromUser) {
          return `${prefix}${payload.user.email} accepted the invitation to ${payload.tenant.name} from user ${payload.fromUser.email}`;
        }
        return `${prefix}${payload.user.email} accepted the invitation to ${payload.tenant.name}`;
      }
      case "role.assigned": {
        const payload = data as RoleAssignedDto;
        return `${payload.fromUser.email} assigned the role "${payload.role.name}" to ${payload.toUser.email}`;
      }
      case "subscription.subscribed": {
        const payload = data as SubscriptionSubscribedDto;
        if (payload.user) {
          return `${payload.user.email} subscribed ${payload.tenant.name} to ${payload.subscription.product.title}`;
        }
        return `${payload.tenant.name} subscribed to ${payload.subscription.product.title}`;
      }
      case "subscription.cancelled": {
        const payload = data as SubscriptionCancelledDto;
        return `${payload.tenant.name} cancelled their subscription ${payload.subscription?.product.title ?? ""}`;
      }
      case "subscription.ended": {
        const payload = data as SubscriptionEndedDto;
        return `${payload.tenant.name} cancelled their subscription ${payload.subscription?.product.title ?? ""}`;
      }
      // default:
      //   return assertNever(event);
    }
  } catch (e) {
    return eventDescription;
  }
}

// function assertNever(x: never): never {
//   throw new Error("Unexpected event: " + x);
// }

export default {
  parseDescription,
  getDescription,
};
