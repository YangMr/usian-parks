<script>
export default {
  props: {
    // 接受的按钮所具备的权限
    str: {
      type: String,
      default: "",
    },
  },
  computed: {
    isShow() {
      console.log("this.str", this.str);
      // 1. 获取到后端返回的按钮权限列表
      const periss = this.$store.state.user.userInfo.permissions;
      console.log("periss", periss);
      // 2. 判断当前按钮的权限是否存在后端返回的按钮权限列表中
      return periss.includes(this.str);
    },
  },
  render(h) {
    console.log("this.isShow", this.isShow);
    if (this.isShow) {
      return this.$slots.default;
    }
  },
};
</script>
