<template>
  <div class="wrapper">
    <CustomHeader content="查看企业" />

    <!-- 主体 -->
    <div class="main">
      <div class="form-container">
        <div class="title">
          <span>企业信息</span>
        </div>
        <div class="form">
          <el-form ref="infoForm" :model="form" label-width="100px">
            <el-form-item label="企业名称" prop="name">
              {{ form.name }}
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              {{ form.legalPerson }}
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              {{ form.registeredAddress }}
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              {{ form.industryName }}
            </el-form-item>
            <el-form-item label="营业执照">
              <el-image :src="form.businessLicenseUrl"></el-image>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">
          <span>联系人信息</span>
        </div>
        <div class="form">
          <el-form ref="contactForm" :model="form" label-width="100px">
            <el-form-item label="企业联系人" prop="contact">
              {{ form.contact }}
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              {{ form.contactNumber }}
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="form-container">
        <div class="title">
          <span>租赁记录</span>
        </div>
        <div class="form">
          <el-table :data="form.rent">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="租赁楼宇" prop="name"></el-table-column>
            <el-table-column label="合同状态" prop="status">
              <template v-slot="{ row }">
                <el-tag v-if="row.status === 0">待生效</el-tag>
                <el-tag v-if="row.status === 1" type="success">生效中</el-tag>
                <el-tag v-if="row.status === 2" type="info">已到期</el-tag>
                <el-tag v-if="row.status === 3" type="warning">已退租</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="租赁起止时间">
              <template slot-scope="scope">
                <span
                  >{{ scope.row.startTime }} 至 {{ scope.row.endTime }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="租赁合同">
              <template v-slot="{ row }">
                <a :href="row.contractUrl" target="_blank">{{
                  row.contractName
                }}</a>
              </template>
            </el-table-column>
            <el-table-column
              label="录入时间"
              prop="createTime"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <!-- <span
                  @click="downloadFile(row.contractId)"
                  style="color: purple; cursor: pointer"
                  >合同下载</span
                > -->
                <a :href="row.contractUrl">合同下载</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CustomHeader from "@/components/CustomHeader/index.vue";
import { getEnterpriseDetailApi } from "@/api/enterprise";
import { downloadApi } from "@/api/common";
export default {
  name: "detail",
  components: {
    CustomHeader,
  },
  data() {
    return {
      form: {},

      id: "",
    };
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.getEnterpriseDetail();
    }
  },
  methods: {
    // 获取企业详情信息
    async getEnterpriseDetail() {
      const res = await getEnterpriseDetailApi(this.id);
      console.log("Resssssssa=>", res);
      this.form = res.data;
    },
    async downloadFile(id) {
      // const res = await downloadApi(id);
      // console.log("down=>", res);
      // const oA = document.createElement("a");
      // // url地址
      // oA.href = window.URL.createObjectURL(new Blob([res]));
      // oA.download = "a.pdf";
      // oA.click();
    },
  },
};
</script>
<style scoped lang="scss">
.wrapper {
  background-color: #f4f6f8;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .main {
    flex: 1;
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      margin-bottom: 20px;

      .title {
        height: 60px;
        line-height: 60px;

        font-weight: bold;
        font-size: 14px;
        span {
          border-left: 2px solid purple;
          padding-left: 10px;
        }
      }

      .form {
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }
  }
}
</style>
