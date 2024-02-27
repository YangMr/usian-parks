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

/**
 * 园区管理-查询企业所属行业列表
 * @returns
 */
export const getIndustryListApi = () => {
  return request({
    url: "/park/industry",
    method: "GET",
  });
};

/**
 * 园区管理-增加企业
 * @param {*} data
 * @returns
 */
export const addEnterpriseApi = (data) => {
  return request({
    url: "/park/enterprise",
    method: "POST",
    data,
  });
};

/**
 * 园区管理-查看企业
 * @param {*} id
 * @returns
 */
export const getEnterpriseDetailApi = (id) => {
  return request({
    url: `/park/enterprise/${id}`,
    method: "GET",
  });
};

/**
 * 园区管理-编辑企业
 * @param {*} data
 * @returns
 */
export const editEnterpriseApi = (data) => {
  return request({
    url: "/park/enterprise",
    method: "PUT",
    data,
  });
};
