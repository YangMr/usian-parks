<template>
  <div class="add-card">
    <CustomHeader content="查看详情" />

    <div class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>

        <div class="form">
          <el-form label-width="100px">
            <el-form-item label="车主姓名" prop="personName">
              <template>
                {{ carInfoForm.personName }}
              </template>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <template>
                {{ carInfoForm.phoneNumber }}
              </template>
            </el-form-item>
            <el-form-item label="车牌号码" prop="carNumber">
              <template>
                {{ carInfoForm.carNumber }}
              </template>
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <template>
                {{ carInfoForm.carBrand }}
              </template>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最近一次月卡缴费信息</div>
        <div class="list">
          <el-table :data="carInfoForm.rechargeList" style="width: 100%">
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column label="有效时间">
              <template v-slot="{ row }">
                {{ row.cardStartDate }} 至 {{ row.cardEndDate }}
              </template>
            </el-table-column>
            <el-table-column prop="paymentAmount" label="支付金额">
            </el-table-column>
            <el-table-column label="支付方式">
              <template v-slot="{ row }">
                <span v-if="row.paymentMethod === 'Cash'">现金</span>
                <span v-else-if="row.paymentMethod === 'Wechat'">微信</span>
                <span v-else-if="row.paymentMethod === 'Alipay'">支付宝</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="办理时间">
            </el-table-column>
            <el-table-column prop="createUser" label="办理人">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomHeader from "@/components/CustomHeader/index.vue";
import { findMonthCardDetailApi } from "@/api/monthCard";
export default {
  name: "AddMonthCard",
  components: {
    CustomHeader,
  },
  data() {
    return {
      id: "",
      carInfoForm: {},
    };
  },
  created() {
    if (this.$route.params.id) this.id = this.$route.params.id;
    this.initCardDetail();
  },
  methods: {
    async initCardDetail() {
      const { data } = await findMonthCardDetailApi(this.id);
      console.log("ressss=>", data);
      this.carInfoForm = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.add-card {
  background-color: #f4f6f8;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .add-main {
    flex: 1;
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      margin-bottom: 20px;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
        font-weight: bold;
        border-bottom: 1px solid #f4f6f8;
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

  .list {
    padding: 20px;
  }
}
</style>
