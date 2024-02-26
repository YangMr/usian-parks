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
