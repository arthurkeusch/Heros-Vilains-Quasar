<template>
  <q-page-container>

    <EventDialog
      :show="showDialogue"
      :width="'500px'"
      title='Créer une équipe'
      :show-button-o-k="true"
      :show-button-fermer="true"
      @closeDialog="closeDialogue">
      <div>
        <q-input
          v-model="teamName"
          label="Nom"/>
      </div>
    </EventDialog>

    <q-container>
      <q-card
        class="text-center green d-flex justify-center"
        @click="createNewTeam()">
        <q-card-title>
          Créer une équipe
        </q-card-title>
      </q-card>
    </q-container>

    <q-row>
      <q-col
        v-for="(team, index) in listTeam"
        :key="index"
        cols="3">
        <q-card
          class="text-center light-blue d-flex justify-center"
          @click="goToTeam(team)">
          <q-card-title>
            {{ team.name }}
          </q-card-title>
        </q-card>
      </q-col>
    </q-row>
  </q-page-container>
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue';
import {useStore} from 'pinia';

import EventDialog from "../components/EventDialog.vue";
import {createTeam} from "../services/team.service";

export default defineComponent({
  name: 'ListTeamView',
  components: {EventDialog},

  setup() {
    const store = useStore();
    const showDialogue = ref(false);
    const teamName = ref(null);

    const getAllTeam = async () => {
      await store.dispatch('getAllTeam');
    };

    onMounted(getAllTeam);

    const createNewTeam = () => {
      showDialogue.value = true;
    };

    const goToTeam = async (team) => {
      await store.dispatch('updateCurrentTeam', team);
      await router.push('/team/current');
    };

    const closeDialogue = async (button) => {
      if (button) {
        await createTeam(teamName.value);
        await getAllTeam();
      }
      showDialogue.value = false;
      teamName.value = null;
    };

    return {
      showDialogue,
      teamName,
      listTeam: store.state.listTeam,
      createNewTeam,
      goToTeam,
      closeDialogue
    };
  }
});
</script>
