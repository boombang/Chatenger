import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: 0,
    userLogin: '',
    isAuthorized: false,
    dialogId: null,
    isCreator: null
  },
  mutations: {
    authFlag(state, bool) {
      state.isAuthorized = bool;
    },
    userInit(state, data) {
      state.userId = data.id;
      state.userLogin = data.login;
    },
    dialogSelect(state, data) {
      state.dialogId = data.dialogId;
      state.isCreator = data.isCreator;
    }
  }
})
