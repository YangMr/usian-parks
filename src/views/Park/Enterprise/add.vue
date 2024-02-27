<template>
  <div class="wrapper">
    <!-- 头部 -->
    <CustomHeader :content="mode === 'edit' ? '编辑企业' : '添加企业'" />

    <div class="main">
      <div class="form-container">
        <div class="title">
          <span>企业信息</span>
        </div>
        <div class="form">
          <el-form
            ref="infoForm"
            :model="form"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item label="企业名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入企业名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input
                v-model="form.legalPerson"
                placeholder="请输入法人"
              ></el-input>
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input
                v-model="form.registeredAddress"
                placeholder="请输入注册地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select
                style="width: 100%"
                v-model="form.industryCode"
                placehoder="请选择所在行业"
              >
                <el-option
                  v-for="(item, index) in industryList"
                  :key="index"
                  :label="item.industryName"
                  :value="item.industryCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="营业执照">
              <el-upload
                :http-request="handleUpload"
                action="#"
                multiple
                :limit="3"
                :file-list="fileList"
              >
                <el-button
                  :disabled="uploadButtonStatus"
                  size="small"
                  :type="uploadButtonStatus ? 'success' : 'primary'"
                  >{{ uploadButtonStatus ? "已上传" : "点击上传" }}</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">
          <span>联系人信息</span>
        </div>
        <div class="form">
          <el-form
            ref="contactForm"
            :rules="rules"
            :model="form"
            label-width="100px"
          >
            <el-form-item label="企业联系人" prop="contact">
              <el-input
                v-model="form.contact"
                placeholder="请输入企业联系人"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input
                v-model="form.contactNumber"
                placeholder="请输入联系电话"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div class="footer">
      <el-button :disabled="mode === 'edit' ? true : false" @click="resetForm"
        >重置</el-button
      >
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </div>
</template>
<script>
import CustomHeader from "@/components/CustomHeader/index.vue";
import {
  getIndustryListApi,
  addEnterpriseApi,
  getEnterpriseDetailApi,
  editEnterpriseApi,
} from "@/api/enterprise";
import { uploadApi } from "@/api/common";

/*
编辑页面需要解决的问题:
1. 标题需要变成编辑企业
2. 数据在表单进行回显
3. 重置按钮禁用
4. 点击确定按钮调用编辑接口
*/
export default {
  name: "add",
  components: {
    CustomHeader,
  },
  data() {
    return {
      mode: "",
      id: "",
      fileList: [],
      srcList: [],
      form: {
        name: "",
        legalPerson: "",
        registeredAddress: "",
        industryCode: "",
        businessLicenseUrl: "",
        businessLicenseId: "",
        contact: "",
        contactNumber: "",
      },
      industryList: [],
      rules: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        legalPerson: [
          { required: true, message: "请输入法人", trigger: "blur" },
        ],
        registeredAddress: [
          { required: true, message: "请输入注册地址", trigger: "blur" },
        ],
        industryCode: [
          { required: true, message: "请选择所在行业", trigger: "change" },
        ],
        contact: [
          { required: true, message: "请输入企业联系人", trigger: "blur" },
        ],
        contactNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if (this.$route.query.mode) this.mode = this.$route.query.mode;
    if (this.$route.query.id) this.id = this.$route.query.id;
    if (this.mode && this.id) this.getEnterpriseDetail();
    this.getIndustryList();
  },
  computed: {
    uploadButtonStatus() {
      return !!this.form.businessLicenseId || false;
    },
  },
  methods: {
    // 获取行业列表
    async getIndustryList() {
      const res = await getIndustryListApi();
      console.log("resssss=>", res);
      this.industryList = res.data;
    },
    // 获取企业详情信息
    async getEnterpriseDetail() {
      const res = await getEnterpriseDetailApi(this.id);
      console.log("Resssssssa=>", res);
      this.form = res.data;
      this.fileList = [
        {
          name: res.data.businessLicenseName,
          url: res.data.businessLicenseUrl,
        },
      ];
    },
    // 上传
    async handleUpload(params) {
      console.log("file", params.file);
      // 获取到选择的文件
      const file = params.file;
      console.log("file", file.type);
      // 限制上传文件的格式
      const type = file.type;
      if (!/(PNG|JPEG|JPG)/i.test(type)) {
        return this.$message.warning("上传的文件类型不正确");
      }

      // 限制上传文件的大小
      const size = file.size;
      if (size > 5 * 1024 * 1024) {
        return this.$message.warning("文件大小不能超过5M");
      }

      // 实例化formdata
      const formData = new FormData();

      // 将上传的文件信息添加到formdata中
      formData.append("file", file);
      formData.append("type", "businessLicense");

      // 调用上传文件接口
      const res = await uploadApi(formData);

      // 将上传之后的图片url 与 id 存储form表单
      this.form.businessLicenseUrl = res.data.url;
      this.form.businessLicenseId = res.data.id;
      this.srcList.push(res.data.url);
      console.log("res==>", res);

      // 1. 弹出打开选择文件的弹窗  ✔️
      // 2. 获取到选择的文件  ✔️
      // 3. 获取到上传文件的类型, 并对上传文件类型进行限制 (非必需)  ✔️
      // 4. 获取到文件的大小, 并进行限制上传文件的大小 (非必需) ✔️
      // 5. 实例化formdata ✔️
      // 6. 将上传的文件信息添加到formdata中 (文件信息需要根据接口文件的参数来确定) ✔️
      // 7. 调用上传文件接口 ✔️
      // 8. 根据业务逻辑进行后续的操作 ✔️
    },
    // 预览
    // handlePreview() {
    //   this.$refs.preview.clickHandler();
    // },
    // 提交数据
    handleSubmit() {
      this.$refs.infoForm.validate((valid) => {
        if (valid) {
          this.$refs.contactForm.validate(async (valid) => {
            if (valid) {
              if (this.mode === "edit" && this.id) {
                // 编辑
                this.form = {
                  id: this.id,
                  name: this.form.name,
                  legalPerson: this.form.legalPerson,
                  registeredAddress: this.form.registeredAddress,
                  industryCode: this.form.industryCode,
                  businessLicenseUrl: this.form.businessLicenseUrl,
                  businessLicenseId: this.form.businessLicenseId,
                  contact: this.form.contact,
                  contactNumber: this.form.contactNumber,
                };
                const res = await editEnterpriseApi(this.form);
              } else {
                if (this.form.id) delete this.form.id;
                // 添加
                const res = await addEnterpriseApi(this.form);
              }

              this.$message.success(
                (this.mode === "edit" ? "修改" : "添加") + "成功"
              );
              this.$router.push("/park/enterprise");
            }
          });
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.infoForm.resetFields();
      this.$refs.contactForm.resetFields();
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
