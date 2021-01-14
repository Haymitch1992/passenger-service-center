<template>
  <div id="equipment-container" class="equipment-container"></div>
</template>

<script>
import Charts from '@jiaminghi/charts';
import { GET_PERSONAL_SERVICE } from '../config/url';

export default {
  name: 'equipment',
  data() {
    return {
      xAxisValue: [],
      seriesValue: [],
    };
  },
  methods: {
    getVideoList() {
      this.$axios.get(GET_PERSONAL_SERVICE).then((res) => {
        for (let k in res.data) {
          this.xAxisValue.push(k);
          this.seriesValue.push(res.data[k]);
        }
        console.log(this.xAxisValue, this.seriesValue);
        this.drawEcharts();
      });
    },
    drawEcharts() {
      const container = document.getElementById('equipment-container');
      const myChart = new Charts(container);
      const option1 = {
        color: ['#ffffff'],
        title: {
          text: '当日申请不同服务数量统计',
          style: {
            fill: '#9BADF9',
            fontSize: 16,
            textAlign: 'center',
            textBaseline: 'bottom',
          },
        },
        xAxis: {
          name: '(服务种类)',
          data: this.xAxisValue,
          nameTextStyle: {
            fill: '#9BADF9',
            fontSize: 16,
          },
          axisLabel: {
            style: {
              fill: '#9BADF9',
              fontSize: 16,
            },
          },
          axisLine: {
            style: {
              stroke: '#979797',
              lineWidth: 1,
            },
          },
        },
        yAxis: {
          name: '(人数)',
          data: 'value',
          nameTextStyle: {
            fill: '#9BADF9',
            fontSize: 16,
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
          axisLabel: {
            style: {
              fill: '#9BADF9',
              fontSize: 16,
            },
          },
        },
        series: [
          {
            data: this.seriesValue,
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              offset: [0, -10],
              style: {
                fill: '#9BADF9',
                fontSize: 14,
              },
            },
            gradient: {
              color: ['#22BFFF', '#3F28CE'],
            },
            barWidth: '30%',
          },
        ],
      };
      myChart.setOption(option1);
    },
  },
  mounted() {
    this.getVideoList();
  },
};
</script>

<style scoped>
.equipment-container {
  width: calc(100% - 2vw);
  margin: 0 auto;
  padding-top: 5vh;
  height: calc(100% - 10vh);
}
</style>
