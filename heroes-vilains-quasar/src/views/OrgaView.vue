<template>
  <q-page-container>

    <EventDialog
      :show="showDialogue"
      :width="'500px'"
      title="Créer une organisation"
      :show-button-o-k="showButtonOK"
      :show-button-fermer="showButtonFermer"
      @closeDialog="closeDialogue">
      <div>
        <q-input
          v-model="orgName"
          label="Nom"/>
        <q-input
          v-model="orgPass"
          label="Mot de passe"
          type="password"/>
        <q-card-text
          v-if="errorText !== null"
          class="warning">
          {{ errorText }}
        </q-card-text>
      </div>
    </EventDialog>

    <q-container>
      <q-card
        class="text-center green d-flex justify-center"
        @click="createOrg()">
        <q-card-title>
          Créer une organisation
        </q-card-title>
      </q-card>
    </q-container>

    <q-row>
      <q-col
        v-for="(organisation, index) in listOrganisations"
        :key="index"
        cols="3">
        <q-card
          class="text-center light-blue d-flex justify-center"
          @click="goToOrganisation(organisation._id)">
          <q-card-title>
            {{ organisation.name }}
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

export default defineComponent({
  name: 'OrgaView',

  components: {
    EventDialog
  },

  setup() {
    const store = useStore();
    const showDialogue = ref(false);
    const orgName = ref(null);
    const orgPass = ref(null);
    const errorText = ref(null);
    const showButtonOK = ref(null);
    const showButtonFermer = ref(null);

    const getAllOrganisations = async () => {
      await store.dispatch('getAllOrganisations');
    };

    onMounted(getAllOrganisations);

    const goToOrganisation = async (id) => {
      const answer = await store.dispatch('getOrganisationByIDFromStore', id);
      if (answer.error === 1) {
        store.dispatch('setShowErrorDialogue', true);
        store.dispatch('setErrorTitle', "Accès à l'organisation impossible");
        store.dispatch('setErrorDescr', answer.data.data);
      } else {
        await router.push({name: 'currentOrga', params: {infoOrg: answer.data}});
      }
    };

    const createOrg = () => {
      showDialogue.value = true;
      showButtonOK.value = true;
      showButtonFermer.value = true;
    };

    const closeDialogue = async (button) => {
      if (button) {
        const response = await store.dispatch('createOrganisation', {name: orgName.value, password: orgPass.value});
        if (response.data !== undefined && response.data.error !== 0) {
          errorText.value = response.data;
        } else {
          await getAllOrganisations();
          showDialogue.value = false;
        }
      } else {
        orgPass.value = null;
        orgName.value = null;
        errorText.value = null;
        showDialogue.value = false;
        showButtonOK.value = null;
        showButtonFermer.value = null;
      }
    };

    return {
      showDialogue,
      orgName,
      orgPass,
      errorText,
      showButtonOK,
      showButtonFermer,
      listOrganisations: store.state.listOrganisations,
      createOrg,
      goToOrganisation,
      closeDialogue
    };
  }
});
</script>
