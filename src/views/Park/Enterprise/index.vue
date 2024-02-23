<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="企业名称" prop="name">
          <el-input
            v-model="queryParams.name"
            style="width: 250px"
            size="small"
            placeholder="请输入企业名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作区域 -->
    <div class="action">
      <div class="button-group">
        <el-button type="primary">添加企业</el-button>
      </div>
    </div>
    <!-- 表格区域 -->
    <el-table
      @expand-change="handleExpandChange"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.children" style="width: 100%">
            <el-table-column prop="buildingName" label="租赁楼宇">
            </el-table-column>
            <el-table-column label="租赁起止时间">
              <template v-slot="{ row }">
                {{ row.startTime }} 至 {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="合同状态"> </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="text">续租 </el-button>
                <el-button type="text">退租</el-button>
                <el-button type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="企业名称" prop="name"> </el-table-column>
      <el-table-column label="联系人" prop="contact"> </el-table-column>
      <el-table-column label="联系电话" prop="contactNumber"> </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="text">添加合同</el-button>
          <el-button type="text">查看</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text">删除</el-button>
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
import { enterpriseListApi, enterpriseRentApi } from "@/api/enterprise";
export default {
  name: "Enterprise",
  data() {
    return {
      // 表格数据
      tableData: [],
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 5,
        name: "",
      },
      // 总条数
      total: 0,
      deleteParams: "",
    };
  },
  created() {
    this.initEnterpriseList();
  },
  methods: {
    // 初始化企业列表
    async initEnterpriseList() {
      const { data } = await enterpriseListApi(this.queryParams);
      console.log("Res=>", data);
      this.tableData = data.rows;
      this.total = data.total;
    },
    // 表格展示触发的方法
    handleExpandChange(row, rows) {
      console.log("row==>", row);
      console.log("rows==>", rows);
      // this.getEnterpriseRent(row.id);
    },
    // 获取企业租赁信息列表-展开查看
    async getEnterpriseRent(id) {
      // const res = await enterpriseRentApi(id);
      // this.tableData.forEach((item) => {
      //   if (item.id === id) {
      //     console.log("Res=>>>", res);
      //     item = { ...item, ...res.data[0] };
      //   }
      // });
      // console.log("test", this.tableData);
      // item[0] = res.data;
      // this.$set(this.tableData, item[0].children, res.data);
    },
    // 页码发生变化触发的方法
    handleCurrentChange(page) {
      this.queryParams.page = page;
    },
    // 条数发生变化触发的方法
    handleSizeChange(size) {
      this.queryParams.pageSize = size;
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

  /*1.取消原本展开的旋转动效*/
  .el-table__expand-icon {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  /*2.展开按钮未点击的样式是加号带边框*/
  .el-table__expand-icon.el-icon-arrow-right:before {
    content: "\e6d9";
    border: 1px solid 口#ccc;
    padding: 1px;
  }
}
.page {
  text-align: right;
}
</style>
