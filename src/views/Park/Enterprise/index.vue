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
          <el-button size="small" type="primary" @click="initEnterpriseList"
            >查询</el-button
          >
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
        <template #default="{ row }">
          <el-table :data="row.children" style="width: 100%">
            <el-table-column prop="buildingName" label="租赁楼宇">
            </el-table-column>
            <el-table-column label="租赁起止时间">
              <template v-slot="{ row }">
                {{ row.startTime }} 至 {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="合同状态">
              <template v-slot="{ row }">
                <el-tag v-if="row.status === 0">待生效</el-tag>
                <el-tag v-else-if="row.status === 1" type="success"
                  >生效中</el-tag
                >
                <el-tag v-else-if="row.status === 2" type="warning"
                  >已到期</el-tag
                >
                <el-tag v-else-if="row.status === 3" type="danger"
                  >已退租</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button :disabled="row.renewFlag === 0" type="text"
                  >续租
                </el-button>
                <el-button :disabled="row.exitFlag === 0" type="text"
                  >退租</el-button
                >
                <el-button :disabled="row.status !== 3" type="text"
                  >删除</el-button
                >
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
        <template v-slot="{ row }">
          <el-button type="text" @click="openDialog(row)">添加合同</el-button>
          <el-button type="text">查看</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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

    <!-- 弹窗 -->
    <el-dialog
      :before-close="resetDialogForm"
      title="添加合同"
      width="600px"
      :visible.sync="dialogVisible"
    >
      <el-form ref="resetForm" :model="dialogForm" style="padding: 0 40px">
        <el-form-item label="租赁楼宇" prop="buildingId">
          <el-select v-model="dialogForm.buildingId" style="width: 100%">
            <el-option
              v-for="item in buildingList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租赁起止日期" prop="time">
          <el-date-picker
            v-model="time"
            style="width: 100%"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="租赁合同">
          <!-- <template> -->
          <el-row>
            <el-col>
              <!-- 默认上传 action : 文件上传的地址 -->
              <!-- 手动上传 -->
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :http-request="handleUpload"
                :on-preview="onPreview"
                multiple
                :limit="3"
                :file-list="fileList"
              >
                <el-button
                  :disabled="uploadButtonStatus"
                  size="small"
                  :type="uploadButtonStatus ? 'success' : 'primary'"
                  >{{ uploadButtonStatus ? "已上传" : "上传文件" }}</el-button
                >

                <div slot="tip" class="el-upload__tip">
                  支持扩展名：.doc .docx .pdf, 文件大小不得超过5M
                </div>
              </el-upload>
            </el-col>
          </el-row>

          <!-- </template> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDialogForm">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  enterpriseListApi,
  enterpriseRentApi,
  addEnterpriseRrentApi,
} from "@/api/enterprise";
import { getRentBuildingApi } from "@/api/building";
import { uploadApi } from "@/api/common";
import { Link } from "element-ui";
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
      dialogVisible: false,
      time: [],
      buildingList: [],
      dialogForm: {
        // 租赁楼宇id
        buildingId: "",
        // 租赁开始日期
        startTime: "",
        // 租赁结束日期
        endTime: "",
        // 合同附件url
        contractUrl: "",
        // 合同附件id
        contractId: "",
        // 操作类型，添加合同0，续签合同1
        type: 0,
        // 企业id
        enterpriseId: "",
      },
      // 上传的文件列表
      fileList: [],
    };
  },
  created() {
    this.initEnterpriseList();
  },
  watch: {
    time(value) {
      console.log("123", value);
      this.dialogForm.startTime = value[0];
      this.dialogForm.endTime = value[1];
    },
  },
  computed: {
    // true 表示上传成功  false 表示未成功
    uploadButtonStatus() {
      return !!this.dialogForm.contractId || false;
    },
  },
  methods: {
    // 初始化企业列表
    async initEnterpriseList() {
      const { data } = await enterpriseListApi(this.queryParams);
      console.log("Res=>", data);
      this.tableData = data.rows.map((item) => {
        return {
          ...item,
          children: [],
        };
      });
      this.total = data.total;
    },
    // 获取可租赁楼宇列表方法
    async getRentBuildingList() {
      const res = await getRentBuildingApi();
      console.log("Aaa=", res);
      this.buildingList = res.data;
    },
    // 表格展示触发的方法
    async handleExpandChange(row, rows) {
      // const item = rows.find((item) => item.id === row.id);
      this.getEnterpriseRent(row);
    },
    // 获取企业租赁信息列表-展开查看
    async getEnterpriseRent(row) {
      const res = await enterpriseRentApi(row.id);
      row.children = res.data;
    },
    // 页码发生变化触发的方法
    handleCurrentChange(page) {
      this.queryParams.page = page;
      this.initEnterpriseList();
    },
    // 条数发生变化触发的方法
    handleSizeChange(size) {
      this.queryParams.pageSize = size;
      this.initEnterpriseList();
    },
    // 打开弹窗
    openDialog(row) {
      this.dialogVisible = true;
      this.dialogForm.enterpriseId = row.id;
      this.getRentBuildingList();
    },
    // 文件上传
    async handleUpload(params) {
      // 1. 获取到上传的文件
      const file = params.file;

      // 2. 判断上传文件的大小
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error("文件大小不能超过5M");
        return false;
      }

      // 3. 将文件转化为form data (重点)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "contract");
      // 4. 调用接口实现上传
      const res = await uploadApi(formData);
      this.dialogForm.contractUrl = res.data.url;
      this.dialogForm.contractId = res.data.id;
    },
    // 文件预览
    onPreview(params) {
      window.open(this.dialogForm.contractUrl);
    },
    // 提交数据
    async onSubmit() {
      const res = await addEnterpriseRrentApi(this.dialogForm);
      this.$message.success("添加成功");
      this.resetDialogForm();
      this.initEnterpriseList();
    },
    // 重置表单
    resetDialogForm() {
      this.$refs.resetForm.resetFields();
      this.dialogVisible = false;
      this.dialogForm.contractUrl = "";
      this.dialogForm.contractId = "";
      this.fileList = [];
      this.time = [];
    },
  },

  // 1. 打开选择文件的弹窗 这一步el-button已经帮我们处理好了
  // 2. 获取已选择的文件
  // 3. 判断文件的格式
  // 4. 判断文件的大小
  // 5. 实例化form data
  // 6. 将需要上传的文件信息(在接口文档中看)添加到form data中
  // 7. 封装上传文件api接口, 注意: content-type的类型需要设置为 formdata类型
  // 8. 调用文件上传接口, 将formdata数据通过接口传给后台
  // 9. 上传成功后, 获取后台返回的文件信息, 进行展示 / 或者其他的一些操作
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
