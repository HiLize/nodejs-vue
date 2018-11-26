<template>
  <div>
    <div class="contrainer">
      <p class="tip">正确答案请看这里~</p>
      <div class="aqAll">
        <div class="cell" v-for="(el, index) in danxt" v-bind:key="index">
          <p class="q">{{(index+1)+'. '+el.title+'（单选）'}}</p>
          <p class="a">
            <span>参考答案：</span>
            <span>{{getAnswer(el)}}</span>
          </p>
        </div>
      </div>
      <p class="txt">本次得分{{score}}分！耗时{{timeFormat}}！</p>
      <div class="zlyc" @click="goLink('aqform')">再来一次</div>
    </div>
  </div>
</template>

<script>
  import { XHeader } from 'vux'
  import Vue from 'vue'
  import {wisFetch} from '../utils/utils'
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    components: {
      XHeader,
    },
    async created(){
    	this.danxt = this.questions.filter(el=>el.question_type_id==1)[0].datas;
      this.timeFilter(this.cost_time);
      let collegeId = null;
        if(this.userInfo && this.userInfo.collegeId){
          collegeId = this.userInfo.collegeId
        }
        let r = await wisFetch('getCountLimit', {
          collegeId: collegeId,
          student_id: this.userInfo.studentNo,
        });
        if (r.code != 1000) {
          this.$vux.toast.text(r.msg, 'middle');
          return;
        }
        this.limitCount = r.data.limitCount
        this.nowUserCount = r.data.nowUserCount
    },
    data(){
      return {
      	danxt: [],
        timeFormat: '',
        limitCount: 0,
        nowUserCount: 0,
        userInfo: window.userInfo
      }
    },
    computed: {
      ...mapState('question', ['questions', 'current_qa', 'score', 'cost_time'])
    },
    filters: {
    },
    methods: {
      timeFilter(secdons){
        if(secdons){
          if (secdons<60){
            let sec = (secdons>0)?secdons + '秒':'';
            this.timeFormat = this.timeFormat + sec;
            return;
          }
          else if(secdons<3600){
            let min = Math.floor(secdons/60);
            this.timeFormat = this.timeFormat + min + '分钟';
            this.timeFilter(secdons-min*60)
          }
          else{
            let hour = Math.floor(secdons/3600);
            this.timeFormat = this.timeFormat + hour + '小时';
            this.timeFilter(secdons-hour*3600)
          }
        }
      },
      getAnswer(q){
      	let {options} = q;
        let auuid = this.current_qa.filter(el=>el.key===q.uuid)[0];
        let answer = options.filter(el=>el.uuid===auuid.value);
        answer = answer[0];
      	return answer.name;
      },
      goLink(param){
        if (this.limitCount > 0 && this.nowUserCount >= this.limitCount) {
            this.$vux.toast.text('答题次数已达最大值', 'middle');
            this.$router.push({
              name: 'newrank',
            })
            return
        }
        this.$router.push({
          name: param,
        })
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .contrainer{
    position: relative;
    height: 100vh;
    & .tip{
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #999999;
    }
    & .aqAll{
      & .cell{
        margin: 0 15px 15px;
        padding: 15px;
        background-color: #fff;
        border-radius: 4px;
        & .q{
          font-size: 16px;
          color: #333333;
          margin-bottom: 15px;
        }
        & .a{
          font-size: 12px;
          color: #333333;
        }
      }
    }
    & .txt{
      margin: 15px;
      text-align: center;
      font-size: 14px;
      color: #999999;
    }
    & .zlyc{
      width: 168px;
      height: 48px;
      color: #fff;
      margin: 15px auto;
      background-image: linear-gradient(-180deg, #52B0FF 2%, #1F8DEA 100%);
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>