/**
 * Created by Gaven on 2017/9/22.
 */
export default {
  title: {
    text: '个人得分排名',
    subtext: '分数相同，用时短者排名靠前'
  },
  grid: {
    top: 80
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: ''
  },
  toolbox: {
    feature: {
      dataView: {show: true, readOnly: false},
      magicType: {show: true, type: ['line', 'bar']},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
  legend: {
    data:['得分','用时']
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow'
      },
      axisLabel: {
        rotate: 45,
        interval: 0,
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '得分',
    },
    {
      type: 'value',
      name: '用时',
      axisLabel: {
        formatter: '{value}s'
      }
    }
  ],
  series: [
    {
      name:'得分',
      type:'bar',
      data:[],
      barMaxWidth: 8,
      barMinHeight: 2,
    },
    {
      name:'用时',
      type:'line',
      yAxisIndex: 1,
      data: [],
      tooltip: {
        formatter: '{c0}s'
      }
    }
  ]
}
