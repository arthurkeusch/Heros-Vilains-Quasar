<template>
  <q-page>
    <q-container>

      <EventDialog
        v-model="showDialogue"
        :width="'1000px'"
        :title="errorDialog ? 'Erreur' : 'Modifier le héro'"
        :show-button-o-k="false"
        :show-button-fermer="true"
        @close="closeDialogueUpdate"
      >
        <div>
          <q-container>
            <q-card>
              <q-card-text>
                <q-card-text v-if="errorTextName" class="warning">{{ errorTextName }}</q-card-text>
                <q-input v-model="publicName" label="Nom public"></q-input>
              </q-card-text>
              <q-card-text>
                <q-input v-model="realName" label="Nom réel"></q-input>
              </q-card-text>

              <q-card>
                <q-card-title>Créer un pouvoir</q-card-title>
                <q-card-text>
                  <q-card-text v-if="errorText" class="warning">{{ errorText }}</q-card-text>
                  <q-input v-model="powerName" label="Nom du pouvoir"></q-input>
                </q-card-text>
                <q-card-text>
                  <q-input v-model="powerType" label="Type du pouvoir (entre 1 et 7)"></q-input>
                </q-card-text>
                <q-card-text>
                  <q-input v-model="powerLevel" label="Niveau du pouvoir (entre 0 et 100)"></q-input>
                </q-card-text>
                <q-card-actions>
                  <q-space />
                  <q-btn @click="addPower">Ajouter le pouvoir</q-btn>
                </q-card-actions>
              </q-card>

              <q-card-title>Liste des pouvoirs : {{ powers.length }}</q-card-title>
              <ListPower :powers="powers" @deletePower="deletePower"/>
            </q-card>
          </q-container>
        </div>
      </EventDialog>

      <h1>Héro actuel :</h1>
      <q-card>
        <q-card-title>
          <u>Alias : </u> {{ currentHero.publicName }}
        </q-card-title>
        <q-card-text>
          <u>Nom réel : </u> {{ currentHero.realName }}
        </q-card-text>
        <q-card-text>Pouvoirs :</q-card-text>
        <ListPower :powers="currentHero.powers" @deletePower="deletePower"/>
      </q-card>

      <q-container v-if="authUser">
        <q-card
          class="text-center green d-flex justify-center"
          @click="showDialogueUpdate()">
          <q-card-title>
            Modifier le héro
          </q-card-title>
        </q-card>
      </q-container>

      <div style="display: flex" v-else>
        <q-container>
          <q-card
            class="text-center green d-flex justify-center"
            @click="showDialogueUpdate()">
            <q-card-title>
              Modifier le héro
            </q-card-title>
          </q-card>
        </q-container>
        <q-container>
          <q-card
            class="text-center green d-flex justify-center"
            @click="showDialogueCreate()">
            <q-card-title>
              Créer un compte utilisateur pour le héro
            </q-card-title>
          </q-card>
        </q-container>
      </div>

    </q-container>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore } from 'pinia';
import ListPower from "../components/ListPowers.vue";
import EventDialog from "../components/EventDialog.vue";
import {createUser} from "src/services/user.service";

export default defineComponent({
  name: 'CurrentHeroView',

  components: {
    EventDialog,
    ListPower
  },

  setup() {
    const store = useStore();

    const showDialogue = ref(false);
    const publicName = ref('');
    const realName = ref('');
    const powers = ref([]);
    const powerName = ref(null);
    const powerType = ref(null);
    const powerLevel = ref(null);
    const errorText = ref(null);
    const errorTextName = ref(null);

    const authUser = computed(() => store.state.user.authUser);
    const currentHero = computed(() => store.state.currentHero);

    const getInfoHero = () => {
      if (authUser.value) {
        store.state.currentHero = store.state.user.heroUser;
      }
      publicName.value = currentHero.value.publicName;
      realName.value = currentHero.value.realName;
      powers.value = currentHero.value.powers;
    };

    const showDialogueUpdate = () => {
      showDialogue.value = true;
    };

    const closeDialogueUpdate = () => {
      showDialogue.value = false;
    };

    const addPower = () => {
      errorText.value = null;
      if (!powerName.value) {
        errorText.value = "Le nom du pouvoir ne peut pas être null !";
        return;
      }
      powerType.value = parseInt(powerType.value);
      if (!Number.isInteger(powerType.value) || isNaN(powerType.value)) {
        errorText.value = "Le type du pouvoir doit être un entier !";
        return;
      }
      if (powerType.value < 1 || powerType.value > 7) {
        errorText.value = "Le type du pouvoir doit être entre 1 et 7 !";
        return;
      }
      powerLevel.value = parseInt(powerLevel.value);
      if (!Number.isInteger(powerLevel.value) || isNaN(powerLevel.value)) {
        errorText.value = "Le niveau du pouvoir doit être un entier !";
        return;
      }
      if (powerLevel.value < 0 || powerLevel.value > 100) {
        errorText.value = "Le niveau du pouvoir doit être entre 0 et 100 !";
        return;
      }
      errorText.value = null;
      powers.value.push({
        name: powerName.value,
        type: powerType.value,
        level: powerLevel.value
      });
    };

    const deletePower = (newPowersTab) => {
      powers.value = newPowersTab;
      updateHeroFromStore();
    };

    const updateHeroFromStore = async () => {
      if (!publicName.value) {
        errorTextName.value = "Le nom public doit être renseigné !";
        return;
      }
      if (!realName.value) {
        errorTextName.value = "Le nom réel doit être renseigné !";
        return;
      }
      const hero = {
        _id: currentHero.value._id,
        publicName: publicName.value,
        realName: realName.value,
        powers: powers.value
      };
      if (authUser.value) {
        const answer = await store.dispatch('updateHeroUser', hero);
        if (answer === 1) {
          store.commit('setShowErrorDialogue', true);
          store.commit('setErrorTitle', "Modification impossible");
          store.commit('setErrorDescr', "L'API n'a pas fonctionnée comme prévu. Les modifications n'ont pas été effectuées.");
        }
        getInfoHero();
      } else {
        await store.dispatch('updateHero', hero);
      }
      closeDialogueUpdate();
    };

    const showDialogueCreate = () => {
      showDialogueCreateUser.value = true;
    };

    const createUserFromStore = async () => {
      // Assuming you have methods to handle user creation in your store
      try {
        const response = await createUser({
          login: login.value,
          password: password.value,
          hero: publicName.value,
          captchaToken: captchaToken.value
        });
      } catch (error) {
        console.error('Error creating user:', error);
      } finally {
        closeDialogueCreerUser();
      }
    };

    return {
      showDialogue,
      publicName,
      realName,
      powers,
      powerName,
      powerType,
      powerLevel,
      errorText,
      errorTextName,
      authUser,
      currentHero,
      getInfoHero,
      showDialogueUpdate,
      closeDialogueUpdate,
      addPower,
      deletePower,
      updateHeroFromStore,
      showDialogueCreate,
      createUserFromStore
    };
  }
});
</script>
