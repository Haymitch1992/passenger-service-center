<template>
  <div>
    <dv-loading v-if="isloading" style="height:50vh;">Loading...</dv-loading>
    <div class="public-container">
      <div class="public-left">
        <div>
          <ul class="public-tab">
            <li :class="{ active: currentTab === 1 }" @click="changeInfo(1)">
              <span>突发事件</span>
            </li>
            <li :class="{ active: currentTab === 2 }" @click="changeInfo(2)">
              <span>乘客之声</span>
            </li>
            <li :class="{ active: currentTab === 3 }" @click="changeInfo(3)">
              <span>运营服务</span>
            </li>
          </ul>
          <ul class="public-content">
            <li v-for="(item, index) in publicList" :key="index">
              <p class="public-title" :title="item.content">
                <span class="public-status" :class="`s-${item.status}`"></span
                >{{ item.text }}
              </p>
              <p>
                {{ item.time }} <span class="source">{{ item.source }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="public-right">
        <div class="swiper-container">
          <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide>
              <div class="analyse-box">
                <div id="unmanned2"></div>
              </div>
              <div class="map-box">
                <p>地铁热词</p>
                <div id="friendsWordCloud" class="friends-word-cloud"></div>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div id="mapContainer"></div>
            </swiper-slide>
            <swiper-slide>
              <div class="analyse-box">
                <div id="analyse" class="analyse"></div>
                <ul class="dataView">
                  <li>
                    <p>服务缺陷</p>
                    <p>{{ resultNum[0] }}</p>
                  </li>
                  <li>
                    <p>客车不文明</p>
                    <p>{{ resultNum[1] }}</p>
                  </li>
                  <li>
                    <p>车站意外</p>
                    <p>{{ resultNum[2] }}</p>
                  </li>
                </ul>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import Js2WordCloud from 'js2wordcloud';
import Charts from '@jiaminghi/charts';
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';
import {
  GET_WEIBO_INFO,
  POST_WEIBO_HOTWORD,
  POST_WEIBO_TOTAL,
} from '../config/url';

export default {
  name: 'publicOpinion',
  components: {
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      isloading: true,
      swiperOption: {
        // Some Swiper option/callback...
      },
      currentTab: 1,
      publicList: [],
      keywordList: ['突发事件', '乘客之声', '运营服务'],
      wordCloudList: [],
      wordCloudShow: false,
      postTime: dayjs().format('YYYY-MM-DD HH:mm'),
      legendArr: [],
      myChart: {},
      geoCoordMap: {},
      name: '散点图',
      mapData: [],
      resultNum: [0, 0, 0],
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  mounted() {
    this.getInfo();
    this.get24Info();
    this.getWordCloud();
    this.getFenxi();
    this.getMapDate();
    this.getOheterInfo(0);
    this.getOheterInfo(1);
    this.getOheterInfo(2);
    let num = 0;
    setInterval(() => {
      num++;
      if (num >= 3) {
        num = 0;
      }

      this.swiper.slideTo(num, 1000, false);
    }, 10000);
  },

  methods: {
    getOheterInfo(num) {
      let arr = [
        ['*投诉*', '*埋怨*', '*生气*', '*建议*'],
        ['*冲突*', '*吵架*', '*争吵*', '*骂人*', '*冲突*'],
        [
          '*晚点*',
          '*延误*',
          '*停车*',
          '*瘫痪*',
          '*故障*',
          '*停电*',
          '*失火*',
          '*淹水*',
        ],
      ];
      let params = {
        query: {
          bool: {
            filter: {
              script: {
                script: {
                  params: {
                    now_times: this.postTime,
                  },
                  source:
                    "def sf = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt = sf.parse(doc['create_date.keyword'].value);def calendar = sf.getCalendar();calendar.setTime(dt);def instant = calendar.toInstant();def localDateTime = LocalDateTime.ofInstant(instant, ZoneOffset.UTC); localDateTime = localDateTime .plusHours(24*7);def sf_now = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt_now = sf_now.parse(params.now_times);def calendar_now = sf_now.getCalendar();calendar_now.setTime(dt_now);def instant_now = calendar_now.toInstant();def localDateTime_now = LocalDateTime.ofInstant(instant_now, ZoneOffset.UTC); return localDateTime_now.compareTo(localDateTime)<=0;",
                },
              },
            },
            should: [],
            minimum_should_match: 1,
          },
        },
        from: 0,
        size: 0,
      };
      for (let i = 0; i < arr[num].length; i++) {
        params.query.bool.should.push({
          wildcard: {
            'text.keyword': arr[num][i],
          },
        });
      }
      this.$axios.post(GET_WEIBO_INFO, params).then((res) => {
        this.$set(this.resultNum, num, res.data.hits.total);
        this.isloading = false;
      });
    },
    initSwiper() {
      this.swipier = new Swiper('.swiper-container', {
        // 如果需要分页器
        on: {
          slideChangeTransitionStart: () => {
            switch (this.activeIndex) {
              case 1:
                this.get24Info();
                this.getWordCloud();
                break;
              case 2:
                this.getFenxi();
                break;
            }
          },
        },
        autoplay: {
          disableOnInteraction: false,
        },
      });
    },
    mapinit(options) {
      this.myChart = this.$echarts.init(
        document.getElementById('mapContainer')
      );
      this.myChart.setOption(options);
      this.legendArr = options.series;
      this.legendArr.forEach((data) => {
        data.selected = true;
      });
      window.addEventListener(
        'resize',
        function() {
          this.myChart.resize();
        }.bind(this)
      );

      let index = 0; //播放所在下标
      setInterval(() => {
        this.myChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: index,
        });
        index++;
        if (index > this.mapData.length) {
          index = 0;
        }
      }, 3000);
    },
    _getCityData() {
      this.geoCoordMap = {
        新疆: [86.61, 40.79],
        西藏: [89.13, 30.66],
        黑龙江: [128.34, 47.05],
        吉林: [126.32, 43.38],
        辽宁: [123.42, 41.29],
        内蒙古: [112.17, 42.81],
        北京: [116.4, 40.4],
        宁夏: [106.27, 36.76],
        山西: [111.95, 37.65],
        河北: [115.21, 38.44],
        天津: [117.04, 39.52],
        青海: [97.07, 35.62],
        甘肃: [103.82, 36.05],
        山东: [118.01, 36.37],
        陕西: [108.94, 34.46],
        河南: [113.46, 34.25],
        安徽: [117.28, 31.86],
        江苏: [120.26, 32.54],
        上海: [121.46, 31.28],
        四川: [103.36, 30.65],
        湖北: [112.29, 30.98],
        浙江: [120.15, 29.28],
        重庆: [107.51, 29.63],
        湖南: [112.08, 27.79],
        江西: [115.89, 27.97],
        贵州: [106.91, 26.67],
        福建: [118.31, 26.07],
        云南: [101.71, 24.84],
        台湾: [121.01, 23.54],
        广西: [108.67, 23.68],
        广东: [113.98, 22.82],
        海南: [110.03, 19.33],
        澳门: [113.54, 22.19],
        香港: [114.17, 22.32],
      };
      this._getMyChart();
    },
    convertData(data) {
      let res = [];
      for (let i = 0; i < this.mapData.length; i++) {
        let geoCoord = this.geoCoordMap[data[i].name];
        // let geoCoord = this.geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            // name: data[x].name,
            // value: geoCoord.concat(Math.random() * 200)
            value: geoCoord.concat(data[i].value),
          });
        }
      }
      return res;
    },
    _getMyChart() {
      let options = {
        // backgroundColor: '#404a59',
        title: {
          text: '地铁城市舆情数据',
          textStyle: {
            color: '#9BADF9',
            fontSize: 14,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return params.name + ' : ' + params.value[2];
          },
        },
        legend: {
          show: false,
        },
        visualMap: {
          min: 0,
          max: 200,
          bottom: '10%',
          splitNumber: 5,
          inRange: {
            color: ['#255B78', '#2A7484', '#2F9696', '#3BBCB0', '#51D4EB'],
          },
          textStyle: {
            color: '#fff',
          },
        },
        geo: {
          map: 'china',
          label: {
            emphasis: {
              show: false,
            },
          },
          zoom: 1,
          top: '10%',
          left: '20%',
          itemStyle: {
            normal: {
              color: '#3c4247',
              opacity: 0.6,
              borderColor: 'rgba(255, 255, 255, 0.35)',
            },
            emphasis: {
              color: '#2a333d',
            },
          },
        },
        series: [
          {
            name: '标签1',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: function(val) {
              return val[2] / 6 + 4;
            },
            label: {
              show: false,
            },
            itemStyle: {
              emphasis: {
                borderColor: '#fff',
                borderWidth: 1,
              },
            },
            data: this.convertData(this.mapData),
          },
        ],
      };
      this.mapinit(options);
    },
    // 获取地图
    getMapDate() {
      // 使用刚指定的配置项和数据显示图表。
      this.$axios
        .post(GET_WEIBO_INFO, {
          size: 0,
          query: {
            script: {
              script: {
                params: {
                  now_times: this.postTime,
                },
                source:
                  "def sf = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt = sf.parse(doc['create_date.keyword'].value);def calendar = sf.getCalendar();calendar.setTime(dt);def instant = calendar.toInstant();def localDateTime = LocalDateTime.ofInstant(instant, ZoneOffset.UTC); localDateTime = localDateTime .plusHours(24*30);def sf_now = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt_now = sf_now.parse(params.now_times);def calendar_now = sf_now.getCalendar();calendar_now.setTime(dt_now);def instant_now = calendar_now.toInstant();def localDateTime_now = LocalDateTime.ofInstant(instant_now, ZoneOffset.UTC); return localDateTime_now.compareTo(localDateTime)<=0;",
              },
            },
          },
          aggs: {
            _result: {
              terms: {
                field: 'province.keyword',
                size: 100,
              },
            },
          },
        })
        .then((res) => {
          let arr = res.data.aggregations._result.buckets;
          this.mapData = [];
          arr.forEach((item) => {
            if (item.key && item.doc_count) {
              this.mapData.push({
                name: item.key,
                value: item.doc_count,
              });
            }
          });
          this._getCityData();
        });
    },
    // 获取微博信息
    getFenxi() {
      const container = document.getElementById('analyse');
      const myChart = new Charts(container);
      this.$axios
        .post(POST_WEIBO_TOTAL, {
          _source: ['wbdate', 'wbtotal'],
          query: {
            script: {
              script: {
                params: {
                  now_times: this.postTime,
                },
                source:
                  "def localDateTime= doc['wbdate'].value.toLocalDateTime(); localDateTime = localDateTime .plusHours(24*7);def sf_now = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt_now = sf_now.parse(params.now_times);def calendar_now = sf_now.getCalendar();calendar_now.setTime(dt_now);def instant_now = calendar_now.toInstant();def localDateTime_now = LocalDateTime.ofInstant(instant_now, ZoneOffset.UTC); return localDateTime_now.compareTo(localDateTime)<=0;",
              },
            },
          },
        })
        .then((res) => {
          let arr = res.data.hits.hits;
          let output = [];
          let keyArr = [];
          let valueArr = [];
          arr.forEach((item) => {
            output.push({
              key: item._source.wbdate.slice(5, 10),
              value: item._source.wbtotal,
            });
          });

          output = this._.sortBy(output, function(item) {
            return new Date(item.key);
          });

          output.forEach((item) => {
            keyArr.push(item.key);
            valueArr.push(item.value);
          });
          // 假数据
          valueArr = [100, 123, 300, 149, 100, 123, 300];
          keyArr = ['1-16', '1-17', '1-18', '1-19', '1-20', '1-21', '1-22'];
          const option1 = {
            color: ['#ffffff'],
            title: {
              text: '近7天舆情数据分布趋势',
              style: {
                fill: '#9BADF9',
                fontSize: 14,
                textAlign: 'center',
                textBaseline: 'bottom',
              },
            },
            xAxis: {
              name: '日期',
              data: keyArr,
              nameTextStyle: {
                fill: '#9BADF9',
                fontSize: 14,
              },
              axisLabel: {
                style: {
                  fill: '#9BADF9',
                  fontSize: 12,
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
              name: '(数量)',
              data: 'value',
              nameTextStyle: {
                fill: '#9BADF9',
                fontSize: 14,
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
                  fontSize: 14,
                },
              },
            },
            series: [
              {
                data: valueArr,
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
        });
    },

    // 获取词云
    getWordCloud() {
      this.$axios
        .post(POST_WEIBO_HOTWORD, {
          size: 0,
          query: {
            script: {
              script: {
                params: {
                  now_times: this.postTime,
                },
                source:
                  "def localDateTime= doc['hdate'].value.toLocalDateTime(); localDateTime = localDateTime .plusHours(24*30);def sf_now = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt_now = sf_now.parse(params.now_times);def calendar_now = sf_now.getCalendar();calendar_now.setTime(dt_now);def instant_now = calendar_now.toInstant();def localDateTime_now = LocalDateTime.ofInstant(instant_now, ZoneOffset.UTC); return localDateTime_now.compareTo(localDateTime)<=0;",
              },
            },
          },
          aggs: {
            _result: {
              terms: {
                field: 'hword.keyword',
                size: 100,
              },
              aggs: {
                employed_origin: {
                  sum: {
                    script: {
                      lang: 'painless',
                      source:
                        "def lhtotal = Long.parseLong(doc['htotal.keyword'].value) ;  return lhtotal; ",
                    },
                  },
                },
              },
            },
          },
        })
        .then((res) => {
          this.wordCloudShow = true;
          let arr = res.data.aggregations._result.buckets;
          arr.forEach((item) => {
            this.wordCloudList.push([item.key, item.employed_origin.value]);
            // this.wordCloudList.push([item.key, item.employed_origin.value]);
          });
          // 渲染词云
          var wc = new Js2WordCloud(
            document.getElementById('friendsWordCloud')
          ); //容器
          wc.setOption({
            tooltip: {
              show: false, // 默认：false
              backgroundColor: 'rgba(0, 0, 0, 0.701961)',
              formatter: function(item) {
                if (item[1] > 12) {
                  document.querySelector(
                    '.__wc_tooltip__'
                  ).style.backgroundColor = 'rgba(0, 0, 0, 0.701961)';
                  return item[0] + '：' + item[2];
                } else {
                  document.querySelector(
                    '.__wc_tooltip__'
                  ).style.backgroundColor = 'transparent';
                  return '';
                }
              },
            },
            list: this.wordCloudList, // 词云数据源2
            gridSize: 12,
            fontSizeFactor: 0.4,
            maxFontSize: 24, //最大字号
            minFontSize: 14, //最小字号
            rotationSteps: 30,
            rotateRatio: 0, // 旋转概率
            ellipticity: 4,
            wait: 10,
            abortThreshold: 2000,
            color(word, weight) {
              //自定义颜色
              if (weight < 50) {
                return '#A6A4A4';
              } else if (weight < 100) {
                return '#32C5FF';
              } else {
                return '#0091FF';
              }
            },
            backgroundColor: 'rgba(255, 255, 255, 0)',
          });
        });
    },
    changeInfo(num) {
      this.currentTab = num;
      this.getInfo();
    },
    // 获取24小时客服数量统计
    get24Info() {
      this.$axios
        .post(GET_WEIBO_INFO, {
          size: 0,
          query: {
            script: {
              script: {
                params: {
                  now_times: this.postTime,
                },
                source:
                  "def sf = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt = sf.parse(doc['create_date.keyword'].value);def calendar = sf.getCalendar();calendar.setTime(dt);def instant = calendar.toInstant();def localDateTime = LocalDateTime.ofInstant(instant, ZoneOffset.UTC); localDateTime = localDateTime .plusHours(24);def sf_now = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt_now = sf_now.parse(params.now_times);def calendar_now = sf_now.getCalendar();calendar_now.setTime(dt_now);def instant_now = calendar_now.toInstant();def localDateTime_now = LocalDateTime.ofInstant(instant_now, ZoneOffset.UTC); return localDateTime_now.compareTo(localDateTime)<=0;",
              },
            },
          },
          aggs: {
            group_by_tags: {
              terms: {
                size: 10000,
                script: {
                  inline:
                    "String s = doc['create_date.keyword'].value;String x= s.substring(0,13);return x+'####'+doc['emotion.keyword'].values",
                },
              },
            },
          },
        })
        .then((response) => {
          let currentStart = new Date().getHours() - 23;
          let arr = response.data.aggregations.group_by_tags.buckets;
          let frontArr = new Array(24).fill(1); // 正面数据
          let negativeArr = new Array(24).fill(1); // 负面数据
          let timeArr = [];
          arr = this._.sortBy(arr, function(item) {
            return new Date(item.key.split('####')[0] + ':00');
          });
          arr.forEach((item) => {
            // 筛选满足条件的数据
            let str2 = item.key.split(' ')[1];
            let time = parseInt(str2.slice(0, 2));
            let time2 = parseInt(
              item.key.split(' ')[0].slice(-2) - new Date().getDate()
            );
            time = time + 24 * time2 - currentStart;
            let type = parseInt(str2.slice(-2));
            if (time >= 0) {
              if (type) {
                frontArr[time] = item.doc_count;
              } else {
                negativeArr[time] = item.doc_count;
              }
            }
          });
          // 假数据
          frontArr = [
            233,
            142,
            34,
            48,
            22,
            141,
            36,
            52,
            233,
            142,
            34,
            48,
            22,
            141,
            36,
            52,
            233,
            142,
            34,
            48,
            22,
            141,
            36,
            52,
          ];
          negativeArr = [
            22,
            141,
            36,
            52,
            22,
            44,
            62,
            124,
            22,
            141,
            36,
            52,
            22,
            44,
            62,
            124,
            22,
            141,
            36,
            52,
            22,
            44,
            62,
            124,
          ];
          console.log('24小时 舆情统计', arr, frontArr, negativeArr);
          // 以当前点为最终坐标点 起始点 -24

          for (let j = 0; j < 24; j++) {
            timeArr[j] = currentStart;
            currentStart++;
          }
          console.log(timeArr);
          const container2 = document.getElementById('unmanned2');
          const myChart2 = new Charts(container2);
          const option2 = {
            title: {
              text: '近24小时舆情数量统计',
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
                  name: '正面舆情数量',
                  color: '#aeeff0',
                },
                {
                  name: '负面舆情数量',
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
              data: timeArr,
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
              name: '(条)',
              data: 'value',
              nameTextStyle: {
                fill: '#9BADF9',
                fontSize: 14,
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
                data: frontArr,
                name: '正面舆情数量',
                type: 'line',
                smooth: true,
                lineArea: {
                  show: true,
                  gradient: [
                    'rgba(55, 162, 218, 0.6)',
                    'rgba(55, 162, 218, 0)',
                  ],
                },
                lineStyle: {
                  // lineDash: [3, 3],
                  lineWidth: 2,
                },
              },
              {
                data: negativeArr,
                name: '负面舆情数量',
                type: 'line',
                smooth: true,
                lineArea: {
                  show: true,
                  gradient: [
                    'rgba(223, 24, 127, .6)',
                    'rgba(223, 24, 127, .1)',
                  ],
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
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },

    getInfo() {
      this.$axios
        .post(GET_WEIBO_INFO, {
          query: {
            bool: {
              must: [
                {
                  term: {
                    'weibo_type.keyword': this.keywordList[this.currentTab - 1],
                  },
                },
              ],
            },
          },
          sort: [
            {
              _script: {
                script: {
                  inline:
                    "String s = doc['create_date.keyword'].value;String x= s.substring(0,10);return x",
                },
                type: 'string',
                order: 'desc',
              },
            },
            {
              weight: {
                order: 'desc',
              },
            },
          ],
        })
        .then((response) => {
          this.publicList = [];
          response.data.hits.hits.slice(0, 5).forEach((item) => {
            this.publicList.push({
              content: item._source.text,
              text: item._source.text.slice(0, 12) + '...',
              //!目前是按照权重值进行的区分
              status: item._source.weight > 20 ? 1 : 2,
              time: item._source.create_date,
              source: item._source.source,
            });
          });
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../node_modules/swiper/swiper';
.analyse-box {
  width: 100%;
  height: 22vh;
}
.map-box {
  width: 100%;
  height: 8vh;
}
#analyse {
  width: 100%;
  height: 28vh;
  display: block;
  overflow: hidden;
}
#mapContainer {
  width: 100%;
  height: 37vh;
}
.swiper-slide {
  width: 100%;
}
.swiper-container {
  height: 37vh;
}
.public-container {
  padding-top: 4.2rem;
  ul {
    list-style: none;
    text-align: left;
    padding: 0;
    margin: 0;
  }
  .public-content {
    padding: 3vh 1vw 0vh 2vw;
    color: rgba(255, 255, 255, 0.85);
    font-size: 12px;
    p {
      margin: 0;
    }
    .public-title {
      font-size: 0.8rem;
      position: relative;
      top: 0.6vh;
    }
    li {
      height: 6.8vh;
      line-height: 3vh;
      position: relative;
      p:first-child {
        position: relative;
        left: -12px;
      }
    }
    li:after {
      content: '';
      display: block;
      width: 130%;
      height: 4px;
      background: url('../assets/line.png') no-repeat;
      background-size: 100%;
      position: absolute;
      left: -50px;
      bottom: 4px;
    }
    .source {
      float: right;
      color: #ccc;
    }
    .public-status {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
      position: relative;
      left: -12px;
      top: 0px;
    }
    .s-1 {
      background: #df2021;
      border: 0.2rem solid #711010;
    }
    .s-2 {
      background: #ea9100;
      border: 0.2rem solid #7d4e00;
    }
    .s-3 {
      background: #dfdf02;
      border: 0.2rem solid #666601;
    }
  }
  .public-tab {
    height: 30px;
    position: absolute;
    left: -13px;
    width: 100%;
    li {
      width: 31%;
      font-size: 0.8rem;
      height: 1.4rem;
      line-height: 1.4rem;
      text-align: center;
      font-size: 0.74rem;
      background: #093c7f;
      color: rgba(255, 255, 255, 0.85);
      transform: skewX(-45deg);
      float: left;
      cursor: pointer;
      margin-right: 1%;
      span {
        display: inline-block;
        transform: skewX(45deg);
      }
    }
    li:last-child {
      margin-right: 0;
    }
    li:first-child {
      width: 36%;
    }
    .active {
      background: #32c5ff;
      color: #0a1a44;
    }
  }
}

.public-left {
  width: 30%;
  float: left;
  background: linear-gradient(#102563, #102563);
  margin-left: 40px;
  position: relative;
  overflow: hidden;
}
.public-right {
  width: 63%;
  float: left;
  box-sizing: border-box;
  padding: 0 20px;
  #unmanned2 {
    width: 100%;
    height: 22vh;
  }
  .dataView {
    display: flex;
    li {
      width: 100%;
      background: #102563;
      margin: 0 2px;
      line-height: 3vh;
      p:first-child {
        position: relative;
        top: 1vh;
      }
      p:last-child {
        color: #32c5ff;
        font-size: 1.2rem;
      }
    }
  }
  .friends-word-cloud {
    margin: 0px 0 0.8rem;
    width: 100%;
    height: 10vh;
  }
  p {
    color: #9badf9;
    text-align: center;
    font-weight: bold;
    font-size: 0.9rem;
    margin: 0.4rem 0;
  }
}
</style>
