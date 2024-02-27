import request from "@/utils/request";

/**
 * 文件上传接口
 * @param {*} data
 * @returns
 */
export const uploadApi = (data) => {
  return request({
    url: "/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};

/**
 * 下载接口
 * @param {*} id
 * @returns
 */
export const downloadApi = (id) => {
  return request({
    url: `/download/${id}`,
    method: "GET",
    headers: {
      responseType: "blob",
    },
  });
};
