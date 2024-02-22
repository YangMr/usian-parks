<template>
  <div class="add-header">
    <el-page-header @back="back" :content="content"> </el-page-header>
    <div class="user-name">{{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AddMonthCard",
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["name"]),
    // username() {
    //   return this.$store.getters.name;
    // },
  },
  methods: {
    back() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
.add-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;

  .user-name {
    font-weight: bold;
  }

  .el-page-header {
    ::v-deep .el-page-header__title {
      font-weight: bold;
      font-size: 16px;
    }
    ::v-deep .el-page-header__content {
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
