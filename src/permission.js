import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
import { asyncRoutes } from "@/router/asyncRoutes";

console.log("router", router);

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// 过滤出一级路由所需要的权限点数据
const getFirstRoutePerms = (permiss) => {
  // park:building:list
  // permiss  ['park:building:list', 'parking:area:list', 'park:building:add_edit', 'parking:area:add_edit', 'parking:area:remove', 'park:building:remove', __ob__: Observer]
  const newArr = permiss.map((item) => {
    return item.split(":")[0];
  });
  return [...new Set(newArr)];
};

// 过滤出二级路由所需要的权限点数据
const getSecondRoutePerms = (permiss) => {
  const newArr = permiss.map((item) => {
    const arr = item.split(":");
    return `${arr[0]}:${arr[1]}`;
  });
  return [...new Set(newArr)];
};

// 根据权限点从自定义路由表(动态路由表)匹配出当前用户所拥有的动态路由
const getRoutes = (firstPerms, secondPerms, asyncRoutes) => {
  if (firstPerms.includes("*")) {
    return asyncRoutes;
  }
  const routes = asyncRoutes
    .filter((item) => {
      return firstPerms.includes(item.permission);
    })
    .map((item) => {
      return {
        ...item,
        children: item.children.filter((child) =>
          secondPerms.includes(child.permission)
        ),
      };
    });

  return routes;
};

// 路由白名单
const whiteList = ["/login", "/404"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start();

  // 设置浏览器标题
  document.title = getPageTitle(to.meta.title);

  // 获取token
  const hasToken = getToken();

  // 判断有没有token
  if (hasToken) {
    // 有token
    if (to.path === "/login") {
      // 跳转到首页
      next({ path: "/" });
      NProgress.done();
    } else {
      // 获取用户信息
      const hasGetUserInfo = store.getters.id;
      if (hasGetUserInfo) {
        // 有用户信息, 放行
        next();
      } else {
        // 没有用户信息
        try {
          // 1. 先拿到后台返回的权限点数据
          const { permissions } = await store.dispatch("user/userInfo");
          console.log("permissions", permissions);
          // 拿到一级路由权限点数据
          const firstPerms = getFirstRoutePerms(permissions);
          console.log("firstPerms", firstPerms);
          // 拿到二级路由权限点数据
          const secondPerms = getSecondRoutePerms(permissions);
          console.log("secondPerms", secondPerms);

          // 2. 再拿到自定义的路由表

          // 3. 匹配出当前登录的用户所有拥有的自定义的动态路由表
          const newRoutes = getRoutes(firstPerms, secondPerms, asyncRoutes);
          console.log("newRoutes", newRoutes);
          // 4. 动态的添加到路由表
          router.addRoutes([
            ...newRoutes, // 404 page must be placed at the end !!!
            { path: "*", redirect: "/404", hidden: true },
          ]);
          // 成功 放行

          // 将动态添加的路由放到menus
          store.commit("menu/setMenus", newRoutes);
          // 成功 放行
          next(to.fullPath);
        } catch (error) {
          console.log("error=>", error);
          // 失败, 清空token 以及 用户信息
          await store.dispatch("user/logout");
          // 进行错误信息提示
          Message.error(error || "Has Error");
          // 跳转到登录页
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

/**
 * 页面跳转的时候, 我们判断有没有token
 *
 * 有token
 *  判断进入的是不是登录页
 *    是
 *      跳转到主页
 *    不是
 *      判断有没有用户id(用户信息)
 *          有
 *            next 放行
 *          没有
 *            获取用户信息
 *              成功
 *                next 放行
 *              失败
 *                 清除toekn 和 用户信息
 *                跳转到登录页
 *
 * 没有token的情况
 *  判断进入的是不是白名单页面
 *    是
 *      next 放行
 *    不是
 *      跳转到登录页
 *
 *
 *
 */
