import { Entity } from "@prisma/client";
import { AppOrAdminData } from "../data/useAppOrAdminData";
import { DefaultPermission } from "~/application/dtos/shared/DefaultPermissions";

export function getEntityPermissions(entity: Entity): { name: string; description: string }[] {
  return [
    { name: getEntityPermission(entity, "view"), description: `View ${entity.name} page` },
    { name: getEntityPermission(entity, "read"), description: `View ${entity.name} records` },
    { name: getEntityPermission(entity, "create"), description: `Create ${entity.name}` },
    { name: getEntityPermission(entity, "update"), description: `Update ${entity.name}` },
    { name: getEntityPermission(entity, "delete"), description: `Delete ${entity.name}` },
  ];
}

export function getEntityPermission(entity: { name: string }, permission: "view" | "read" | "create" | "update" | "delete"): DefaultPermission {
  return `entity.${entity.name}.${permission}` as DefaultPermission;
}

export function getUserHasPermission(appOrAdminData: AppOrAdminData, permission: DefaultPermission) {
  if (permission.startsWith("entity.")) {
    return true;
  }
  if (appOrAdminData?.permissions === undefined) {
    return true;
  }
  if (appOrAdminData.isSuperAdmin) {
    return true;
  }
  return appOrAdminData.permissions.includes(permission);
}
