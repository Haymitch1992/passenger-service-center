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
                    <p class="number">8</p>
                </li>
                <li class="current-item">
                    <p>自动回复数量</p>
                    <p class="number">5</p>
                </li>
                <li class="current-item">
                    <p>人工回复数量</p>
                    <p class="number">3</p>
                </li>
                <li style="float:left;width: 170px;">
                    <p>当日接入总数量</p>
                    <p class="number">60</p>
                </li>
            </ul>
            <ul class="efficiency">
                <li>
                    <p>自动回复解决成功率</p>
                    <span class="unit">（天)</span>
                    <span class="number">60%</span>
                </li>
                <li>
                    <p>自动回复解决成功率</p>
                    <span class="unit">（天)</span>
                    <span class="number">60%</span>
                </li>
                <li>
                    <p>自动回复解决成功率</p>
                    <span class="unit">（天)</span>
                    <span class="number">60%</span>
                </li>

            </ul>
        </div>
        <div class="unmanned-right">
            <p class="unmanned-title">热门问题Top10</p>
            <div>
                <div class="progress-out" :key="index" v-for="(item,index) in hotIssue">
                    <p class="progress-text">{{item.text}}</p>
                    <div class="progress-inner" :style="{width:item.value/hotIssue[0].value*100+'%'}"></div>
                    <span class="number">{{item.value}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Charts from '@jiaminghi/charts'
    export default {
        name: "passenger",
        data(){
          return{
              hotIssue:[
                  {
                      text: '地铁站有霾口罩的地方吗？',
                      value: 24
                  },
                  {
                      text: '地铁站有误障碍通道吗，残疾人如何获得帮助？',
                      value: 20
                  },
                  {
                      text: '导盲犬可以上地铁吗？',
                      value: 18
                  },
                  {
                      text: '有乘客在车上大声播放音乐',
                      value: 16
                  },
                  {
                      text: '地铁带的行李有无限制，最大可以带多大？',
                      value: 15
                  },
                  {
                      text: '乘坐北京地铁可以使用什么软件刷二维码出站？',
                      value: 12
                  },
                  {
                      text: '请问有没有温度高点的车厢？',
                      value: 10
                  },
                  {
                      text: '地铁冬奥直线什么时间能够开通？',
                      value: 9
                  },
                  {
                      text: '冬奥会期间地铁回延长运营时间吗？',
                      value: 7
                  },
                  {
                      text: '6号线呼家楼站最后一班车是几点？',
                      value: 5
                  },
              ],
          }
        },
        mounted() {
            const container2 = document.getElementById('unmanned')
            const myChart2 = new Charts(container2)
            const option2= {
                title: {
                    text: '近24小时接入客服数量统计',
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
                            name:'自动回复数量',
                            color: '#aeeff0',
                        }, {
                            name:'人工回复数量',
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
                    data: [0,2,4,6,8,10,12,14,16,18,20,22,24],
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
                        data: [40,21,41,61,81,40,122,114,126,148,120,52,74],
                        name: '自动回复数量',
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
                        data: [61,81,50,122,114,126,148,120,52,74,30,21,41],
                        name: '人工回复数量',
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
        }
    }
</script>

<style scoped lang="scss">
    .border-box-content{
        display: flex;
        padding: 80px 30px 0;
        #unmanned{
            width: 100%;
            height: 400px;
        }
        .unmanned-left{
            width: 60%;
            .efficiency{
                display: flex;
                list-style: none;
                padding: 0 0 0 40px;
                margin: 0;

                li{
                    width: 100%;
                    p{
                        color: #9BADF9;
                        font-size: 16px;
                    }
                    p:first-child{
                        text-align: left;
                        margin-bottom: 8px;
                    }
                    .unit{
                        color: #9BADF9;
                        float: left;
                        padding-left: 0px;
                    }
                    .number{
                        color: #32C5FF;
                        font-size: 26px;
                        float: left;
                        padding-left: 20px;
                    }
                }
            }
            .current-status{
                list-style: none;
                color: #9BADF9;
                font-size: 16px;
                height: 60px;
                padding-left: 25px;
                li{
                    padding: 4px 0;
                }
                p{
                    padding: 4px 0 0 0;
                    margin: 0;
                }
                .current-item{
                    background: #102563;
                    width: 20%;
                    float: left;
                }

                .current-title{
                    width: 50px;
                    color: #32C5FF;
                    font-size: 14px;
                    box-sizing: border-box;
                    padding: 14px 0 13px 10px;
                    p{
                        padding: 0;
                        font-weight: bold;
                    }
                }
                .number{
                    color: #32C5FF;
                    font-size: 24px;
                }
            }

        }
        .unmanned-right{
            width: 40%;
            text-align: left;
            p{
                margin: 0;
                padding: 0;
            }
            .unmanned-title{
                font-size: 28px;
                margin-bottom: 30px;
            }
            .progress-out{
                width: 80%;
                height: 30px;
                border-radius: 20px;
                background: #102563;
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
                margin-bottom: 22px;
                .number{
                    position: absolute;
                    right: 10px;
                    line-height: 30px;
                    top: 0;
                    z-index: 2;
                }
                .progress-text{
                    padding: 0 10px;
                    color: #ffffff;
                    position: relative;
                    z-index: 2;
                    font-size: 14px;
                    line-height: 30px;
                }
            }
            .progress-inner{
                width: 0%;
                height: 28px;
                background: linear-gradient(to right ,#2760E4, #32C5FF);
                z-index: 1;
                position: absolute;
                left: 0;
                top: 0;
                border-radius: 20px;
            }
        }
    }
</style>
