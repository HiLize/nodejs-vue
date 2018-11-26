<template>
  <div id="app">
    <router-view></router-view>
    <loading v-model="isLoading"></loading>
  </div>
</template>

<script>
  import { Loading } from 'vux'
  import { mapState } from 'vuex'
  export default {
    name: 'app',
    components: {
      Loading
    },
    computed: {
      ...mapState('sysconfig', {
        isLoading: state => state.isLoading
      })
    }
  }
</script>

<style lang="less">
  *{
    padding: 0;
    margin: 0;
    font-family: "Microsoft YaHei", Helvetica, Arial, sans-serif;
    box-sizing: border-box;
  }

  html, body{
    background-color: #f6f7f7 !important;
  }

  .weui-progress__inner-bar{
    background-image: linear-gradient(90deg, #AAF69C 0%, #5EDF89 100%) !important;
  }

</style>
