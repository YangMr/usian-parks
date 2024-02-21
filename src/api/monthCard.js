import request from "@/utils/request";

/**
 * 查看月卡信息列表
 * @param {*} params
 * @returns
 */
export const getCardListApi = (params) => {
  return request({
    url: "/parking/card/list",
    method: "get",
    params,
  });
};
