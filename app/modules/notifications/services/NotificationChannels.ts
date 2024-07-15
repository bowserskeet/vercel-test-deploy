import { DefaultAdminRoles } from "~/application/dtos/shared/DefaultAdminRoles";
import { DefaultAppRoles } from "~/application/dtos/shared/DefaultAppRoles";

const NotificationChannelTypes = ["admin-accounts", "admin-users", "admin-subscriptions", "roles", "my-rows"] as const;
export type NotificationChannel = (typeof NotificationChannelTypes)[number];

export interface NotificationChannelDto {
  name: NotificationChannel;
  description: string;
  roles?: string[];
}

export const NotificationChannels: NotificationChannelDto[] = [
  {
    name: "admin-accounts",
    description: "accounts.created",
    roles: [DefaultAdminRoles.SuperAdmin],
  },
  {
    name: "admin-users",
    description: "users.profile.updated",
    roles: [DefaultAdminRoles.SuperAdmin],
  },
  {
    name: "admin-subscriptions",
    description: "subscriptions.created, subscriptions.cancelled",
    roles: [DefaultAdminRoles.SuperAdmin],
  },
  {
    name: "roles",
    description: "roles.assigned",
    roles: [DefaultAppRoles.SuperUser],
  },
  {
    name: "my-rows",
    description: "Send activity notifications to row creators: comment, edit",
  },
];
