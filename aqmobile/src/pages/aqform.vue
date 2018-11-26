<template>
  <div>
    <div class="contrain">
      <div class="progress">
        <x-progress :percent="(showIndex+1)/danxt.length*100" :show-cancel="false"></x-progress>
        <p>已完成：{{(showIndex + 1)}}/{{danxt.length}}</p>
      </div>
      <div class="showQuestionC">
        <questioncell v-for="(el, index) in danxt" :key="'danxt'+index"
                      :title="(index+1)+'. '+el.title+'（单选）'" :options="el.options | optionsFilter"
                      @turn="turn" v-show="index===showIndex" :questioncellIndex="index"
                      :islast="(index+1)===danxt.length"
                      v-model="quuid_auuid[el.uuid]" @submit="submit"
        ></questioncell>
      </div>
    </div>

    <div v-transfer-dom>
      <confirm v-model="showConfirm"
               title="确定提交吗？"
               @on-confirm="onConfirm">
      </confirm>
    </div>

  </div>
</template>

<script>
  import {XProgress, Confirm, TransferDomDirective as TransferDom} from 'vux'
  import questioncell from '../components/questioncell.vue'
  import Vue from 'vue'
  import {wisFetch} from '../utils/utils'
  import {mapState, mapGetters, mapActions} from 'vuex'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XProgress,
      Confirm,

      questioncell,
    },
    async created() {
      this.init();
    },
    data() {
      return {
        percent: 10,
        showIndex: 0,

        userInfo: window.userInfo,

        questionProcessUUID: null,
        questions: [],
        danxt: [],
        quuid_auuid: {},

        showConfirm: false,
      }
    },
    watch: {},
    computed: {},
    filters: {
      optionsFilter(v) {
        if (v) {
          return v.map(item => {
            if (item) {
              return {
                key: item.uuid,
                value: item.name
              }
            } else {
              return {}
            }
          })
        }
      },
    },
    methods: {
      turn(index) {
        this.showIndex = index;
      },
      async init() {
        let collegeId = null;
        if(this.userInfo && this.userInfo.collegeId){
          collegeId = this.userInfo.collegeId
        }
        let r = await wisFetch('getRandomQuestionWithOptions', {
          collegeId,
          student_id: this.userInfo.studentNo,
        });
        if (r.code != 1000) {
          this.$vux.toast.text(r.msg, 'middle');
          return;
        }
        this.questionProcessUUID = r.data.questionProcessUUID;
        this.questions = r.data.result;

        let danxtTmp = this.questions.filter(el => el.question_type_id === 1);
        this.danxt = danxtTmp && danxtTmp[0] && danxtTmp[0].datas ? danxtTmp[0].datas : [];
        this.danxt.forEach((el, index) => {
          if (el.uuid) {
            this.quuid_auuid[el.uuid] = '';
          }
        });
      },
      async submit() {
        this.showConfirm = true;
      },
      onConfirm() {
        this.submit1();
      },
      async submit1() {
        let params = {
          questionProcessUUID: this.questionProcessUUID
        };

        if(this.userInfo){
          params.student_id = this.userInfo.studentNo;
          params.name = this.userInfo.name;
          params.university = this.userInfo.collegeId || '';
          params.college = this.userInfo.academy || '';
          params.quuid_auuid = JSON.stringify(this.quuid_auuid);
          params.img = this.userInfo.img;
        }
        let r = await wisFetch('submit', params);

        if (r.code == 1000) {
          this.setData({
            questions: this.questions,
            current_qa: r.data.current_qa,
            score: r.data.score,
            cost_time: r.data.cost_time,
          });
          this.$router.push({
            name: 'score',
          })
        } else {
          this.$vux.toast.text(r.msg, 'middle');
        }

      },
      ...mapActions('question', ['setData'])
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .contrain {
    & .progress {
      height: 50px;
      & > p {
        padding: 13px 15px 15px;
        font-size: 14px;
        color: #999999;
      }
    }
  }
</style>
