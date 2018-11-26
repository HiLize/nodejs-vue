<template>
  <div class="contrainer" style="background-image: url(./static/scorebg.png);">
    <div class="main">
      <div class="tabC">
        <p @click="rank(1)" :class="rankIndex==1?'active':''">个人排名</p>
        <p @click="rank(2)" :class="rankIndex==2?'active':''">学院排名</p>
      </div>
      <div class="contentC">
        <div class="jiangbeiC" style="background-image: url(./static/rankimg1.png); background-repeat: no-repeat; background-size: 100%; background-position: 0 0;">
          <div class="topCell">
            <p>TOP2</p>
            <div class="avatar">
              <img v-if="topData[1].img" :src="topData[1].img">
              <span v-if="!topData[1].img">{{topData[1].name ? topData[1].name.substring(0,1) : ''}}</span>
            </div>
            <div class="topDetail">
              <p class="name">{{topData[1].name}}</p>
              <p class="score">{{topData[1].score}}</p>
              <p class="costTime">{{topData[1].costTime}}</p>
            </div>
          </div>
          <div class="topCell top1">
            <p>TOP1</p>
            <div class="avatar">
              <img v-if="topData[0].img" :src="topData[0].img">
              <span v-if="!topData[0].img">{{topData[0].name ? topData[0].name.substring(0,1) : ''}}</span>
            </div>
            <div class="topDetail">
              <p class="name">{{topData[0].name}}</p>
              <p class="score">{{topData[0].score}}</p>
              <p class="costTime">{{topData[0].costTime}}</p>
            </div>
          </div>
          <div class="topCell">
            <p>TOP3</p>
            <div class="avatar">
              <img v-if="topData[2].img" :src="topData[2].img">
              <span v-if="!topData[2].img">{{topData[2].name ? topData[2].name.substring(0,1) : ''}}</span>
            </div>
            <div class="topDetail">
              <p class="name">{{topData[2].name}}</p>
              <p class="score">{{topData[2].score}}</p>
              <p class="costTime">{{topData[2].costTime}}</p>
            </div>
          </div>

        </div>
        <div class="otherC">
          <p v-for="el in otherData">
            <span>{{el.rowNo}}.</span>
            <span>{{el.name}}</span>
            <span>{{el.score}}</span>
            <span>{{el.costTime}}</span>
          </p>
        </div>

        <p v-show="rankIndex==1" class="zhcjTip">我的最好成绩</p>
        <div v-show="rankIndex==1" class="myRank">
          <p>
            <span v-if="myRankData.rowNo">{{myRankData.rowNo}}.</span>
            <span>{{myRankData.name}}</span>
            <span>{{myRankData.score}}</span>
            <span v-if="myRankData.cost_time">{{formatTime(myRankData.cost_time)}}</span>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { XHeader } from 'vux'
  import Vue from 'vue'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { wisFetch, formatTime } from '../utils/utils'

  export default {
    components: {
      XHeader,
    },
    async created(){

      let [r1, r2] = await Promise.all([
        wisFetch('v_user_rank_query', {limit: 30}),
        wisFetch('v_college_rank_query', {limit: 30}),
      ]);
      if(r1.code == 1000){
      	r1.data = r1.data?r1.data.map((el, index)=>{ return {rowNo: ((index+1)+'').replace(/\b(\d)\b/g, "0$1"), ...el} }):[];
        this.userTop3Data = r1.data.slice(0, 3);
        this.userOtherData = r1.data.slice(3);
        console.log(this.userTop3Data)
      }else{
        this.$vux.toast.text(r1.msg, 'middle');
      }

      if(r2.code == 1000){
        r2.data = r2.data?r2.data.map((el, index)=>{ return {rowNo: ((index+1)+'').replace(/\b(\d)\b/g, "0$1"), ...el} }):[];
        this.collegeTop3Data = r2.data.slice(0, 3);
        this.collegeOtherData = r2.data.slice(3);
      }else{
        this.$vux.toast.text(r2.msg, 'middle');
      }

      let r3 = await wisFetch('getMyRank', {
        student_id: this.userInfo.studentNo,
      });
      if(r3.code == 1000){
        this.myRankData = r3.data?r3.data:{};
        this.myRankData.rowNo = (this.myRankData.rowNo+'').replace(/\b(\d)\b/g, "0$1");
      }else{
        this.$vux.toast.text(r3.msg, 'middle');
      }

    },
    data(){
      return {
        rankIndex: 1,
        userTop3Data: [],
        userOtherData: [],

        collegeTop3Data: [],
        collegeOtherData: [],

        userInfo: window.userInfo,
        myRankData: {},
      }
    },
    computed: {
      topData(){
      	return [0, 1, 2].map(el=>{
          if(this.rankIndex == 1){
            if(this.userTop3Data&&this.userTop3Data[el]) {
              return {
                name: this.userTop3Data[el].name,
                score: this.userTop3Data[el].score,
                img: this.userTop3Data[el].img,
                costTime: formatTime(this.userTop3Data[el].cost_time),
              }
            }else{
              return { name: '', score: '', costTime: '' }
            }
          }else{
            if(this.collegeTop3Data&&this.collegeTop3Data[el]){
              return {
                name: this.collegeTop3Data[el].college,
                score: this.collegeTop3Data[el].scores,
                costTime: formatTime(this.collegeTop3Data[el].cost_times),
              }
            }else{
              return { name: '', score: '', costTime: '' }
            }
          }
        });
      },

      otherData(){
        if(this.rankIndex == 1){
        	if(this.userOtherData){
        		return this.userOtherData.map(el=>{
        			return {
                rowNo: el.rowNo,
                name: el.name,
                score: el.score,
                costTime: formatTime(el.cost_time),
              }
            })
          }else{
            return { rowNo: '', name: '', score: '', costTime: '' }
          }
        }else{
          if(this.collegeOtherData){
            return this.collegeOtherData.map(el=>{
              return {
              	rowNo: el.rowNo,
                name: el.college,
                score: el.scores,
                costTime: formatTime(el.cost_times),
              }
            })
          }else{
            return { rowNo: '', name: '', score: '', costTime: '' }
          }
        }
      }


//      ...mapState('question', ['score', 'aq_time'])
    },
    filters: {
    },
    methods: {
    	rank(v){
    		this.rankIndex = v;
      },
      formatTime,
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .contrainer{
    background-size: 100vw;
    position: relative;
    height: 100vh;
    display: flex;
    justify-content: center;
    & .main{
      background: rgba(0,0,0,0.40);
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      & .tabC{
        width: 66vw;
        display: flex;
        & >p{
          font-size: 16px;
          width: 33vw;
          background: #D8D8D8;
          color: #fff;
          height: 34px;
          display: flex;
          justify-content: center;
          align-items: center;
          &.active{
            color: #1F8DEA;
            background-color: #fff;
          }
          &:first-child{
            border-radius: 8px 0 0 0;
          }
          &:last-child{
            border-radius: 0 8px 0 0;
          }
        }
      }
      & .contentC{
        background: #FFFFFF;
        box-shadow: 0 2px 6px 0 rgba(0,0,0,0.24);
        border-radius: 8px;
        width: 80vw;
        /*min-height: 400px;*/
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 30px;
        & .jiangbeiC{
          width: 100vw;
          margin: 0px -10vw;
          height: 30vh;
          display: flex;
          justify-content: space-around;

          & .topCell{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 28vw;
            &:first-child{
              margin-left: 4vw;
              & >p{
                color: #e39245;
              }
            }
            &:last-child{
              margin-right: 4vw;
              & >p{
                color: #eba147;
              }
            }
            &.top1{
              width: 36vw;
              margin-top: -2vh;
              & .avatar{
                width: 70px;
                height: 70px;
                & img{
                width: 68px;
                height: 68px;
                }
                & span{
                  font-size:24px;
                  line-height: 68px;
                }
              }
              & .name{
                width: 36vw !important;
              }
            }
            & >p{
              font-weight: bold;
              color: #d36f20;
            }
            & .avatar{
              width: 60px;
              height: 60px;
              border-radius: 50%;
              border: 1px solid #ddd;
              background-color: #fff;
              text-align:center;
              & img{
                width: 58px;
                height: 58px;
                border-radius: 50%;
                object-fit: cover;
              }
              & span{
                font-size:20px;
                line-height: 58px;
              }
            }
            & .topDetail{
              text-align: center;
              & .name{
                font-weight: bold;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                width: 28vw;
                text-overflow: ellipsis;
              }
              & .score{
                font-weight: bold;
                color: #dd7624;
                font-size: 16px;
              }
              & .costTime{
                color: #666;
                font-size: 12px;
              }
            }
          }
        }
      }
      & .otherC{
        margin-top: 10px;
        background: #F6F7F7;
        border-radius: 4px;
        width: 61vw;
        height: 30vh;
        overflow-y: auto;
        padding: 10px;
        & >p{
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
        }
      }
      & .zhcjTip{
        width: 61vw;
        font-size: 12px;
        color: #999;
        margin: 5px 0;
      }
      & .myRank{
        width: 61vw;
        border: 1px solid #EFEFEF;
        border-radius: 4px;
        padding: 5px;
        & >p{
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
</style>
