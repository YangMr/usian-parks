<!-- <template>
  <div>
    <el-button v-auth-btn="'park:enterprise:add_edit'" type="primary"
      >新增</el-button
    >
    <el-button v-auth-btn="'park:rent:add_surrender'" type="danger"
      >添加合同</el-button
    >
    <el-button v-auth-btn="'parking:card:remove'">删除</el-button>
  </div>
</template> -->

<!-- <template>
  <div> -->
<!-- <h1 v-if="leave === 1">我是h1</h1>
    <h2 v-if="leave === 2">我是h2</h2>
    <h3 v-if="leave === 3">我是h3</h3>
    <h4 v-if="leave === 4">我是h4</h4>
    <h5 v-if="leave === 5">我是h5</h5>
    <h6 v-if="leave === 6">我是h6</h6> -->
<!-- </div>
</template> -->
<template>
  <div>
    <auth-btn str="park:enterprise:add_edit">
      <el-button type="primary">新增</el-button>
    </auth-btn>
  </div>
</template>

<script>
export default {
  // template 另外一种写法
  // div h1  hello
  //     span word
  // template render  js编程能力 jsx
  // render(h) {
  //   // h("标签名", 自定义属性, 内容
  //   // return h("div", { class: "name" }, "123");
  //   return h("div", { class: "name" }, [h("h1", "hello"), h("span", "word")]);
  // },
  // data() {
  //   return {
  //     leave: 1,
  //   };
  // },
  // render(h) {
  //   return h("div", [h(`h${this.leave}`, `我是h${this.leave}`)]);
  // },
};
</script>
