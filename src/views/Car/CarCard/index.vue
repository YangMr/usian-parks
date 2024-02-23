<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="车牌号码" prop="carNumber">
          <el-input
            v-model="queryParams.carNumber"
            style="width: 250px"
            size="small"
            placeholder="请输入车牌号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="车主姓名" prop="personName">
          <el-input
            v-model="queryParams.personName"
            style="width: 250px"
            size="small"
            placeholder="请输入车主姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="cardStatus">
          <el-select
            v-model="queryParams.cardStatus"
            style="width: 250px"
            size="small"
            placeholder="未选择"
          >
            <el-option label="全部" :value="null"></el-option>
            <el-option label="可用" :value="0"></el-option>
            <el-option label="已过期" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="getMonthCardList"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作区域 -->
    <div class="action">
      <div class="button-group">
        <el-button type="primary" @click="$router.push('/car/addMonthCard')"
          >添加月卡</el-button
        >
        <el-button type="primary" @click="deleteMoreMonthCard"
          >批量删除</el-button
        >
      </div>
      <div class="tip-info">
        <i class="el-icon-warning" style="color: #1890ff"></i>
        本园区共计 1530 个车位，月卡用户 0 人，车位占有率 0.00%
      </div>
    </div>
    <!-- 表格区域 -->

    <el-table
      @selection-change="getSelectChange"
      :data="monthCardList"
      style="width: 100%"
    >
      <el-table-column align="center" type="selection"> </el-table-column>
      <el-table-column align="center" type="index" label="序号">
      </el-table-column>
      <el-table-column prop="personName" label="车主名称"> </el-table-column>
      <el-table-column prop="phoneNumber" label="联系方式"> </el-table-column>
      <el-table-column prop="carNumber" label="车牌号码"> </el-table-column>
      <el-table-column prop="carBrand" label="车辆品牌"> </el-table-column>
      <el-table-column prop="totalEffectiveDate" label="剩余有效天数">
      </el-table-column>
      <el-table-column prop="cardStatus" label="状态" :formatter="formatStatus">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="{ row }">
          <el-button
            type="text"
            @click="$router.push(`/car/renewMonthCard/${row.id}`)"
            >续费</el-button
          >
          <el-button
            type="text"
            @click="$router.push(`/car/viewMonthCard/${row.id}`)"
            >查看</el-button
          >
          <el-button
            type="text"
            @click="$router.push(`/car/editMonthCard/${row.id}`)"
            >编辑</el-button
          >
          <el-button type="text" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination
        style="padding: 20px 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.page"
        :page-sizes="[5, 20, 50, 100]"
        :page-size="queryParams.pageSize"
        layout="total,  prev, pager, next,sizes"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getCardListApi, deleteMonthCardApi } from "@/api/monthCard";

export default {
  name: "MonthCard",
  data() {
    return {
      // 月卡信息列表数据
      monthCardList: [],
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 5,
        carNumber: "",
        personName: "",
        cardStatus: "",
      },
      // 总条数
      total: 0,
      deleteParams: "",
    };
  },
  created() {
    this.getMonthCardList();
  },
  methods: {
    // 获取用卡列表
    async getMonthCardList() {
      const res = await getCardListApi(this.queryParams);
      this.monthCardList = res.data.rows;
      this.total = res.data.total;
    },
    // 格式化状态
    formatStatus(row, column, cellValue, index) {
      const statusMap = {
        0: "可用",
        1: "已过期",
      };
      return statusMap[cellValue];
    },
    // 页码发生变化触发的方法
    handleCurrentChange(page) {
      this.queryParams.page = page;
      this.getMonthCardList();
    },
    // 条数发生变化触发的方法
    handleSizeChange(size) {
      this.queryParams.pageSize = size;
      this.getMonthCardList();
    },
    // 删除
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteMonthCardApi(id);
          this.$message.success("删除成功");
          this.getMonthCardList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 获取复选框选中的数据
    getSelectChange(data) {
      console.log("data=>", data);
      const ids = data.map((item) => item.id);
      this.deleteParams = ids.join();
    },
    // 批量删除
    async deleteMoreMonthCard() {
      if (!this.deleteParams) {
        return this.$message.info("请选择要删除的数据");
      }
      this.handleDelete(this.deleteParams);
    },
  },
};
</script>

<style lang="scss" scoped>
.action {
  padding: 20px 0;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .tip-info {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding: 0 20px;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
  }
}
.page {
  text-align: right;
}
</style>
