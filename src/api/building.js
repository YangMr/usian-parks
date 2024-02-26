import request from "@/utils/request";

/**
 * 园区管理-查询可租赁楼宇
 * @returns
 */
export const getRentBuildingApi = () => {
  return request({
    url: "/park/rent/building",
    method: "GET",
  });
};
