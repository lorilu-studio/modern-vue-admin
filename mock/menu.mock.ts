import { defineMock } from "./base";
import { getDemoRole } from "./demo-account";

const userMenu = {
  path: "users",
  component: "demo/access/users",
  name: "UserManagement",
  meta: {
    title: "用户管理",
    icon: "user",
    hidden: false,
    keepAlive: true,
    alwaysShow: false,
    params: null,
  },
};

const accessMenu = {
  path: "/access",
  component: "Layout",
  redirect: "/access/users",
  name: "AccessControl",
  meta: {
    title: "权限管理",
    icon: "lock",
    hidden: false,
    alwaysShow: true,
    params: null,
  },
  children: [
    userMenu,
    {
      path: "departments",
      component: "demo/access/departments",
      name: "DepartmentManagement",
      meta: {
        title: "组织与部门",
        icon: "nested",
        hidden: false,
        keepAlive: true,
        alwaysShow: false,
        params: null,
      },
    },
    {
      path: "roles",
      component: "demo/access/roles",
      name: "RoleManagement",
      meta: {
        title: "角色管理",
        icon: "lock",
        hidden: false,
        keepAlive: true,
        alwaysShow: false,
        params: null,
      },
    },
    {
      path: "resources",
      component: "demo/access/resources",
      name: "ResourceManagement",
      meta: {
        title: "菜单与资源权限",
        icon: "menu",
        hidden: false,
        keepAlive: true,
        alwaysShow: false,
        params: null,
      },
    },
  ],
};

const auditMenu = {
  path: "/audit",
  component: "Layout",
  redirect: "/audit/operations",
  name: "Audit",
  meta: {
    title: "运营审计",
    icon: "document",
    hidden: false,
    alwaysShow: true,
    params: null,
  },
  children: [
    {
      path: "operations",
      component: "demo/audit/operation-log",
      name: "OperationLog",
      meta: {
        title: "操作日志",
        icon: "document",
        hidden: false,
        keepAlive: true,
        alwaysShow: false,
        params: null,
      },
    },
    {
      path: "logins",
      component: "demo/audit/login-log",
      name: "LoginLog",
      meta: {
        title: "登录日志",
        icon: "clock",
        hidden: false,
        keepAlive: true,
        alwaysShow: false,
        params: null,
      },
    },
  ],
};

const profileMenu = {
  path: "/profile",
  component: "Layout",
  redirect: "/profile/index",
  name: "Profile",
  meta: {
    title: "个人中心",
    icon: "user-round",
    hidden: false,
    alwaysShow: false,
    params: null,
  },
  children: [
    {
      path: "index",
      component: "demo/profile/index",
      name: "ProfileCenter",
      meta: {
        title: "我的资料",
        icon: "user-round",
        hidden: false,
        keepAlive: true,
        alwaysShow: false,
        params: null,
      },
    },
  ],
};

const pageTemplatesMenu = {
  path: "/templates",
  component: "Layout",
  redirect: "/templates/list",
  name: "PageTemplates",
  meta: {
    title: "页面模板",
    icon: "table",
    hidden: false,
    alwaysShow: true,
    params: null,
  },
  children: [
    {
      path: "list",
      component: "demo/templates/generic-list",
      name: "GenericListTemplate",
      meta: { title: "通用列表", icon: "table", hidden: false },
    },
    {
      path: "basic-form",
      component: "demo/templates/basic-form",
      name: "BasicFormTemplate",
      meta: { title: "基础表单", icon: "document", hidden: false },
    },
    {
      path: "step-form",
      component: "demo/templates/step-form",
      name: "StepFormTemplate",
      meta: { title: "分步表单", icon: "document", hidden: false },
    },
    {
      path: "detail",
      component: "demo/templates/detail",
      name: "DetailTemplate",
      meta: { title: "详情页面", icon: "document", hidden: false },
    },
    {
      path: "result/success",
      component: "demo/templates/result",
      name: "SuccessResultTemplate",
      meta: { title: "成功结果", icon: "check", hidden: false },
    },
    {
      path: "result/failure",
      component: "demo/templates/result",
      name: "FailureResultTemplate",
      meta: { title: "失败结果", icon: "error", hidden: false },
    },
  ],
};

const routesByRole = {
  admin: [pageTemplatesMenu, accessMenu, auditMenu, profileMenu],
  operator: [
    pageTemplatesMenu,
    { ...accessMenu, children: [userMenu] },
    auditMenu,
    profileMenu,
  ],
  viewer: [
    pageTemplatesMenu,
    { ...accessMenu, children: [userMenu] },
    profileMenu,
  ],
};

const role = getDemoRole(import.meta.env.VITE_MOCK_DEMO_ROLE);

export default defineMock([
  {
    url: "menus/routes",
    method: ["GET"],
    body: {
      code: "00000",
      data: routesByRole[role],
      msg: "一切ok",
    },
  },
]);
