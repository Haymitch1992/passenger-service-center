<template>
  <div class="border-box-content">
    <div class="unmanned-left">
      <div class="unmanned-chart" id="unmanned"></div>
      <ul class="current-status">
        <li class="current-item current-title">
          <p>当前</p>
          <p>状况:</p>
        </li>
        <li class="current-item">
          <p>接入数量</p>
          <p class="number">{{ current_status['接入数量'] }}</p>
        </li>
        <li class="current-item">
          <p>自动回复数量</p>
          <p class="number">{{ current_status['自动回复数量'] }}</p>
        </li>
        <li class="current-item">
          <p>人工回复数量</p>
          <p class="number">{{ current_status['人工回复数量'] }}</p>
        </li>
        <li class="current-item">
          <p>当日接入总数量</p>
          <p class="number">{{ current_status['当日接入总数量'] }}</p>
        </li>
      </ul>
      <ul class="efficiency">
        <li>
          <p>自动回复解决成功率</p>
          <span class="unit">（天)</span>
          <span class="number">{{
            auto_replay_success['自动回复解决成功率'] * 100 + '%'
          }}</span>
        </li>
        <li>
          <p>自动回复解决成功率</p>
          <span class="unit">（天)</span>
          <span class="number">{{
            auto_replay_success['自动回复解决成功率'] * 100 + '%'
          }}</span>
        </li>
        <li>
          <p>自动回复解决成功率</p>
          <span class="unit">（天)</span>
          <span class="number">{{
            auto_replay_success['自动回复解决成功率'] * 100 + '%'
          }}</span>
        </li>
      </ul>
    </div>
    <div class="unmanned-right">
      <p class="unmanned-title">热门问题Top10</p>
      <div>
        <div
          class="progress-out"
          :key="index"
          v-for="(item, index) in hotIssue"
        >
          <p class="progress-text">{{ item.text }}</p>
          <div
            class="progress-inner"
            :style="{ width: (item.value / hotIssue[0].value) * 100 + '%' }"
          ></div>
          <span class="number">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Charts from '@jiaminghi/charts';
import { GET_CUSTOMER } from '../config/url';
export default {
  name: 'passenger',
  data() {
    return {
      hotIssue: [], // 热门问题
      xAxisValue: [],
      seriesValueA: [],
      seriesValueB: [],
      auto_replay_success: { 自动回复解决成功率: 0.2 },
      current_status: {},
    };
  },
  methods: {
    getVideoList() {
      this.$axios.get(GET_CUSTOMER).then((res) => {
        this.hotIssue = [];
        // 处理热门问题
        for (let k in res.data.top_questions) {
          this.hotIssue.push({
            text: k,
            value: res.data.top_questions[k],
          });
        }
        // 处理echarts 数据
        for (let j in res.data.day_service) {
          this.xAxisValue.push(j);
          this.seriesValueA.push(res.data.day_service[j][0]);
          this.seriesValueB.push(res.data.day_service[j][1]);
        }
        this.drawEcharts();
        this.current_status = res.data.current_status;
        this.auto_replay_success = res.data.auto_replay_success;
      });
    },
    drawEcharts() {
      const container2 = document.getElementById('unmanned');
      const myChart2 = new Charts(container2);
      const option2 = {
        title: {
          text: '近24小时接入客服数量统计',
          style: {
            fill: '#9BADF9',
            fontSize: 14,
            textAlign: 'center',
            textBaseline: 'bottom',
          },
        },
        legend: {
          data: [
            {
              name: '自动回复数量',
              color: '#aeeff0',
            },
            {
              name: '人工回复数量',
              color: '#f1829f',
            },
          ],
          textStyle: {
            fontFamily: 'Arial',
            fontSize: 13,
            fill: '#9BADF9',
          },
        },
        xAxis: {
          name: '(小时)',
          data: this.xAxisValue,
          nameTextStyle: {
            fill: '#9BADF9',
            fontSize: 14,
          },
          axisLine: {
            style: {
              stroke: '#979797',
              lineWidth: 1,
            },
          },
          axisLabel: {
            style: {
              fill: '#9BADF9',
              fontSize: 14,
            },
          },

          axisTick: {
            style: {
              stroke: '#979797',
              lineWidth: 1,
            },
          },
        },
        yAxis: {
          name: '(个)',
          data: 'value',
          nameTextStyle: {
            fill: '#9BADF9',
            fontSize: 12,
          },
          splitLine: {
            style: {
              stroke: 'rgba(151, 151, 151, 1)',
              lineWidth: 1,
              lineDash: [8, 4],
            },
          },
          axisLine: {
            style: {
              stroke: '#979797',
              lineWidth: 1,
            },
          },
          axisTick: {
            style: {
              stroke: '#979797',
              lineWidth: 1,
            },
          },
          axisLabel: {
            style: {
              fill: '#9BADF9',
              fontSize: 14,
            },
          },
        },
        series: [
          {
            data: this.seriesValueA,
            name: '自动回复数量',
            type: 'line',
            smooth: true,
            lineArea: {
              show: true,
              gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)'],
            },
            lineStyle: {
              // lineDash: [3, 3],
              lineWidth: 2,
            },
          },
          {
            data: this.seriesValueB,
            name: '人工回复数量',
            type: 'line',
            smooth: true,
            lineArea: {
              show: true,
              gradient: ['rgba(223, 24, 127, .6)', 'rgba(223, 24, 127, .1)'],
            },
            lineStyle: {
              stroke: 'rgba(251, 114, 147, 1)',
              // lineDash: [3, 3],
              lineWidth: 2,
            },
            linePoint: {
              style: {
                stroke: 'rgba(251, 114, 147, 1)',
              },
            },
          },
        ],
      };
      myChart2.setOption(option2);
    },
  },
  mounted() {
    this.getVideoList();
  },
};
</script>

<style scoped lang="scss">
.border-box-content {
  display: flex;
  padding: 5vh 1vw 0;
  #unmanned {
    width: 100%;
    height: 22vh;
  }
  .unmanned-left {
    width: 60%;
    .efficiency {
      display: flex;
      list-style: none;
      padding: 0 0 0 2rem;
      margin: 0;
      width: 100%;
      li {
        width: 100%;
        height: 6vh;
        p {
          color: #9badf9;
          font-size: 14px;
        }
        p:first-child {
          text-align: left;
          position: relative;
          top: 0.6vh;
        }
        .unit {
          color: #9badf9;
          float: left;
          padding-left: 0px;
        }
        .number {
          color: #32c5ff;
          font-size: 1.4rem;
          float: left;
          padding-left: 1rem;
        }
      }
    }
    .current-status {
      list-style: none;
      color: #9badf9;
      font-size: 16px;
      margin: 0.2rem 0 0.4rem 0;
      padding: 0 0 0 2rem;
      line-height: 3vh;
      height: 6vh;

      li {
        padding: 4px 0;
        p:first-child {
          position: relative;
          top: 0.4vh;
        }
      }
      p {
        margin: 0;
      }

      .current-item {
        background: #102563;
        width: 20%;
        float: left;
        font-size: 14px;
      }
      .current-item:last-child {
        width: 25%;
      }
      .current-title {
        width: 3rem;
        color: #32c5ff;
        font-size: 14px;
        box-sizing: border-box;
        p {
          padding: 0;
          font-weight: bold;
        }
      }
      .number {
        color: #32c5ff;
        font-size: 24px;
      }
    }
  }
  .unmanned-right {
    width: 40%;
    text-align: left;
    p {
      margin: 0;
      padding: 0;
    }
    .unmanned-title {
      font-size: 1rem;
      line-height: 4vh;
    }
    .progress-out {
      width: 80%;
      height: 2.2vh;
      border-radius: 20px;
      background: #102563;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      margin-bottom: 1.2vh;
      .number {
        position: absolute;
        right: 10px;
        line-height: 2.2vh;
        top: 0;
        z-index: 2;
        font-size: 0.6rem;
      }
      .progress-text {
        padding: 0 10px;
        color: #ffffff;
        position: relative;
        z-index: 2;
        font-size: 0.6rem;
        line-height: 2.2vh;
      }
    }
    .progress-inner {
      width: 0%;
      height: 2.2vh;
      background: linear-gradient(to right, #2760e4, #32c5ff);
      z-index: 1;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 20px;
    }
  }
}
</style>
