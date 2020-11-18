<template>
  <div id="equipment-container" class="equipment-container"></div>
</template>

<script>
import Charts from "@jiaminghi/charts";

export default {
  name: "equipment",
  mounted() {
    const container = document.getElementById("equipment-container");
    const myChart = new Charts(container);
    const option1 = {
      color: ["#ffffff"],
      title: {
        text: "当日申请不同服务数量统计",
        style: {
          fill: "#9BADF9",
          fontSize: 16,
          textAlign: "center",
          textBaseline: "bottom",
        },
      },
      xAxis: {
        name: "(服务种类)",
        data: [
          "普通",
          "残疾人",
          "女性",
          "儿童",
          "商务",
          "购物",
          "主题",
          "VIP",
          "观光旅游",
          "物流",
          "国际",
          "主题",
        ],
        nameTextStyle: {
          fill: "#9BADF9",
          fontSize: 16,
        },
        axisLabel: {
          style: {
            fill: "#9BADF9",
            fontSize: 16,
          },
        },
        axisLine: {
          style: {
            stroke: "#979797",
            lineWidth: 1,
          },
        },
      },
      yAxis: {
        name: "(人数)",
        data: "value",
        nameTextStyle: {
          fill: "#9BADF9",
          fontSize: 16,
        },
        splitLine: {
          style: {
            stroke: "rgba(151, 151, 151, 1)",
            lineWidth: 1,
            lineDash: [8, 4],
          },
        },
        axisLine: {
          style: {
            stroke: "#979797",
            lineWidth: 1,
          },
        },
        axisLabel: {
          style: {
            fill: "#9BADF9",
            fontSize: 16,
          },
        },
      },
      series: [
        {
          data: [21, 34, 53, 43, 51, 29, 51, 17, 22, 33, 51, 55],
          type: "bar",
          label: {
            show: true,
            position: "top",
            offset: [0, -10],
            style: {
              fill: "#9BADF9",
              fontSize: 14,
            },
          },
          gradient: {
            color: ["#22BFFF", "#3F28CE"],
          },
          barWidth: "30%",
        },
      ],
    };
    myChart.setOption(option1);
  },
};
</script>

<style scoped>
.equipment-container {
  width: 100%;
  padding-top: 3.5rem;
  height: calc(100% - 7rem);
}
</style>
