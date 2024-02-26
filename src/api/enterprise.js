import request from "@/utils/request";

/**
 * 园区管理-企业列表
 * @param {*} params
 * @returns
 */
export const enterpriseListApi = (params) => {
  return request({
    url: "/park/enterprise",
    method: "GET",
    params,
  });
};

/**
 * 园区管理-企业租赁信息列表-展开查看
 * @param {*} id
 * @returns
 */
export const enterpriseRentApi = (id) => {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: "GET",
  });
};

/**
 * 园区管理-添加/续租企业的租赁合同
 * @param {*} data
 * @returns
 */
export const addEnterpriseRrentApi = (data) => {
  return request({
    url: "/park/enterprise/rent",
    method: "POST",
    data,
  });
};
