<template>
  <div>
    <dv-loading v-if="isloading" style="height:50vh;">Loading...</dv-loading>
    <div class="equipment">
      <div class="equipment-left">
        <p class="equipment-title">设备故障状态</p>
        <dv-decoration-9 :dur="6" class="malfunction">{{
          rate
        }}</dv-decoration-9>
        <ul class="equipment-ul">
          <li>
            <p class="title">接入数量</p>
            <p class="number">{{ deviceStatus.Number }}</p>
          </li>
          <li>
            <p class="title">故障数量</p>
            <p class="number">{{ deviceStatus.Error }}</p>
          </li>
          <li>
            <p class="title">正常数量</p>
            <p class="number">{{ deviceStatus.Normal }}</p>
          </li>
        </ul>
      </div>

      <div class="equipment-right">
        <ul class="equipment-list">
          <li class="equipment-list-th">
            <span>名称</span>
            <span>地点</span>
            <span>原因</span>
            <span>故障发生时间</span>
            <span>故障次数</span>
            <span>故障等级</span>
          </li>
          <li
            class="equipment-list-tr"
            :key="index"
            v-for="(item, index) in config.data"
          >
            <span>{{ item.DeviceID }}</span>
            <span>{{ item.Pos }}</span>
            <span>{{ item.Reason }}</span>
            <span style="line-height: 20px;">{{ item.Time }}</span>
            <span>{{ item.FailuresNum }}</span>
            <span>{{ item.FailuresClass }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_DEVICE_SATAUS, GET_DEVICE_MONITOR } from '../config/url';
export default {
  name: 'management',
  data() {
    return {
      isloading: true,
      deviceStatus: {
        Number: 0,
        Error: 0,
        Normal: 0,
      },
      currentStatus: [8, 5, 3, 60],
      equipmentData: {
        series: [
          {
            type: 'gauge',
            startAngle: -Math.PI / 2,
            endAngle: Math.PI * 1.5,
            arcLineWidth: 13,
            radius: '80%',
            data: [{ name: '资金占比', value: 44 }],
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
                stroke: '#224590',
              },
            },
            details: {
              show: true,
              formatter: '{value}%',
              style: {
                fill: '#1ed3e5',
                fontSize: 20,
              },
            },
          },
        ],
        color: ['#03d3ec'],
      },
      config: {
        header: [
          '名称',
          '地点',
          '原因',
          '发生故障时间',
          '故障次数',
          '故障等级',
        ],
        data: [
          [
            'tipss_controller_066_1',
            '066车1车厢',
            '设备断电',
            '2020/08/31 22:22:22',
            '1',
            '低',
          ],
          [
            'tipss_controller_066_2',
            '066车1车厢',
            '设备断电',
            '2020/08/31 22:22:22',
            '1',
            '低',
          ],
          [
            'tipss_controller_066_3',
            '066车1车厢',
            '设备断电',
            '2020/08/31 22:22:22',
            '1',
            '低',
          ],
          [
            'tipss_controller_066_4',
            '066车1车厢',
            '设备断电',
            '2020/08/31 22:22:22',
            '1',
            '低',
          ],
          [
            'tipss_controller_066_5',
            '066车1车厢',
            '设备断电',
            '2020/08/31 22:22:22',
            '1',
            '低',
          ],
        ],
        index: true,
        columnWidth: [50, 170, 300],
        align: ['center'],
        rowNum: 5,
        headerBGC: '#1981f6',
        headerHeight: 0,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)',
      },
    };
  },
  computed: {
    rate() {
      let num = this.deviceStatus.Error / this.deviceStatus.Number;
      num = num.toFixed(2);
      console.log(num);
      num = num * 100 + '%';
      return num;
    },
  },
  methods: {
    getList() {
      // 获取设备状态
      this.$axios.get(GET_DEVICE_SATAUS).then((res) => {
        console.log(res.data);
        this.deviceStatus = res.data;
      });
      // 获取设备信息列表
      this.$axios.get(GET_DEVICE_MONITOR).then((res) => {
        console.log(res.data);
        this.config.data = res.data;
        this.isloading = false;
      });
      //
    },
  },
  mounted() {
    this.getList();
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
  .equipment-title {
    color: #9badf9;
    font-size: 1rem;
    margin: 0;
    margin: 0;
    height: 4vh;
    line-height: 4vh;
  }
  p {
    margin: 0;
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
    margin: 1vh auto;
    color: #32c5ff;
    font-size: 2rem;
    font-weight: bold;
  }
}
.equipment-right {
  width: 76%;
  .equipment-list-th {
    background: rgba(8, 164, 251, 1);
    line-height: 3vh;
    height: 3vh;
    span {
      color: rgba(14, 34, 90, 1);
      font-size: 0.7rem;
    }
  }
  .equipment-list-tr {
    background: #172e73;
    margin-top: 1vh;
    line-height: 5.4vh;
    height: 5.4vh;
    span {
      vertical-align: middle;
      font-size: 0.7rem;
    }
  }
  .equipment-list-tr:last-child {
    margin-bottom: 0;
  }
  .equipment-list {
    list-style: none;
    margin: 0;
    line-height: 1.8vh;
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
    height: 8vh;
    line-height: 4vh;
    p {
      padding: 0;
      margin: 0;
      width: 100%;
    }
    .title {
      color: #9badf9;
      font-size: 1rem;
      position: relative;
      top: 1.4vh;
    }
    .number {
      color: #32c5ff;
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
}
</style>
