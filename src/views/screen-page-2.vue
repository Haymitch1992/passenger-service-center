<template>
  <div>
    <div class="screen-title">
      云中心乘客服务系统
    </div>
    <div class="subway-line-box">
      <img src="../assets/subway-line.svg" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "screen-page-2",
};
</script>

<style scoped lang="scss">
.screen-title {
  color: rgba(255, 255, 255, 1);
  font-size: 24px;
  height: 80px;
  line-height: 80px;
  background: url("../assets/page2-title.png") no-repeat 0px 10px;
  background-size: 100vw;
  margin: 22px 0;
}
.subway-line-box {
  padding: 20px 160px 100px;
  img {
    display: block;
    width: 100%;
  }
}
</style>
