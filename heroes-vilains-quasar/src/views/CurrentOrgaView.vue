<template>
  <q-page>
    <q-container>

      <EventDialog
        v-model="showDialogue"
        :width="'1000px'"
        :title="errorDialog ? 'Erreur' : 'Ajouter/Supprimer une équipe'"
        :show-button-o-k="false"
        :show-button-fermer="true"
        @close="closeDialogue"
      >
        <div v-if="errorDialog">
          <q-card-text v-if="errorText !== null" class="warning">
            {{ errorText }}
          </q-card-text>
        </div>

        <div v-else-if="showDialogueAjouter">
          <q-row>
            <q-col
              v-for="(team, index) in listTeam"
              :key="index"
              cols="3"
            >
              <q-card
                class="text-center light-blue d-flex justify-center"
                @click="addTeamByIDFromStore(team)"
              >
                <q-card-title>
                  {{ team.name }}
                </q-card-title>
              </q-card>
            </q-col>
          </q-row>
        </div>

        <div v-else-if="showDialogueSupprimer">
          <q-row>
            <q-col
              v-for="(team, index) in currentOrganisation.teams"
              :key="index"
              cols="3"
            >
              <q-card
                class="text-center light-blue d-flex justify-center"
                @click="removeTeamByIDFromStore(team)"
              >
                <q-card-title>
                  {{ team.name }}
                </q-card-title>
              </q-card>
            </q-col>
          </q-row>
        </div>
      </EventDialog>

      <h1>Organisation actuelle : {{ currentOrganisation.name }}</h1>

      <h2>Liste des équipes :</h2>
      <div>
        <q-row>
          <q-col
            v-for="(team, index) in currentOrganisation.teams"
            :key="index"
            cols="3"
          >
            <q-card
              class="text-center light-blue d-flex justify-center"
              @click="goToTeam(team)"
            >
              <q-card-title>
                {{ team.name }}
              </q-card-title>
            </q-card>
          </q-col>
        </q-row>
      </div>

      <br>
      <hr>
      <div style="display: flex">
        <q-container>
          <q-card
            class="text-center green d-flex justify-center"
            @click="addTeam()"
          >
            <q-card-title>
              Ajouter une équipe
            </q-card-title>
          </q-card>
        </q-container>
        <q-container>
          <q-card
            class="text-center red d-flex justify-center"
            @click="removeTeam()"
          >
            <q-card-title>
              Supprimer une équipe
            </q-card-title>
          </q-card>
        </q-container>
      </div>

    </q-container>
  </q-page>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {useStore} from 'pinia';
import EventDialog from "../components/EventDialog.vue";

export default defineComponent({
  name: 'CurrentOrgaView',

  components: {
    EventDialog
  },

  setup() {
    const store = useStore();

    const showDialogue = ref(false);
    const showDialogueAjouter = ref(false);
    const showDialogueSupprimer = ref(false);
    const errorDialog = ref(false);
    const errorText = ref('');

    const addTeam = async () => {
      showDialogue.value = true;
      showDialogueAjouter.value = true;
      showDialogueSupprimer.value = false;
      errorDialog.value = false;
      await store.dispatch('getAllTeam');
    };

    const removeTeam = () => {
      showDialogue.value = true;
      showDialogueAjouter.value = false;
      showDialogueSupprimer.value = true;
    };

    const closeDialogue = () => {
      showDialogue.value = false;
    };

    const addTeamByIDFromStore = (team) => {
      if (teamIsInOrganisation(team['_id'])) {
        store.commit('setShowErrorDialogue', true);
        store.commit('setErrorTitle', "Ajout impossible");
        store.commit('setErrorDescr', "Vous ne pouvez pas ajouter cette équipe!");
      } else {
        store.dispatch('addTeamByID', team['_id']);
        showDialogue.value = false;
      }
    };

    const removeTeamByIDFromStore = (team) => {
      if (!teamIsInOrganisation(team['_id'])) {
        store.commit('setShowErrorDialogue', true);
        store.commit('setErrorTitle', "Suppression impossible");
        store.commit('setErrorDescr', "Vous ne pouvez pas supprimer cette équipe!");
      } else {
        store.dispatch('removeTeamByID', team['_id']);
        showDialogue.value = false;
      }
    };

    const teamIsInOrganisation = (id_team) => {
      for (let i = 0; i < currentOrganisation['teams'].length; i++) {
        if (id_team === currentOrganisation['teams'][i]['_id']) {
          return true;
        }
      }
      return false;
    };

    const goToTeam = async (team) => {
      store.dispatch('updateCurrentTeam', team);
      await router.push({name: 'currentTeam'});
    };

    return {
      showDialogue,
      showDialogueAjouter,
      showDialogueSupprimer,
      errorDialog,
      errorText,
      addTeam,
      removeTeam,
      closeDialogue,
      addTeamByIDFromStore,
      removeTeamByIDFromStore,
      teamIsInOrganisation,
      goToTeam
    };
  }
});
</script>
