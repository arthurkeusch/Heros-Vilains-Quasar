import { defineStore } from 'pinia';
import { getHeroUser, signin, updateHero } from '../services/user.service';

export const useUserStore = defineStore({
  id: 'user',

  state: () => ({
    authUser: false,
    username: null,
    passwordUser: null,
    heroUser: null
  }),

  mutations: {
    updateAuthUser(state, authUser) {
      state.authUser = authUser;
    },
    updateUsername(state, username) {
      state.username = username;
    },
    updatePasswordUser(state, password) {
      state.passwordUser = password;
    },
    updateHeroUser(state, hero) {
      state.heroUser = hero;
    }
  },

  actions: {
    async loginUser({ commit, state }, { username, password }) {
      await new Promise(resolve => {
        setTimeout(resolve, 500);
      });
      commit('updateUsername', username);
      commit('updatePasswordUser', password);
      let answer = await signin(state.username, state.passwordUser);
      if (answer.error !== 0) {
        commit('updateAuthUser', false);
      } else {
        commit('updateAuthUser', true);
        localStorage.setItem('xsrfToken', answer.data.xsrfToken);
        localStorage.setItem('refreshToken', answer.data.refreshToken);
        answer = await getHeroUser(state.username);
        commit('updateHeroUser', answer.data.data.hero);
      }
    },

    async updateHeroUser({ commit }, hero) {
      const answer = await updateHero(hero);
      if (answer.error === 0) {
        commit('updateHeroUser', hero);
        return 0;
      } else {
        return 1;
      }
    }
  }
});
