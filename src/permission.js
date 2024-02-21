import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// 路由白名单
const whiteList = ["/login", "/404"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start();

  // 设置浏览器标题
  document.title = getPageTitle(to.meta.title);

  // 获取token
  const hasToken = getToken();
  console.log("hasToken", hasToken);

  if (hasToken) {
    // 有token
    if (to.path === "/login") {
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
          // 获取用户信息
          await store.dispatch("user/userInfo");
          // 成功 放行
          next();
        } catch (error) {
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
