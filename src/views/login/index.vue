<template>
  <div class="login-wrapper">
    <div class="login-bg"></div>
    <div class="login-form">
      <div class="title">智慧园区 - 登录</div>
      <el-form ref="form" :model="loginForm" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input
            v-model.trim="loginForm.username"
            size="small"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model.trim="loginForm.password"
            size="small"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="remember">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitLogin"
            size="small"
            style="width: 100%"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      remember: false,
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: "请输入正确的账号",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: "请输入正确的密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    const cacheFormStr = localStorage.getItem("form_key");
    if (cacheFormStr) {
      const cacheFormData = JSON.parse(cacheFormStr);
      this.loginForm.username = cacheFormData.username;
      this.loginForm.password = cacheFormData.password;
    }
  },
  methods: {
    submitLogin() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          // 异步操作 切记, 一定要变成同步
          await this.$store.dispatch("user/login", this.loginForm);

          // 记住密码功能
          if (this.remember) {
            // 选中了记住我的操作
            localStorage.setItem("form_key", JSON.stringify(this.loginForm));
          } else {
            // 取消记住
            localStorage.removeItem("form_key");
          }

          // 跳转到主页
          this.$router.push("/");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login-wrapper {
  display: flex;

  .login-bg {
    width: 60vw;
    height: 100vh;
    background: url("https://fe-hmzs.itheima.net/assets/login-bg-e4ea539c.svg")
      right top;
    background-size: cover;
  }

  .login-form {
    flex: 1;
    margin: 200px 10% 0;

    .title {
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
      padding-bottom: 76px;
    }

    ::v-deep .el-form-item .el-form-item__label {
      font-size: 16px;
      color: #8b929d;
    }
  }
}
</style>
