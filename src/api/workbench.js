import request from "@/utils/request";

export const test = (params) => {
  return request({
    url: "/home/workbench/rentInfo",
    method: "POST",
    params,
  });
};
