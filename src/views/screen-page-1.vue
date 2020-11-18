<template>
  <div class="chart-page">
    <!--舆情分析-->
    <div class="chart-page-left">
      <div class="chart-item chart-item-1">
        <dv-border-box-11 title="舆情分析">
          <public-opinion></public-opinion>
        </dv-border-box-11>
      </div>
      <!--设备管理-->
      <div class="chart-item chart-item-2">
        <dv-border-box-11 title="个性化服务">
          <equipment></equipment>
        </dv-border-box-11>
      </div>
    </div>
    <div class="chart-page-right">
      <!--个性化服务-->
      <div class="chart-item chart-item-3">
        <dv-border-box-11 title="设备管理">
          <management></management>
        </dv-border-box-11>
      </div>
      <!--无人客服监控-->
      <div class="chart-item chart-item-4">
        <dv-border-box-11 title="无人客服监控">
          <passenger></passenger>
        </dv-border-box-11>
      </div>
    </div>
  </div>
</template>

<script>
import publicOpinion from "../components/publicOpinion";
import equipment from "../components/equipment";
import passenger from "../components/passenger";
import management from "../components/management";
export default {
  name: "screen-page-1",
  components: {
    publicOpinion,
    equipment,
    passenger,
    management,
  },
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style lang="scss">
.chart-page:before {
  content: "";
  display: block;
  background: url("../assets/title-line.png") no-repeat;
  width: 2907px;
  height: 6px;
  position: absolute;
  right: -500px;
  top: 40px;
}
.chart-page {
  width: 100%;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  box-sizing: border-box;
  position: relative;
  padding: 8vh 20px 0;
  .chart-page-left {
    width: 50%;
  }
  .chart-page-right {
    width: 50%;
  }

  .chart-item-1 {
    height: 45vh;
    display: flex;
    width: 100%;
    overflow: hidden;
  }
  .chart-item-2 {
    height: 45vh;
    display: flex;
    width: 100%;
    overflow: hidden;
  }
  .chart-item-3 {
    height: 45vh;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .chart-item-4 {
    height: 45vh;
    display: flex;
    width: 100%;
    overflow: hidden;
  }
}
</style>
