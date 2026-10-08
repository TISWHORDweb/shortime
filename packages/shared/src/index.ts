export const USER_ROLES = ["fan", "creator", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
