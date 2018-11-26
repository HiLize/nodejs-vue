<template>
  <div>
    <div class="contrainer" style="background-image: url(./static/scorebg.png);">

      <div class="cell">
        <p class="ctitle">
          <span>{{score}}</span>
          <span>分</span>
        </p>
        <p class="bcdf">本次得分</p>
        <div class="scoreTimeC">
          <span>耗时：</span>
          <p v-html="timeFormat"></p>
        </div>

        <div class="zqda" @click="goLink('currentaq')" ><span>查看正确答案</span></div>
        <div class="zlyc" @click="startAns('aqform')" ><span>再来一次</span></div>
        <p class="phb" @click="goLink('newrank')">查看排行榜</p>
      </div>

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
        timeFormat: '',
        limitCount: 0,
        nowUserCount: 0,
        userInfo: window.userInfo
      }
    },
    computed: {
      ...mapState('question', ['score', 'cost_time'])
    },
    filters: {
    },
    methods: {
      timeFilter(secdons){
      	if(secdons){
          if (secdons<60){
            let sec = (secdons>0)?'<span>'+secdons + '</span>秒':'';
            this.timeFormat = this.timeFormat + sec;
            return;
          }
          else if(secdons<3600){
            let min = Math.floor(secdons/60);
            this.timeFormat = this.timeFormat + '<span>'+min + '</span>分钟';
            this.timeFilter(secdons-min*60)
          }
          else{
            let hour = Math.floor(secdons/3600);
            this.timeFormat = this.timeFormat + '<span>'+hour + '</span>小时';
            this.timeFilter(secdons-hour*3600)
          }
        }
      },
      goLink(param){
        this.$router.push({
          name: param,
        })
      },
      startAns(param){
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
      }
    },
  }
</script>

<style lang="less">
  .scoreTimeC{
    font-size: 14px;
    color: #fff;
    display: flex;
    align-items: baseline;
    & >p{
      & >span{
        font-size: 40px;
        margin: 0 2px;
      }
    }
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .contrainer{
    background-size: 100vw;
    position: relative;
    height: 100vh;
    display: flex;
    justify-content: center;
    & .cell{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      & .ctitle{
        color: #fdc96c;
        display: flex;
        align-items: baseline;
        & >span{
          &:first-child{
            font-size: 100px;
          }
          &:last-child{
            font-size: 14px;
          }
        }
      }
      & .bcdf{
        font-size: 14px;
        color: #fff;
        margin-bottom: 40px;
      }

      & .zqda{
        width: 168px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 18px;
        color: #FFFFFF;
        background-image: linear-gradient(-180deg, #FEE276 0%, #FCAE61 100%);
        border-radius: 8px;
        margin: 100px 0 10px;
        & >span{
          text-shadow: 0 2px 4px #FFA500;
        }
      }

      & .zlyc{
        width: 168px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 18px;
        color: #fdc96c;
        border: 1px solid #fdc96c;
        border-radius: 8px;
        margin: 0px 0 30px;
        & >span{
        }
      }



      & .phb{
        font-size: 14px;
        color: #FFFFFF;
      }
    }

  }
</style>
