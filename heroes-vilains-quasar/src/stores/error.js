import {defineStore} from 'pinia';

export const useErrorStore = defineStore({
  id: 'error',

  state: () => ({
    showErrorDialogue: false,
    errorTitle: 'Titre',
    errorDescr: 'Descr'
  }),

  actions: {
    setShowErrorDialogue({commit}, isShow) {
      commit('updateShowErrorDialogue', isShow);
    },
    setErrorTitle({commit}, title) {
      commit('updateErrorTitle', title);
    },
    setErrorDescr({commit}, descr) {
      commit('updateErrorDescr', descr);
    }
  },

  mutations: {
    updateShowErrorDialogue(state, isShow) {
      state.showErrorDialogue = isShow;
    },
    updateErrorTitle(state, title) {
      state.errorTitle = title;
    },
    updateErrorDescr(state, descr) {
      state.errorDescr = descr;
    }
  }
});
