export type DemoRole = "admin" | "operator" | "viewer";

const accounts = {
  admin: {
    userId: 2,
    nickname: "系统管理员",
    username: "admin",
    roles: ["ROOT"],
    perms: [
      "sys:menu:delete",
      "sys:dept:edit",
      "sys:dict_type:add",
      "sys:dict:edit",
      "sys:dict:delete",
      "sys:dict_type:edit",
      "sys:menu:add",
      "sys:user:add",
      "sys:role:edit",
      "sys:dept:delete",
      "sys:user:edit",
      "sys:user:delete",
      "sys:user:password:reset",
      "sys:dept:add",
      "sys:role:delete",
      "sys:dict_type:delete",
      "sys:menu:edit",
      "sys:dict:add",
      "sys:role:add",
      "sys:user:query",
      "sys:user:export",
      "sys:user:import",
    ],
  },
  operator: {
    userId: 3,
    nickname: "运营专员",
    username: "operator",
    roles: ["OPERATOR"],
    perms: ["sys:user:query", "sys:user:edit"],
  },
  viewer: {
    userId: 4,
    nickname: "只读访客",
    username: "viewer",
    roles: ["VIEWER"],
    perms: ["sys:user:query"],
  },
} as const;

export function getDemoAccount(role?: string) {
  return accounts[role as DemoRole] ?? accounts.viewer;
}

export function getDemoRole(role?: string): DemoRole {
  return role && role in accounts ? (role as DemoRole) : "viewer";
}
