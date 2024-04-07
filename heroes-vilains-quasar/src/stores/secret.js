import {defineStore} from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',

  state: () => ({
    auth: false,
    passwordOrganisation: null
  }),

  mutations: {
    setLogin(state, phrase) {
      state.auth = true;
      state.passwordOrganisation = phrase;
    },
    setLogout(state) {
      state.auth = false;
      state.passwordOrganisation = null;
    }
  },

  actions: {
    async login({commit}, credentials) {
      await new Promise(resolve => {
        setTimeout(resolve, 500);
      });
      if (credentials.phrase !== null) {
        commit('setLogin', credentials.phrase);
      } else {
        commit('setLogout');
      }
    }
  }
});
