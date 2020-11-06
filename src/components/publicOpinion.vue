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
            <!--统计图表-->
            <div id="unmanned2"></div>
            <!--词云-->
            <dv-loading v-show="!wordCloudShow" style="margin: 20px 0;">Loading...</dv-loading>
            <div id="friendsWordCloud" class="friends-word-cloud"></div>
            <p>与地铁相关词云</p>
        </div>
    </div>
</template>

<script>
    import dayjs from 'dayjs'
    import Js2WordCloud from 'js2wordcloud'
    import Charts from '@jiaminghi/charts'
    import {GET_WEIBO_INFO, POST_WEIBO_HOTWORD} from "../config/url";
    export default {
        name: "publicOpinion",
        data(){
            return{
                currentTab:1,
                publicList:[],
                keywordList:['突发事件','乘客之声','运营服务'],
                wordCloudList:[],
                wordCloudShow:false
            }
        },
        mounted() {
            this.getInfo()
            this.get24Info()
            this.getWordCloud()

            console.log('Js2WordCloud',Js2WordCloud)

        },
        methods:{
            // 获取微博信息
            // 获取客服数量统计
            // 获取词云
            getWordCloud(){
                this.$axios.post(POST_WEIBO_HOTWORD,{
                    "size": 0,
                    "query": {
                        "script": {
                            "script": {
                                "params": {
                                    "now_times": dayjs().format('YYYY-MM-DD HH:mm')
                                },
                                "source": "def localDateTime= doc['hdate'].value.toLocalDateTime(); localDateTime = localDateTime .plusHours(24*7);def sf_now = new SimpleDateFormat(\"yyyy-MM-dd' 'HH:mm\");def dt_now = sf_now.parse(params.now_times);def calendar_now = sf_now.getCalendar();calendar_now.setTime(dt_now);def instant_now = calendar_now.toInstant();def localDateTime_now = LocalDateTime.ofInstant(instant_now, ZoneOffset.UTC); return localDateTime_now.compareTo(localDateTime)<=0;"
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
                                        "now_times": "2020-10-25 12:12"
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
                                text: item._source.topics,
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
            height: 350px;
        }
        .friends-word-cloud{
            margin: 20px 0;
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
