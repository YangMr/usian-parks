<template>
  <div class="app-container">
    <div class="dashboard-text">name: {{ name }}</div>

    <el-button @click="getList">获取数据</el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { test } from "@/api/workbench";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  methods: {
    async getList() {
      const res = await test();
      console.log("resss=>", res);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  // background-color: #eee;
  height: calc(100vh - 60px);
}
</style>
