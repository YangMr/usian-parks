import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import router from "@/router";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers.Authorization = "Bearer " + getToken();
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对返回的数据解构了一层data
    const res = response.data;

    // 请求成功
    if (res.code === 10000) {
      return res;
    }

    // 请求失败的统一处理
    Message({
      message: res.msg || "Error",
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(new Error(res.msg || "Error"));
  },
  async (error) => {
    // token失效处理
    if (error.response.status === 401 && error.response.data.code === 40001) {
      // 1.清除token与用户信息
      await store.dispatch("user/logout");

      // 2. 跳转到登录
      router.push("/login");

      // 3.跳转到登录页
      Message({
        message: "登录已过期，请重新登录",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error("登录已过期，请重新登录"));
    }

    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
