<template>
  <div class="equipment">
    <div class="equipment-left">
      <p>设备故障状态</p>
      <dv-decoration-9 :dur="6" class="malfunction">66%</dv-decoration-9>
      <ul class="equipment-ul">
        <li>
          <p class="title">接入数量</p>
          <p class="number">200</p>
        </li>
        <li>
          <p class="title">故障数量</p>
          <p class="number">30</p>
        </li>
        <li>
          <p class="title">正常数量</p>
          <p class="number">170</p>
        </li>
      </ul>
    </div>

    <div class="equipment-right">
      <ul class="equipment-list">
        <li class="equipment-list-th">
          <span>姓名</span>
          <span>地点</span>
          <span>原因</span>
          <span>发生故障时间</span>
          <span>故障次数</span>
          <span>故障等级</span>
        </li>
        <li
          class="equipment-list-tr"
          :key="index"
          v-for="(item, index) in config.data"
        >
          <span>{{ item[0] }}</span>
          <span>{{ item[1] }}</span>
          <span>{{ item[2] }}</span>
          <span style="line-height: 20px;">{{ item[3] }}</span>
          <span>{{ item[4] }}</span>
          <span>{{ item[5] }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Charts from "@jiaminghi/charts";
export default {
  name: "management",
  data() {
    return {
      currentStatus: [8, 5, 3, 60],
      equipmentData: {
        series: [
          {
            type: "gauge",
            startAngle: -Math.PI / 2,
            endAngle: Math.PI * 1.5,
            arcLineWidth: 13,
            radius: "80%",
            data: [{ name: "资金占比", value: 44 }],
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            pointer: {
              show: false,
            },
            backgroundArc: {
              style: {
                stroke: "#224590",
              },
            },
            details: {
              show: true,
              formatter: "{value}%",
              style: {
                fill: "#1ed3e5",
                fontSize: 20,
              },
            },
          },
        ],
        color: ["#03d3ec"],
      },
      config: {
        header: [
          "名称",
          "地点",
          "原因",
          "发生故障时间",
          "故障次数",
          "故障等级",
        ],
        data: [
          [
            "tipss_controller_066_1",
            "066车1车厢",
            "设备断电",
            "2020/08/31 22:22:22",
            "1",
            "低",
          ],
          [
            "tipss_controller_066_2",
            "066车1车厢",
            "设备断电",
            "2020/08/31 22:22:22",
            "1",
            "低",
          ],
          [
            "tipss_controller_066_3",
            "066车1车厢",
            "设备断电",
            "2020/08/31 22:22:22",
            "1",
            "低",
          ],
          [
            "tipss_controller_066_4",
            "066车1车厢",
            "设备断电",
            "2020/08/31 22:22:22",
            "1",
            "低",
          ],
          [
            "tipss_controller_066_5",
            "066车1车厢",
            "设备断电",
            "2020/08/31 22:22:22",
            "1",
            "低",
          ],
        ],
        index: true,
        columnWidth: [50, 170, 300],
        align: ["center"],
        rowNum: 5,
        headerBGC: "#1981f6",
        headerHeight: 0,
        oddRowBGC: "rgba(0, 44, 81, 0.8)",
        evenRowBGC: "rgba(10, 29, 50, 0.8)",
      },
    };
  },
  methods: {
    drawChart() {
      const container = document.getElementById("gauge");
      const myChart = new Charts(container);
      const option1 = {
        series: [
          {
            type: "gauge",
            startAngle: -Math.PI / 2,
            endAngle: Math.PI * 1.5,
            arcLineWidth: 16,
            data: [{ value: 65, gradient: ["#03c2fd", "#1ed3e5", "#2fded6"] }],
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
              style: {
                stroke: "#393939",
                lineWidth: 1,
              },
            },
            pointer: {
              show: false,
            },
            // #393939
            dataItemStyle: {
              lineCap: "round",
            },
            details: {
              show: true,
              formatter: "{value}%",
              style: {
                fill: "#1ed3e5",
                fontSize: 35,
              },
            },
          },
        ],
      };
      myChart.setOption(option1);
    },
  },
  mounted() {
    // this.drawChart()
  },
};
</script>

<style scoped lang="scss">
.equipment {
  display: flex;
  padding: 4.2rem 30px 0;
}
.equipment-left {
  width: 24%;
  p {
    color: #9badf9;
    font-size: 1rem;
    margin: 0;
    padding-bottom: 0.6rem;
    margin: 0;
  }
  .ring-charts {
    width: 100%;
    height: 1vh;
    margin-bottom: 10px;
  }
  .malfunction {
    width: 15vh;
    height: 15vh;
    margin: 1rem auto;
    color: #32c5ff;
    font-size: 2rem;
    font-weight: bold;
  }
}
.equipment-right {
  width: 76%;
  .equipment-list-th {
    background: rgba(8, 164, 251, 1);
    margin: 0;
    padding: 10px 0;
    span {
      color: rgba(14, 34, 90, 1);
      font-size: 0.8rem;
    }
  }
  .equipment-list-tr {
    background: rgba(16, 37, 99, 1);
    margin-bottom: 0.7rem;
    padding: 1.3rem 0;
    span {
      vertical-align: middle;
      font-size: 0.8rem;
    }
  }
  .equipment-list-tr:last-child {
    margin-bottom: 0;
  }
  .equipment-list {
    list-style: none;
    margin: 0;
    padding: 0 1rem 0 1rem;
    span {
      display: inline-block;
      width: 15%;
    }
    span:nth-child(4) {
      width: 20%;
    }
    span:first-child {
      width: 20%;
    }
  }
}
.equipment-ul {
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    float: left;
    width: 50%;
    padding-bottom: 1rem;
    p {
      padding: 0;
      margin: 0;
    }
    .title {
      color: #9badf9;
      font-size: 1rem;
      padding: 6px 0;
    }
    .number {
      color: #32c5ff;
      font-size: 1.2rem;
      font-weight: bold;
      padding-top: 10px;
    }
  }
}
</style>
