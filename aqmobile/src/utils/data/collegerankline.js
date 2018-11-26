/**
 * Created by Gaven on 2017/9/22.
 */
export default {
  title: {
    text: '院系得分排名',
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
    data:['总得分','参与人数','总用时']
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
      name: '总得分',
    },
    {
      type: 'value',
      name: '总用时',
      axisLabel: {
        formatter: '{value}s'
      }
    }
  ],
  series: [
    {
      name:'总得分',
      type:'bar',
      data:[],
      barMaxWidth: 8,
      barMinHeight: 2,
    },
    {
      name:'参与人数',
      type:'bar',
      data:[],
      barMaxWidth: 8,
      barMinHeight: 2,
    },
    {
      name:'总用时',
      type:'line',
      yAxisIndex: 1,
      data: [],
    }
  ]
}
