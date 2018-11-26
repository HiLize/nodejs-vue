<template>
  <div class="contrainer">

    <div class="main">
      <p class="title">{{title}}</p>
      <div class="options">
        <div v-for="(el, index) in options" :class="'opt '+(selectItem&&selectItem.key===el.key?'active':'')" @click="select(el)">
          <span>{{getChar((index+1))}}.</span>
          <span>{{el.value}}</span>
        </div>
      </div>
    </div>

    <div class="btnC">
      <div v-if="questioncellIndex>0" class="btn pre" @click="pre">上一题</div>
      <div v-if="!islast" class="btn next" @click="next">下一题</div>
      <div v-if="islast" class="btn next" @click="submit">提交</div>
    </div>

  </div>
</template>

<script>
  import { XHeader } from 'vux'
  import Vue from 'vue'

  export default {
  	props: ['title', 'options', 'questioncellIndex', 'islast'],
    components: {
      XHeader,
    },
    async created(){

    },
    data(){
      return {
      	selectItem: null,
      }
    },
    computed: {
    },
    methods: {
      submit(){
        if(this.selectItem==null){
          this.$vux.toast.text('请选择答案', 'middle');
          return;
        }
        this.$emit('input', this.selectItem&&this.selectItem.key?this.selectItem.key:null);
        this.$emit('submit');
      },
    	pre(){
    		this.$emit('turn', this.questioncellIndex-1);
      },
      next(){
    		if(this.selectItem==null){
          this.$vux.toast.text('请选择答案', 'middle');
          return;
        }
        this.$emit('input', this.selectItem&&this.selectItem.key?this.selectItem.key:null);
        this.$emit('turn', this.questioncellIndex+1);
      },
      select(opt){
      	this.selectItem = opt;
      },
    	getChar(index){
    		return String.fromCharCode(64 + parseInt(index));
      }
    },
  }
</script>

<style scoped lang="less">
  .contrainer{
    height: calc(~"100vh - 50px");
    position: relative;

    & .main{
      background-color: #fff;
      max-height: calc(~"100vh - 130px");
      box-sizing: border-box;
      overflow: auto;
      padding: 15px;
      & .title{
        font-size: 14px;
        color: #333;
        margin-bottom: 15px;
      }
      & .options{
        & .opt{
          padding: 13px 36px 13px 15px;
          display: flex;
          justify-content: baseline;
          align-items: center;
          border: 1px solid #EFEFEF;
          border-radius: 4px;
          font-weight: bold;
          position: relative;
          &:not(:last-child){
            margin-bottom: 15px;
          }
          &.active{
            background: rgba(31,141,234,0.06);
            border: 1px solid #1F8DEA;
            &:after{
              content: "";
              width: 16px;
              height: 16px;
              background-image: url("../assets/right.png");
              background-size: 16px;
              position: absolute;
              right: 10px;
              top: calc(~"50% - 8px");
            }
          }
          & >span{
            color: #333;
            &:first-child{
              font-size: 16px;
              margin-right: 10px;
            }
            &:last-child{
              font-size: 14px;
            }
          }
        }
      }
    }
    & .btnC{
      position: absolute;
      bottom: 0;
      height: 80px;
      width: 100vw;
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
      & .btn{
        text-align: center;
        width: calc(~"50vw - 25px");
        height: 44px;
        line-height: 44px;
        font-size: 18px;
        color: #fff;
        margin: 18px auto;
        background: #1F8DEA;
        border-radius: 8px;
        &.pre{
          border: 1px solid #1F8DEA;
          background-color: #fff;
          color: #1F8DEA;
        }
      }
    }
  }
</style>
