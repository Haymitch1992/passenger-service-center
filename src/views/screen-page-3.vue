<template>
  <div class="screen">
    <div class="screen-title">
      <span class="screen-title-time">2020年10月27日 14:41:32</span>
    </div>
    <div class="screen-content">
      <div class="screen-left">
        <dv-border-box-11 title="乘客服务综合监控">
          <ul class="screen-info">
            <li>
              <span>站台名称：呼叫楼</span>
              <span>时间：2020年7月</span>
              <span>高峰时段：早7：00-9:00 晚17:00-20:00</span>
              <span>监控状态：正常</span>
            </li>
          </ul>
          <div>
            <ul class="screen-left-ul">
              <li v-for="(item, index) in videoList" :key="index">
                <dv-border-box-13>
                  <div class="video">
                    <div class="video-box">
                      <videobox :videoIndex="index"></videobox>
                    </div>
                    <div class="video-title">
                      <span>类型：{{ item.type }}</span>
                      <span>位置：{{ item.pos }}</span>
                      <span>状态：{{ item.status }}</span>
                    </div>
                  </div>
                </dv-border-box-13>
              </li>
            </ul>
          </div>
        </dv-border-box-11>
      </div>
      <div class="screen-right">
        <dv-border-box-11 title="主动报警列表">
          <div class="monitoring">
            <dv-border-box-10
              class="monitoring-item"
              v-for="(item, index) in alertList"
              :key="index"
            >
              <div class="monitoring-container">
                <div class="monitoring-left">
                  <img
                    src="../assets/alarm.jpg"
                    alt=""
                    class="monitoring-img"
                  />
                </div>
                <div class="monitoring-right">
                  <p>
                    报警等级：{{ item['报警等级'] }}
                    <span class="margin-left-text"
                      >报警内容：{{ item['报警内容'] }}</span
                    >
                  </p>
                  <p>开始时间：{{ item['开始时间'] }}</p>
                  <p>持续时间：{{ item['持续时间'] }}s</p>
                  <p>发生位置：{{ item['发生位置'] }}</p>
                </div>
              </div>
            </dv-border-box-10>
          </div>
        </dv-border-box-11>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_VIDEO_LIST, GET_ALERT_LIST } from '../config/url';
import videobox from '../components/video';
export default {
  name: 'screen-page-3',
  components: {
    videobox,
  },
  data() {
    return {
      videoList: [],
      alertList: [],
    };
  },

  mounted() {
    this.getVideoList();
    this.getAlertList();
  },
  methods: {
    getAlertList() {
      this.$axios.get(GET_ALERT_LIST).then((res) => {
        console.log(res.data);
        this.alertList = res.data;
      });
    },
    getVideoList() {
      this.$axios.get(GET_VIDEO_LIST).then((res) => {
        console.log(res.data);
        this.videoList = res.data;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.screen {
  padding: 0 20px;
}
.screen-title {
  height: 100px;
  background: url('../assets/title-line.png') no-repeat 0 40px;
  position: relative;
  .screen-title-time {
    display: inline-block;
    background: #112a73;
    position: absolute;
    top: 16px;
    right: 300px;
    padding: 10px 36px;
    font-size: 26px;
  }
}
.screen-info {
  padding-top: 100px;
  list-style: none;
  margin: 0;
  padding-bottom: 20px;
  li {
    text-align: left;
    padding-left: 14px;
  }
  span {
    display: inline-block;
    margin-right: 110px;
    color: #ffffff;
  }
}
.screen-left {
  width: 70%;
  float: left;
  .screen-left-ul {
    margin: 0;
    list-style: none;
    padding-top: 20px;
    height: 75vh;
    li {
      width: 50%;
      box-sizing: border-box;
      padding: 10px 50px 26px 10px;
      float: left;
      height: 37vh;
    }
  }
  .video-box {
    background: #203565;
    width: 100%;
    height: 32vh;
    position: relative;
  }
  .video {
    padding: 24px 20px 24px 20px;
    height: 32vh;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }
  .video-title {
    color: #9badf9;
    text-align: left;
    position: absolute;
    width: calc(100% - 40px);
    height: 100px;
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(244, 244, 244, 0));
    box-sizing: border-box;
    top: 24px;
    line-height: 50px;
    padding-left: 20px;
    span {
      padding: 0 30px 0 0;
    }
  }
}
.screen-right {
  width: 30%;
  float: left;
  .monitoring {
    padding: 4.1rem 1.6rem 0.6rem;
  }
  .monitoring-item {
    height: 14vh;
    width: 100%;
    margin-bottom: 28px;
  }
  .monitoring-left {
    float: left;
    width: 40%;
    height: 12vh;
    .monitoring-img {
      width: 80%;
      margin: 2vh auto;
      height: 10vh;
      background: #203565;
      display: block;
    }
  }
  .monitoring-right {
    float: left;
    width: 60%;
    text-align: left;
    padding-top: 20px;
    height: 12vh;
    p {
      color: #9badf9;
      margin: 0.4rem 0;
      .margin-left-text {
        margin-left: 4rem;
      }
    }
  }
}
</style>
