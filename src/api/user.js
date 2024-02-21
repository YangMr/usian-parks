import request from "@/utils/request";

/**
 * 登录接口
 * @param {*} data
 * @returns
 */
export function loginApi(data) {
  return request({
    url: "/park/login",
    method: "post",
    data,
  });
}

/**
 * 获取用户信息
 */
export function getInfoApi() {
  return request({
    url: "/park/user/profile",
    method: "get",
  });
}
