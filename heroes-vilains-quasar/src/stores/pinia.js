import { defineStore } from 'pinia';
import { useErrorStore } from './error';
import { useAuthStore } from './secret';
import { useUserStore } from './user';
import {
  addTeam,
  createOrganisation,
  getAllOrganisations,
  getOrganisationByID,
  removeTeam
} from "../services/org.service";
import {
  addHeroes,
  createTeam,
  getTeams,
  removeHeroes
} from "../services/team.service";
import {
  createHero,
  getAliases,
  getHeroByID,
  updateHero
} from "../services/hero.service";

export const useMyStore = defineStore({
  id: 'myStore',
  state: () => ({
    currentHero: null,
    currentTeam: null,
    currentOrganisation: null,
    listHeroAlias: [],
    listTeam: [],
    listOrganisations: [],
    error: {
      showErrorDialogue: false,
      errorTitle: 'Titre',
      errorDescr: 'Descr'
    }
  }),

  mutations: {
    updateListHeroAlias(state, listHero) {
      state.listHeroAlias = listHero;
    },

    updateCurrentHero(state, currentHero) {
      state.currentHero = currentHero;
    },

    updateListTeam(state, listTeam) {
      state.listTeam = listTeam;
    },

    updateCurrentTeam(state, currentTeam) {
      state.currentTeam = currentTeam;
    },

    updateListOrganisations(state, listOrganisations) {
      state.listOrganisations = listOrganisations;
    },

    updateCurrentOrganisation(state, currentOrganisation) {
      state.currentOrganisation = currentOrganisation;
    },

    updateShowErrorDialogue(state, isShow) {
      state.error.showErrorDialogue = isShow;
    },

    updateErrorTitle(state, title) {
      state.error.errorTitle = title;
    },

    updateErrorDescr(state, descr) {
      state.error.errorDescr = descr;
    }
  },

  actions: {
    async getAllOrganisations({commit}) {
      let listOrganisation = await getAllOrganisations();
      commit('updateListOrganisations', listOrganisation.data);
    },

    async createOrganisation(context, {name, password}) {
      return await createOrganisation(name, password);
    },

    async getOrganisationByIDFromStore({commit}, idOrg) {
      let answer = await getOrganisationByID(idOrg);
      if (answer.error === 0) {
        commit('updateCurrentOrganisation', answer.data[0]);
      }
      return answer;
    },

    async getAllTeam({commit}) {
      let answer = await getTeams();
      commit('updateListTeam', answer.data);
    },

    updateCurrentTeam({commit}, team) {
      commit('updateCurrentTeam', team);
    },

    async createTeam(name) {
      await createTeam(name);
    },

    async addTeamByID({state, commit}, id_team) {
      await addTeam(id_team);
      let answer = await getOrganisationByID(state.currentOrganisation['_id']);
      if (answer.error === 0) {
        commit('updateCurrentOrganisation', answer.data[0]);
      }
      return answer;
    },

    async removeTeamByID({state, commit}, id_team) {
      await removeTeam(id_team);
      let answer = await getOrganisationByID(state.currentOrganisation['_id']);
      if (answer.error === 0) {
        commit('updateCurrentOrganisation', answer.data[0]);
      }
      return answer;
    },

    async getInfoHeroById({state, commit}) {
      let listTemp = [];
      for (let i = 0; i < state.currentTeam['members'].length; i++) {
        let answer = await getHeroByID(state.currentTeam['members'][i]);
        listTemp.push(answer.data[0]);
      }
      commit('updateListHeroAlias', listTemp);
    },

    setCurrentHero({commit}, hero) {
      commit('updateCurrentHero', hero);
    },

    async getAllHeroAlias() {
      let answer = await getAliases();
      return answer.data;
    },

    async createHeros(context, {publicName, realName, powers}) {
      return await createHero(publicName, realName, powers);
    },

    async addHerosToTeam({state, commit}, idHeros) {
      let answer = await addHeroes(idHeros, state.currentTeam['_id']);
      commit('updateCurrentTeam', answer);
      let listTemp = [];
      for (let i = 0; i < state.currentTeam['members'].length; i++) {
        answer = await getHeroByID(state.currentTeam['members'][i]);
        listTemp.push(answer.data[0]);
      }
      commit('updateListHeroAlias', listTemp);
    },

    async deleteHero({state, commit}, idHero) {
      let answer = await removeHeroes(idHero, state.currentTeam['_id']);
      commit("updateCurrentTeam", answer);
    },

    async updateHero({commit}, hero) {
      let answer = await updateHero(hero['_id'], hero['publicName'], hero['realName'], hero['powers']);
      commit("updateCurrentHero", answer);
    }
  },

  modules: {
    error: useErrorStore(),
    secret: useAuthStore(),
    user: useUserStore()
  }
});
