

const state = {
  isLoading: false,
};

const getters = {
};

const actions = {
  async setLoadingState({ commit }, data) {
    commit('SET_LOADING_STATE', data)
  },
};

const mutations = {
  SET_LOADING_STATE(state, data){
    state.isLoading = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
