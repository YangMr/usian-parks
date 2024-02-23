import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/workbench",
    children: [
      {
        path: "workbench",
        name: "workbench",
        component: () => import("@/views/Workbench/index"),
        meta: { title: "工作台", icon: "el-icon-data-board" },
      },
    ],
  },

  {
    path: "/park",
    component: Layout,
    redirect: "/park/building",
    name: "park",
    meta: { title: "园区管理", icon: "el-icon-office-building" },
    children: [
      {
        path: "building",
        name: "building",
        component: () => import("@/views/Park/Building/index"),
        meta: { title: "楼宇管理" },
      },
      {
        path: "enterprise",
        name: "enterprise",
        component: () => import("@/views/Park/Enterprise/index"),
        meta: { title: "企业管理" },
      },
    ],
  },

  {
    path: "/car",
    component: Layout,
    redirect: "/car/table",
    name: "car",
    meta: { title: "行车管理", icon: "el-icon-guide" },
    children: [
      {
        path: "area",
        permission: "parking:area",
        component: () => import("@/views/Car/CarArea"),
        meta: { title: "区域管理" },
      },
      {
        path: "card",
        permission: "parking:card",
        component: () => import("@/views/Car/CarCard"),
        meta: { title: "月卡管理" },
      },
      {
        path: "pay",
        permission: "parking:payment",
        component: () => import("@/views/Car/CarPay"),
        meta: { title: "停车缴费管理" },
      },
      {
        path: "rule",
        permission: "parking:rule",
        component: () => import("@/views/Car/CarRule"),
        meta: { title: "计费规则管理" },
      },
    ],
  },

  {
    path: "/propety",
    component: Layout,
    children: [
      {
        path: "cost",
        name: "cost",
        component: () => import("@/views/Propety/Cost"),
        meta: { title: "物业费管理", icon: "form" },
      },
    ],
  },

  {
    path: "/pole",
    component: Layout,
    permission: "pole",
    meta: { title: "一体杆管理", icon: "el-icon-refrigerator" },
    children: [
      {
        path: "info",
        permission: "pole:info",
        component: () => import("@/views/Rod/RodManage"),
        meta: { title: "一体杆管理" },
      },
      {
        path: "waring",
        permission: "pole:warning",
        component: () => import("@/views/Rod/RodWarn"),
        meta: { title: "告警记录" },
      },
    ],
  },

  {
    path: "/sys",
    component: Layout,
    permission: "sys",
    meta: { title: "系统管理", icon: "el-icon-setting" },
    children: [
      {
        path: "user",
        permission: "sys:user",
        component: () => import("@/views/System/Employee/index"),
        meta: { title: "员工管理" },
      },
      {
        path: "role",
        permission: "sys:role",
        component: () => import("@/views/System/Role/index"),
        meta: { title: "角色管理" },
      },
    ],
  },

  {
    path: "/car/addMonthCard",
    component: () => import("@/views/Car/AddMonthCard/index"),
    hidden: true,
  },
  {
    path: "/car/editMonthCard/:id",
    component: () => import("@/views/Car/EditMonthCard/index"),
    hidden: true,
  },
  {
    path: "/car/renewMonthCard/:id",
    component: () => import("@/views/Car/RenewMonthCard/index"),
    hidden: true,
  },
  {
    path: "/car/viewMonthCard/:id",
    component: () => import("@/views/Car/ViewMonthCard/index"),
    hidden: true,
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
