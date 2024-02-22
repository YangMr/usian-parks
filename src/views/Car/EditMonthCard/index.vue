<template>
  <div class="add-card">
    <CustomHeader content="编辑月卡" />

    <div class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>

        <div class="form">
          <el-form
            ref="carInfoForm"
            :model="carInfoForm"
            label-width="100px"
            :rules="carInfoRules"
          >
            <el-form-item label="车主姓名" prop="personName">
              <el-input
                size="small"
                v-model="carInfoForm.personName"
                placeholder="请输入车主姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input
                style="width: 100%"
                size="small"
                v-model="carInfoForm.phoneNumber"
                placeholder="请输入联系方式"
              ></el-input>
            </el-form-item>
            <el-form-item label="车牌号码" prop="carNumber">
              <el-input
                size="small"
                v-model="carInfoForm.carNumber"
                placeholder="请输入车牌号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input
                size="small"
                v-model="carInfoForm.carBrand"
                placeholder="请输入车辆品牌"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最近一次月卡缴费信息</div>
        <div class="form">
          <el-form
            :model="feeForm"
            ref="feeForm"
            :rules="feeFormRules"
            label-width="100px"
          >
            <el-form-item label="有效日期" prop="date">
              <el-date-picker
                v-model="feeForm.date"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input
                v-model="feeForm.paymentAmount"
                placeholder="请输入支付金额"
              ></el-input>
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod">
                <el-option label="支付宝" value="Alipay"></el-option>
                <el-option label="微信" value="WeChat"></el-option>
                <el-option label="现金" value="Cash"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div class="footer">
      <el-button @click="handleFormReset">重置</el-button>
      <el-button type="primary" @click="submitMonthCard">确定</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CustomHeader from "@/components/CustomHeader/index.vue";
import { getMonthCardDetailApi, editMonthCardApi } from "@/api/monthCard";
export default {
  name: "AddMonthCard",
  components: {
    CustomHeader,
  },
  data() {
    return {
      id: "",
      carInfoForm: {
        personName: "",
        phoneNumber: "",
        carNumber: "",
        carBrand: "",
      },
      carInfoRules: {
        personName: [
          { required: true, message: "请输入车主姓名", trigger: "blur" },
        ],
        phoneNumber: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确手机号码",
            trigger: "blur",
          },
        ],
        carNumber: [
          { required: true, message: "请输入车牌号码", trigger: "blur" },
          {
            pattern: /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/,
            message: "请输入正确车牌号码！",
            trigger: "blur",
          },
        ],
        carBrand: [
          { required: true, message: "请输入车辆品牌", trigger: "blur" },
        ],
      },
      feeForm: {
        date: "",
        paymentAmount: "",
        paymentMethod: "",
      },
      feeFormRules: {
        date: [
          { required: true, message: "请选择有效日期", trigger: "change" },
        ],
        paymentAmount: [
          { required: true, message: "请输入支付金额", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入支付金额"));
                return;
              }
              const val = parseFloat(value);
              if (val && typeof val === "number") {
                callback();
              } else {
                callback(new Error("请输入数字"));
              }
            },
            trigger: "blur",
          },
        ],
        paymentMethod: [
          { required: true, message: "请选择支付方式", trigger: "change" },
        ],
      },
    };
  },
  created() {
    if (this.$route.params.id) this.id = this.$route.params.id;
    this.initCardDetail();
  },
  methods: {
    submitMonthCard() {
      this.$refs.carInfoForm.validate((valid) => {
        if (valid) {
          const that = this;
          this.$refs.feeForm.validate(async (valid) => {
            if (valid) {
              const data = {
                ...that.carInfoForm,
                cardStartDate: that.feeForm.date[0],
                cardEndDate: that.feeForm.date[1],
                paymentAmount: that.feeForm.paymentAmount,
                paymentMethod: that.feeForm.paymentMethod,
                rechargeId: that.feeForm.rechargeId,
              };

              const res = await editMonthCardApi(data);
              console.log("ress=>", res);

              this.$router.push("/car/card");
            }
          });
        }
      });
    },
    handleFormReset() {
      this.$refs.carInfoForm.resetFields();
      this.$refs.feeForm.resetFields();
    },
    async initCardDetail() {
      const { data } = await getMonthCardDetailApi(this.id);
      console.log("aaa=>", data);
      this.carInfoForm = {
        personName: data.personName,
        phoneNumber: data.phoneNumber,
        carNumber: data.carNumber,
        carBrand: data.carBrand,
        carInfoId: data.carInfoId,
      };
      this.feeForm = {
        date: [data.cardStartDate, data.cardEndDate],
        paymentAmount: data.paymentAmount,
        paymentMethod: data.paymentMethod,
        rechargeId: data.rechargeId,
      };
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

  .footer {
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px 50px;
    height: 84px;
  }
}
</style>
