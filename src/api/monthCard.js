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

/**
 * 添加月卡
 * @param {*} data
 * @returns
 */
export const addMonthCardApi = (data) => {
  return request({
    url: "/parking/card",
    method: "POST",
    data,
  });
};

/**
 * 获取编辑页月卡详情
 * @param {*} id
 * @returns
 */
export const getMonthCardDetailApi = (id) => {
  return request({
    url: `/parking/card/detail/${id}`,
    method: "get",
  });
};

/**
 * 编辑月卡
 */
export const editMonthCardApi = (data) => {
  return request({
    url: "/parking/card/edit",
    method: "PUT",
    data,
  });
};

/**
 * 删除月卡 包含了单个删除以及批量删除
 * @param {*} ids
 * @returns
 */
export const deleteMonthCardApi = (ids) => {
  return request({
    url: `/parking/card/${ids}`,
    method: "DELETE",
  });
};

/**
 * 月卡续费
 * @param {*} data
 * @returns
 */
export const rechargeMonthCardApi = (data) => {
  return request({
    url: "/parking/card/recharge",
    method: "POST",
    data,
  });
};

/**
 * 查看月卡详情
 * @param {*} id
 * @returns
 */
export const findMonthCardDetailApi = (id) => {
  return request({
    url: `/parking/card/${id}`,
    method: "GET",
  });
};
