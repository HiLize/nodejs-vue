<template>
  <div>
    <div class="contrainer">
      <img class="bg-cover" :src="'./static/indexbg_new.png'">
      <div class="cell">
        <div class="ksdt" @click="startAns('aqform')"><span>开始答题</span></div>
        <p class="phb" @click="goLink('newrank')">查看排行榜</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {XHeader} from 'vux'
  import Vue from 'vue'
  import utils from '../utils/utils'
  import {wisFetch} from '../utils/utils'
  import {mapState, mapGetters, mapActions} from 'vuex'

  export default {
    components: {
      XHeader,
    },
    async created() {
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
    data() {
      return {
          limitCount: 0,
          nowUserCount: 0,
          userInfo: window.userInfo
      }
    },
    computed: {},
    methods: {
      goLink(param) {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .contrainer {
    background-size: 100vw;
    position: relative;
    height: 100vh;
    display: flex;
    justify-content: center;
    & .bg-cover{
      width: 100%;
      height: 100%;
    }
    & .cell {
      position: absolute;
      text-align: center;
      bottom: 45px;
      left: 0;
      right: 0;
      & .ctitle {
        font-size: 32px;
        color: #fff;
        & > span {
          &:first-child {
            font-weight: bold;
          }
          &:last-child {

          }
        }
      }
      & .img1 {
        width: 90vw;
      }
      & .ksdt {
        width: 168px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 18px;
        color: #FFFFFF;
        background-image: linear-gradient(-180deg, #FEE276 0%, #FCAE61 100%);
        border-radius: 8px;
        margin: 50px auto 30px auto;
        & > span {
          text-shadow: 0 2px 4px #FFA500;
        }
      }
      & .phb {
        font-size: 14px;
        color: #FFFFFF;
      }
    }

  }
</style>