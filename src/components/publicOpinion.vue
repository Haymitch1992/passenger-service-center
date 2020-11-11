<template>
    <div class="public-container">
        <div class="public-left">
            <div>
                <ul class="public-tab">
                    <li :class="{active:currentTab===1}" @click="changeInfo(1)"><span>突发事件</span></li>
                    <li :class="{active:currentTab===2}" @click="changeInfo(2)"><span>乘客之声</span></li>
                    <li :class="{active:currentTab===3}" @click="changeInfo(3)"><span>运营服务</span></li>
                </ul>
                <ul class="public-content">
                    <li v-for="(item,index) in publicList" :key="index">
                        <p class="public-title"><span class="public-status" :class="`s-${item.status}`"></span>{{item.text}}</p>
                        <p>{{item.time}} <span class="source">{{item.source}}</span></p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="public-right">
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        <!-- 轮播第一屏 -->
                        <div class="swiper-slide">
                            <div class="analyse-box">
                                <div id="unmanned2"></div>
                            </div>
                            <div class="map-box">
                                <div id="friendsWordCloud" class="friends-word-cloud"></div>
                                <p>与地铁相关词云</p>
                            </div>


                        </div>
                        <!-- 轮播第二屏 -->
                        <div class="swiper-slide">
                                <div class="analyse-box" style="height: 300px!important;">
                                    <div id="analyse" class="analyse" ></div>
                                </div>

                                <!-- 图表 -->
<!--                                <div id="analyse" class="analyse" ></div>-->
                                <!-- 地图组件 -->
<!--                                <dv-flyline-chart :config="config" :dev="true" style="width:413px;height:141px;" />-->
                        </div>
                        <div class="swiper-slide">
                            <div id="mapContainer" style="width: 100%;height:500px;"></div>
                        </div>

                    </div>
                </div>


        </div>
    </div>
</template>

<script>
    import dayjs from 'dayjs'
    import Js2WordCloud from 'js2wordcloud'
    import Charts from '@jiaminghi/charts'
    import {GET_WEIBO_INFO, POST_WEIBO_HOTWORD, POST_WEIBO_TOTAL} from "../config/url";
    import Swiper from 'swiper';

    export default {
        name: "publicOpinion",
        data(){
            return{
                currentTab:1,
                publicList:[],
                keywordList:['突发事件','乘客之声','运营服务'],
                wordCloudList:[],
                wordCloudShow:false,
                postTime:dayjs().format('YYYY-MM-DD HH:mm'),
                //postTime:'2020-10-20 10:10:00',
                // 地图数据
                legendArr: [],
                myChart: {},
                geoCoordMap: {},
                name: '散点图'
            }
        },
        mounted() {
            this.getInfo()
            this.get24Info()
            this.getWordCloud()
            this.getFenxi()
            this.getMapDate()

            new Swiper ('.swiper-container', {
                autoplay:true,
                // 如果需要分页器
                on: {
                    slideChangeTransitionStart: ()=>{
                        switch (this.activeIndex) {
                            case 1:
                                this.get24Info()
                                this.getWordCloud()
                                break
                            case 2:
                                this.getFenxi()
                                break
                        }
                    },
                },
            })
            this._getCityData()
        },
        methods:{
            mapinit(options) {
                this.myChart = this.$echarts.init(document.getElementById('mapContainer'))
                this.myChart.setOption(options)
                this.legendArr = options.series
                this.legendArr.forEach((data) => {
                    data.selected = true;
                })
                window.addEventListener('resize', function() {
                    this.myChart.resize()
                }.bind(this))
            },
            _getCityData() {
                this.geoCoordMap = {
                    "海门": [121.15, 31.89],
                    "鄂尔多斯": [109.781327, 39.608266],
                    "招远": [120.38, 37.35],
                    "舟山": [122.207216, 29.985295],
                    "齐齐哈尔": [123.97, 47.33],
                    "盐城": [120.13, 33.38],
                    "赤峰": [118.87, 42.28],
                    "青岛": [120.33, 36.07],
                    "乳山": [121.52, 36.89],
                    "金昌": [102.188043, 38.520089],
                    "泉州": [118.58, 24.93],
                    "莱西": [120.53, 36.86],
                    "日照": [119.46, 35.42],
                    "胶南": [119.97, 35.88],
                    "南通": [121.05, 32.08],
                    "拉萨": [91.11, 29.97],
                    "云浮": [112.02, 22.93],
                    "梅州": [116.1, 24.55],
                    "文登": [122.05, 37.2],
                    "上海": [121.48, 31.22],
                    "攀枝花": [101.718637, 26.582347],
                    "威海": [122.1, 37.5],
                    "承德": [117.93, 40.97],
                    "厦门": [118.1, 24.46],
                    "汕尾": [115.375279, 22.786211],
                    "潮州": [116.63, 23.68],
                    "丹东": [124.37, 40.13],
                    "太仓": [121.1, 31.45],
                    "曲靖": [103.79, 25.51],
                    "烟台": [121.39, 37.52],
                    "福州": [119.3, 26.08],
                    "瓦房店": [121.979603, 39.627114],
                    "即墨": [120.45, 36.38],
                    "抚顺": [123.97, 41.97],
                    "玉溪": [102.52, 24.35],
                    "张家口": [114.87, 40.82],
                    "阳泉": [113.57, 37.85],
                    "莱州": [119.942327, 37.177017],
                    "湖州": [120.1, 30.86],
                    "汕头": [116.69, 23.39],
                    "昆山": [120.95, 31.39],
                    "宁波": [121.56, 29.86],
                    "湛江": [110.359377, 21.270708],
                    "揭阳": [116.35, 23.55],
                    "荣成": [122.41, 37.16],
                    "连云港": [119.16, 34.59],
                    "葫芦岛": [120.836932, 40.711052],
                    "常熟": [120.74, 31.64],
                    "东莞": [113.75, 23.04],
                    "河源": [114.68, 23.73],
                    "淮安": [119.15, 33.5],
                    "泰州": [119.9, 32.49],
                    "南宁": [108.33, 22.84],
                    "营口": [122.18, 40.65],
                    "惠州": [114.4, 23.09],
                    "江阴": [120.26, 31.91],
                    "蓬莱": [120.75, 37.8],
                    "韶关": [113.62, 24.84],
                    "嘉峪关": [98.289152, 39.77313],
                    "广州": [113.23, 23.16],
                    "延安": [109.47, 36.6],
                    "太原": [112.53, 37.87],
                    "清远": [113.01, 23.7],
                    "中山": [113.38, 22.52],
                    "昆明": [102.73, 25.04],
                    "寿光": [118.73, 36.86],
                    "盘锦": [122.070714, 41.119997],
                    "长治": [113.08, 36.18],
                    "深圳": [114.07, 22.62],
                    "珠海": [113.52, 22.3],
                    "宿迁": [118.3, 33.96],
                    "咸阳": [108.72, 34.36],
                    "铜川": [109.11, 35.09],
                    "平度": [119.97, 36.77],
                    "佛山": [113.11, 23.05],
                    "海口": [110.35, 20.02],
                    "江门": [113.06, 22.61],
                    "章丘": [117.53, 36.72],
                    "肇庆": [112.44, 23.05],
                    "大连": [121.62, 38.92],
                    "临汾": [111.5, 36.08],
                    "吴江": [120.63, 31.16],
                    "石嘴山": [106.39, 39.04],
                    "沈阳": [123.38, 41.8],
                    "苏州": [120.62, 31.32],
                    "茂名": [110.88, 21.68],
                    "嘉兴": [120.76, 30.77],
                    "长春": [125.35, 43.88],
                    "胶州": [120.03336, 36.264622],
                    "银川": [106.27, 38.47],
                    "张家港": [120.555821, 31.875428],
                    "三门峡": [111.19, 34.76],
                    "锦州": [121.15, 41.13],
                    "南昌": [115.89, 28.68],
                    "柳州": [109.4, 24.33],
                    "三亚": [109.511909, 18.252847],
                    "自贡": [104.778442, 29.33903],
                    "吉林": [126.57, 43.87],
                    "阳江": [111.95, 21.85],
                    "泸州": [105.39, 28.91],
                    "西宁": [101.74, 36.56],
                    "宜宾": [104.56, 29.77],
                    "呼和浩特": [111.65, 40.82],
                    "成都": [104.06, 30.67],
                    "大同": [113.3, 40.12],
                    "镇江": [119.44, 32.2],
                    "桂林": [110.28, 25.29],
                    "张家界": [110.479191, 29.117096],
                    "宜兴": [119.82, 31.36],
                    "北海": [109.12, 21.49],
                    "西安": [108.95, 34.27],
                    "金坛": [119.56, 31.74],
                    "东营": [118.49, 37.46],
                    "牡丹江": [129.58, 44.6],
                    "遵义": [106.9, 27.7],
                    "绍兴": [120.58, 30.01],
                    "扬州": [119.42, 32.39],
                    "常州": [119.95, 31.79],
                    "潍坊": [119.1, 36.62],
                    "重庆": [106.54, 29.59],
                    "台州": [121.420757, 28.656386],
                    "南京": [118.78, 32.04],
                    "滨州": [118.03, 37.36],
                    "贵阳": [106.71, 26.57],
                    "无锡": [120.29, 31.59],
                    "本溪": [123.73, 41.3],
                    "克拉玛依": [84.77, 45.59],
                    "渭南": [109.5, 34.52],
                    "马鞍山": [118.48, 31.56],
                    "宝鸡": [107.15, 34.38],
                    "焦作": [113.21, 35.24],
                    "句容": [119.16, 31.95],
                    "北京": [116.46, 39.92],
                    "徐州": [117.2, 34.26],
                    "衡水": [115.72, 37.72],
                    "包头": [110, 40.58],
                    "绵阳": [104.73, 31.48],
                    "乌鲁木齐": [87.68, 43.77],
                    "枣庄": [117.57, 34.86],
                    "杭州": [120.19, 30.26],
                    "淄博": [118.05, 36.78],
                    "鞍山": [122.85, 41.12],
                    "溧阳": [119.48, 31.43],
                    "库尔勒": [86.06, 41.68],
                    "安阳": [114.35, 36.1],
                    "开封": [114.35, 34.79],
                    "济南": [117, 36.65],
                    "德阳": [104.37, 31.13],
                    "温州": [120.65, 28.01],
                    "九江": [115.97, 29.71],
                    "邯郸": [114.47, 36.6],
                    "临安": [119.72, 30.23],
                    "兰州": [103.73, 36.03],
                    "沧州": [116.83, 38.33],
                    "临沂": [118.35, 35.05],
                    "南充": [106.110698, 30.837793],
                    "天津": [117.2, 39.13],
                    "富阳": [119.95, 30.07],
                    "泰安": [117.13, 36.18],
                    "诸暨": [120.23, 29.71],
                    "郑州": [113.65, 34.76],
                    "哈尔滨": [126.63, 45.75],
                    "聊城": [115.97, 36.45],
                    "芜湖": [118.38, 31.33],
                    "唐山": [118.02, 39.63],
                    "平顶山": [113.29, 33.75],
                    "邢台": [114.48, 37.05],
                    "德州": [116.29, 37.45],
                    "济宁": [116.59, 35.38],
                    "荆州": [112.239741, 30.335165],
                    "宜昌": [111.3, 30.7],
                    "义乌": [120.06, 29.32],
                    "丽水": [119.92, 28.45],
                    "洛阳": [112.44, 34.7],
                    "秦皇岛": [119.57, 39.95],
                    "株洲": [113.16, 27.83],
                    "石家庄": [114.48, 38.03],
                    "莱芜": [117.67, 36.19],
                    "常德": [111.69, 29.05],
                    "保定": [115.48, 38.85],
                    "湘潭": [112.91, 27.87],
                    "金华": [119.64, 29.12],
                    "岳阳": [113.09, 29.37],
                    "长沙": [113, 28.21],
                    "衢州": [118.88, 28.97],
                    "廊坊": [116.7, 39.53],
                    "菏泽": [115.480656, 35.23375],
                    "合肥": [117.27, 31.86],
                    "武汉": [114.31, 30.52],
                    "大庆": [125.03, 46.58],
                    "林芝地": [94.25, 29.59],
                    "果洛藏族自治": [97.42, 34.81],
                    "闵行": [121.23, 31.07],
                    "那曲地": [92.1, 31.47]
                }
                this._getMyChart()
                // this.$axios.get('/static/data/cityData.json').then((res) => {
                //     this.geoCoordMap = res.data
                //     this.$nextTick(() => {
                //         this._getMyChart()
                //     })
                // })
            },
            convertData(data) {
                let res = [];
                for (let i = 0; i < 10; i++) {
                    // let l = data.length
                    // let x = parseInt(Math.random() * l)
                    let geoCoord = this.geoCoordMap[data[i].name]
                    // let geoCoord = this.geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            // name: data[x].name,
                            // value: geoCoord.concat(Math.random() * 200)
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                // let res = [];
                // data.forEach(item=>{
                //     res.push({
                //         name: item.name,
                //         // name: data[x].name,
                //         value: item.value
                //         // value: geoCoord.concat(data[i].value)
                //     });
                // })


                console.log('查看输出的数据',res)
                return res;
            },
            _getMyChart() {
                let res = {
                    data:[{
                        "name": "海门",
                        "value": 9
                    }, {
                        "name": "鄂尔多斯",
                        "value": 12
                    }, {
                        "name": "南京",
                        "value": 67
                    }, {
                        "name": "南充",
                        "value": 200
                    }, {
                        "name": "天津",
                        "value": 105
                    }, {
                        "name": "富阳",
                        "value": 106
                    }, {
                        "name": "泰安",
                        "value": 112
                    }, {
                        "name": "诸暨",
                        "value": 112
                    }, {
                        "name": "郑州",
                        "value": 113
                    }, {
                        "name": "哈尔滨",
                        "value": 200
                    }, {
                        "name": "上海",
                        "value": 25
                    }]
                }
                console.log(res)
                    let options = {
                        // backgroundColor: '#404a59',

                        title: {
                            text: '地铁城市舆情数据',
                            textStyle: {
                                color: '#9BADF9',
                                fontSize: 16,
                            },
                            left:300,
                            top:20
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: function(params) {
                                return params.name + ' : ' + params.value[2];
                            }
                        },
                        legend: {
                            show: false
                        },
                        visualMap: {
                            min: 0,
                            max: 200,
                            bottom: 50,
                            left:40,
                            splitNumber: 5,
                            inRange: {
                                color: ['#255B78', '#2A7484', '#2F9696', '#3BBCB0', '#51D4EB']
                            },
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        geo: {
                            map: 'china',
                            label: {
                                emphasis: {
                                    show: false
                                }
                            },
                            zoom: 1,
                            top: 50,
                            left:140,
                            itemStyle: {
                                normal: {
                                    color: '#3c4247',
                                    opacity: 0.6,
                                    borderColor: 'rgba(255, 255, 255, 0.35)'
                                },
                                emphasis: {
                                    color: '#2a333d'
                                }
                            }
                        },
                        series: [{
                            name: '标签1',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            symbolSize: function(val) {
                                return val[2]/ 6 + 4;
                            },
                            label: {
                                show: false
                            },
                            itemStyle: {
                                emphasis: {
                                    borderColor: '#fff',
                                    borderWidth: 1
                                }
                            },
                            data: this.convertData(res.data)
                        }]
                    }
                    this.mapinit(options)
            },
            // 获取地图
            getMapDate(){



                // 使用刚指定的配置项和数据显示图表。
                this.$axios.post(GET_WEIBO_INFO,{
                    "size": 0,
                    "query": {
                        "script": {
                            "script": {
                                "params": {
                                    "now_times": this.postTime
                                },
                                "source": "def sf = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt = sf.parse(doc['create_date.keyword'].value);def calendar = sf.getCalendar();calendar.setTime(dt);def instant = calendar.toInstant();def localDateTime = LocalDateTime.ofInstant(instant, ZoneOffset.UTC); localDateTime = localDateTime .plusHours(24*30);def sf_now = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt_now = sf_now.parse(params.now_times);def calendar_now = sf_now.getCalendar();calendar_now.setTime(dt_now);def instant_now = calendar_now.toInstant();def localDateTime_now = LocalDateTime.ofInstant(instant_now, ZoneOffset.UTC); return localDateTime_now.compareTo(localDateTime)<=0;"
                            }
                        }
                    },
                    "aggs": {
                        "_result": {
                            "terms": {
                                "field": "province.keyword",
                                "size": 100
                            }
                        }
                    }
                }).then(res=>{
                    console.log(res)
                })
            },
            // 获取微博信息
            getFenxi(){
                const container = document.getElementById('analyse')
                const myChart = new Charts(container)
                this.$axios.post(POST_WEIBO_TOTAL, {
                        "_source": ["wbdate", "wbtotal"],
                        "query": {
                            "script": {
                                "script": {
                                    "params": {
                                        "now_times": this.postTime
                                    },
                                    "source": "def localDateTime= doc['wbdate'].value.toLocalDateTime(); localDateTime = localDateTime .plusHours(24*7);def sf_now = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt_now = sf_now.parse(params.now_times);def calendar_now = sf_now.getCalendar();calendar_now.setTime(dt_now);def instant_now = calendar_now.toInstant();def localDateTime_now = LocalDateTime.ofInstant(instant_now, ZoneOffset.UTC); return localDateTime_now.compareTo(localDateTime)<=0;"
                                }
                            }
                        }
                    }

                ).then(res=>{
                    let arr = res.data.hits.hits
                    let output =[]
                    let keyArr = []
                    let valueArr = []
                    arr.forEach(item=>{
                        output.push({
                            key:item._source.wbdate,
                            value:item._source.wbtotal
                        })
                    })

                    output = this._.sortBy(output, function(item) {
                        return new Date(item.key);
                    });

                    output.forEach(item=>{
                        keyArr.push(item.key)
                        valueArr.push(item.value)

                    })
                    const option1 = {
                        color:['#ffffff'],
                        title: {
                            text: '近7天舆情数据分布趋势',
                            style: {
                                fill: '#9BADF9',
                                fontSize: 16,
                                textAlign: 'center',
                                textBaseline: 'bottom'
                            }
                        },
                        xAxis: {
                            name: '日期',
                            data: keyArr,
                            nameTextStyle:{
                                fill: '#9BADF9',
                                fontSize: 16
                            },
                            axisLabel: {
                                style: {
                                    fill:'#9BADF9',
                                    fontSize: 16
                                }
                            },
                            axisLine:{
                                style:{
                                    stroke: '#979797',
                                    lineWidth: 1
                                }
                            },
                        },
                        yAxis: {
                            name: '(数量)',
                            data: 'value',
                            nameTextStyle:{
                                fill: '#9BADF9',
                                fontSize: 16
                            },
                            splitLine:{
                                style:{
                                    stroke: 'rgba(151, 151, 151, 1)',
                                    lineWidth: 1,
                                    lineDash: [8, 4]
                                }
                            },
                            axisLine:{
                                style:{
                                    stroke: '#979797',
                                    lineWidth: 1
                                }
                            },
                            axisLabel: {
                                style: {
                                    fill:'#9BADF9',
                                    fontSize: 16
                                }
                            }
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
                                        fontSize: 14
                                    }
                                },
                                gradient: {
                                    color: ['#22BFFF', '#3F28CE']
                                },
                                barWidth:'30%'
                            }
                        ]
                    }
                    myChart.setOption(option1)
                })


            },
            // 获取客服数量统计
            // 获取词云
            getWordCloud(){
                this.$axios.post(POST_WEIBO_HOTWORD,{
                    "size": 0,
                    "query": {
                        "script": {
                            "script": {
                                "params": {
                                    "now_times": this.postTime
                                },
                                "source": "def localDateTime= doc['hdate'].value.toLocalDateTime(); localDateTime = localDateTime .plusHours(24*30);def sf_now = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt_now = sf_now.parse(params.now_times);def calendar_now = sf_now.getCalendar();calendar_now.setTime(dt_now);def instant_now = calendar_now.toInstant();def localDateTime_now = LocalDateTime.ofInstant(instant_now, ZoneOffset.UTC); return localDateTime_now.compareTo(localDateTime)<=0;"
                            }
                        }
                    },
                    "aggs": {
                        "_result": {
                            "terms": {
                                "field": "hword.keyword",
                                    "size": 100
                            },
                            "aggs": {
                                "employed_origin": {
                                    "sum": {
                                        "script": {
                                            "lang": "painless",
                                                "source": "def lhtotal = Long.parseLong(doc['htotal.keyword'].value) ;  return lhtotal; "
                                        }
                                    }
                                }
                            }
                        }
                    }
                }).then((res)=>{
                    this.wordCloudShow = true
                    let arr = res.data.aggregations._result.buckets
                    arr.forEach((item)=>{
                        this.wordCloudList.push([item.key,item.employed_origin.value])
                    })
                    // 渲染词云
                    var wc = new Js2WordCloud(document.getElementById('friendsWordCloud')); //容器
                    wc.setOption({
                        tooltip: {
                            show: false, // 默认：false
                            backgroundColor: 'rgba(0, 0, 0, 0.701961)',
                            formatter: function(item) {
                                if (item[1] > 12) {
                                    document.querySelector('.__wc_tooltip__').style.backgroundColor = 'rgba(0, 0, 0, 0.701961)';
                                    return item[0] + '：' + item[2];
                                } else {
                                    document.querySelector('.__wc_tooltip__').style.backgroundColor = 'transparent';
                                    return '';
                                }
                            }
                        },
                        list: this.wordCloudList, // 词云数据源2
                        gridSize: 11,
                        fontSizeFactor: 0.2,
                        maxFontSize: 32, //最大字号
                        minFontSize: 17, //最小字号
                        rotationSteps: 30,
                        rotateRatio: 0, // 旋转概率
                        ellipticity: 4,
                        wait: 10,
                        abortThreshold: 2000,
                        color(word, weight) { //自定义颜色
                            if (weight < 50) {
                                return '#A6A4A4';
                            }else if(weight < 100){
                                return '#32C5FF'
                            } else {
                                return '#0091FF'
                            }
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0)',
                    });
                })
            },
            changeInfo(num){
                this.currentTab = num
                this.getInfo()
            },
            get24Info(){
                this.$axios.post(GET_WEIBO_INFO,{
                        "size": 0,
                        "query": {
                            "script": {
                                "script": {
                                    "params": {
                                        "now_times": this.postTime
                                    },
                                    "source": "def sf = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt = sf.parse(doc['create_date.keyword'].value);def calendar = sf.getCalendar();calendar.setTime(dt);def instant = calendar.toInstant();def localDateTime = LocalDateTime.ofInstant(instant, ZoneOffset.UTC); localDateTime = localDateTime .plusHours(24);def sf_now = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt_now = sf_now.parse(params.now_times);def calendar_now = sf_now.getCalendar();calendar_now.setTime(dt_now);def instant_now = calendar_now.toInstant();def localDateTime_now = LocalDateTime.ofInstant(instant_now, ZoneOffset.UTC); return localDateTime_now.compareTo(localDateTime)<=0;"
                                }
                            }
                        },
                        "aggs": {
                            "group_by_tags": {
                                "terms": {
                                    "size": 10000,
                                    "script": {
                                        "inline": "String s = doc['create_date.keyword'].value;String x= s.substring(0,13);return x+'####'+doc['emotion.keyword'].values"
                                    }
                                }
                            }
                        }
                    }

                )
                    .then((response)=> {
                        let arr = response.data.aggregations.group_by_tags.buckets
                        let frontArr = new Array(20).fill(1) // 正面数据
                        let negativeArr = new Array(20).fill(1) // 负面数据

                        arr.forEach((item)=>{
                            // 筛选满足条件的数据
                            let str1 = item.key.split(' ')[0]

                            let str2 = item.key.split(' ')[1]
                            let time = parseInt(str2.slice(0,2))
                            let type = parseInt(str2.slice(-2))
                            if(str1==='2020-10-25'){
                                console.log(time,type)
                                if(type){
                                    frontArr[time] = item.doc_count*4
                                }else{
                                    negativeArr[time] = item.doc_count*4
                                }
                            }
                        })
                        console.log(frontArr,negativeArr)
                        console.log('24小时 舆情统计',)
                        const container2 = document.getElementById('unmanned2')
                        const myChart2 = new Charts(container2)
                        const option2= {
                            title: {
                                text: '近24小时舆情数量统计',
                                style: {
                                    fill: '#9BADF9',
                                    fontSize: 16,
                                    textAlign: 'center',
                                    textBaseline: 'bottom'
                                }
                            },
                            legend: {
                                data: [
                                    {
                                        name:'正面舆情数量',
                                        color: '#aeeff0',
                                    }, {
                                        name:'负面舆情数量',
                                        color: '#f1829f',
                                    }
                                ],
                                textStyle: {
                                    fontFamily: 'Arial',
                                    fontSize: 13,
                                    fill: '#9BADF9'
                                }
                            },
                            xAxis: {
                                name: '(小时)',
                                data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
                                nameTextStyle:{
                                    fill: '#9BADF9',
                                    fontSize: 16
                                },
                                axisLine:{
                                    style:{
                                        stroke: '#979797',
                                        lineWidth: 1
                                    }
                                },
                                axisLabel: {
                                    style: {
                                        fill:'#9BADF9',
                                        fontSize: 14
                                    }
                                },

                                axisTick:{
                                    style:{
                                        stroke: '#979797',
                                        lineWidth: 1
                                    }
                                }
                            },
                            yAxis: {
                                name: '(个)',
                                data: 'value',
                                nameTextStyle:{
                                    fill: '#9BADF9',
                                    fontSize: 14
                                },
                                splitLine:{
                                    style:{
                                        stroke: 'rgba(151, 151, 151, 1)',
                                        lineWidth: 1,
                                        lineDash: [8, 4]
                                    }
                                },
                                axisLine:{
                                    style:{
                                        stroke: '#979797',
                                        lineWidth: 1
                                    }
                                },
                                axisTick:{
                                    style:{
                                        stroke: '#979797',
                                        lineWidth: 1
                                    }
                                },
                                axisLabel: {
                                    style: {
                                        fill:'#9BADF9',
                                        fontSize: 14,
                                    }
                                }
                            },
                            series: [
                                {
                                    data: frontArr,
                                    name: '正面舆情数量',
                                    type: 'line',
                                    smooth: true,
                                    lineArea: {
                                        show: true,
                                        gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)'],

                                    },
                                    lineStyle: {
                                        // lineDash: [3, 3],
                                        lineWidth: 2
                                    },
                                },
                                {
                                    data: negativeArr,
                                    name: '负面舆情数量',
                                    type: 'line',
                                    smooth: true,
                                    lineArea: {
                                        show: true,
                                        gradient: ['rgba(223, 24, 127, .6)', 'rgba(223, 24, 127, .1)']
                                    },
                                    lineStyle: {
                                        stroke: 'rgba(251, 114, 147, 1)',
                                        // lineDash: [3, 3],
                                        lineWidth: 2
                                    },
                                    linePoint: {
                                        style: {
                                            stroke: 'rgba(251, 114, 147, 1)'
                                        }
                                    }
                                }
                            ]
                        }
                        myChart2.setOption(option2)


                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
            },

            getInfo(){
                this.$axios.post(GET_WEIBO_INFO,{
                        "query": {
                            "bool": {
                                "must": [
                                    {
                                        "term": {
                                            "weibo_type.keyword": this.keywordList[this.currentTab-1]
                                        }
                                    }
                                ]
                            }
                        },
                        "sort": [
                            {
                                "_script": {
                                    "script": {
                                        "inline": "String s = doc['create_date.keyword'].value;String x= s.substring(0,10);return x"
                                    },
                                    "type": "string",
                                    "order": "desc"
                                }
                            },
                            {
                                "weight": {
                                    "order": "desc"
                                }
                            }
                        ]
                    }
                )
                    .then((response)=> {
                        this.publicList = []
                        response.data.hits.hits.slice(0,5).forEach((item)=>{
                            this.publicList.push({
                                text: item._source.text.slice(0,18) + '...',
                                status: item._source.weight>20?1:2,
                                time: item._source.create_date,
                                source: item._source.source
                            })
                        })
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../node_modules/swiper/swiper";
    .analyse-box{
        width: 100%;
        height: 350px;
    }
    .map-box{
        width: 100%;
        height: 190px;
    }
    #analyse{
        width: 100% !important;
        height: 100% !important;
        display: block;
        overflow: hidden;
    }
    .swiper-slide{
        width: 780px;
    }

    .public-container{
        padding-top: 80px;
        ul{
            list-style: none;
            text-align: left;
            padding: 0;
            margin: 0;
        }
        .public-content{
            padding: 40px 30px 0 50px;
            color:rgba(255, 255, 255, 0.85);
            font-size: 12px;
            p{
                margin: 16px 0;
            }
            .public-title{
                font-size: 14px;
            }
            li{
                height: 80px;
                position: relative;
            }
            li:after{
                content: '';
                display: block;
                width: 380px;
                height: 4px;
                background: url("../assets/line.png") no-repeat;
                background-size: 380px;
                position: absolute;
                left: -50px;
                bottom: 4px;
            }
            .source{
                float: right;
                color: #ccc;
            }
            .public-status{
                width: 8px ;
                height: 8px;
                border-radius: 50%;
                display: inline-block;
                position: absolute;
                left: -24px;
                top: 2px;
            }
            .s-1{
                background: #DF2021;
                border: 4px solid #711010;
            }
            .s-2{
                background: #EA9100;
                border: 4px solid #7D4E00;
            }
            .s-3{
                background: #DFDF02;
                border: 4px solid #666601;
            }
        }
        .public-tab{
            height: 30px;
            position: absolute;
            left: -13px;
            li{
                width: 120px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                background: #093C7F;
                color: rgba(255, 255, 255, 0.85);
                transform: skewX(-45deg);
                float: left;
                margin-right: 6px;
                cursor: pointer;
                span{
                    display: inline-block;
                    transform: skewX(45deg);
                }
            }
            li:first-child{
                width: 130px;
            }
            .active{
                background: #32C5FF;
                color: #0A1A44;
            }
        }
    }


    .public-left{
        width: 382px;
        float: left;
        background: linear-gradient(#102563,#102563);
        height: 540px;
        margin-left: 60px;
        overflow: hidden;
        position: relative;
    }
    .public-right{
        width: 63%;
        float: left;
        box-sizing: border-box;
        padding: 0 20px;
        #unmanned2{
            width: 100%;
            height: 100%;
        }
        .friends-word-cloud{
            margin: 0px 0 20px;
            width: 100%;
            height: 130px;
        }
        p{
            color:#9BADF9;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
        }
    }

</style>
