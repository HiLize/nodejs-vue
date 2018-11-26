

const state = {
  questions: null,
  score: 0,
  cost_time: 0,
  current_qa: null,
};

const getters = {
};

const actions = {
  async setData({ commit }, data) {
    commit('SET_DATA', data)
  },
};

const mutations = {
  SET_DATA(state, data){
    Object.keys(data).forEach(key=>{
      state[key] = data[key];
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
