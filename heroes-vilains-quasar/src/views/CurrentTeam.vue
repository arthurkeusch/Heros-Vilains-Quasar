<template>
  <q-container>
    <EventDialog
      :show="showDialogue"
      width="1000px"
      :title="errorDialog ? 'Erreur' : 'Ajouter un membre'"
      :showButtonOK="showButtonOK"
      :showButtonFermer="showButtonFermer"
      @closeDialog="closeDialogue">
      <div v-if="errorDialog">
        <q-card-text v-if="errorText !== null" class="warning">
          {{ errorText }}
        </q-card-text>
      </div>
      <div v-else>
        <q-row>
          <q-col v-for="(hero, index) in listInfosHeros" :key="index" cols="3">
            <q-card
              class="text-center light-blue d-flex justify-center"
              @click="addHeroFromStore(hero['_id'])">
              <q-card-title>
                {{ hero['publicName'] }}
              </q-card-title>
            </q-card>
          </q-col>
        </q-row>
      </div>
    </EventDialog>

    <EventDialog
      :show="showDialogueCreer"
      width="1000px"
      title="Créer un héro"
      :showButtonOK="false"
      :showButtonFermer="true"
      @closeDialog="closeDialogueCreer">
      <q-container>
        <q-card>
          <q-card-text>
            <q-card-text v-if="messageAlertName" class="warning">{{ messageAlertName }}</q-card-text>
            <q-input v-model="publicName" label="Nom public"></q-input>
          </q-card-text>
          <q-card-text>
            <q-input v-model="realName" label="Nom réel"></q-input>
          </q-card-text>

          <q-card>
            <q-card-title>Créer un pouvoir</q-card-title>
            <q-card-text>
              <q-card-text v-if="messageAlert" class="warning">{{ messageAlert }}</q-card-text>
              <q-input v-model="powerName" label="Nom du pouvoir"></q-input>
            </q-card-text>
            <q-card-text>
              <q-input v-model="powerType" label="Type du pouvoir (entre 1 et 7)"></q-input>
            </q-card-text>
            <q-card-text>
              <q-input v-model="powerLevel" label="Niveau du pouvoir (entre 0 et 100)"></q-input>
            </q-card-text>
            <q-card-actions>
              <q-space></q-space>
              <q-btn @click="addPower">Ajouter le pouvoir</q-btn>
            </q-card-actions>
          </q-card>

          <q-card-title>Liste des pouvoirs : {{ powers.length }}</q-card-title>
          <ListPower :powers="powers" @deletePower="deletePower"></ListPower>

          <q-card-actions>
            <q-space></q-space>
            <q-card-text v-if="messageAlertCreate" class="warning">{{ messageAlertCreate }}</q-card-text>
            <q-btn @click="createHeroFromStore">Créer le héros</q-btn>
          </q-card-actions>
        </q-card>
      </q-container>
    </EventDialog>

    <EventDialog
      :show="showDialogueDelete"
      width="1000px"
      title="Supprimer un héros de l'équipe"
      :showButtonOK="false"
      :showButtonFermer="true"
      @closeDialog="closeDialogueDelete">
      <q-row>
        <q-col v-for="(hero, index) in listHeroAlias" :key="index" cols="3">
          <q-card
            class="text-center light-blue d-flex justify-center"
            @click="deleteHeroFromStore(hero['_id'])">
            <q-card-title>
              {{ hero['publicName'] }}
            </q-card-title>
          </q-card>
        </q-col>
      </q-row>
    </EventDialog>

    <h1>Bienvenue sur l'équipe : {{ $store.state.currentTeam.name }}</h1>

    <h2>Liste des membres :</h2>
    <div>
      <q-row>
        <q-col v-for="(member, index) in listHeroAlias" :key="index" cols="3">
          <q-card
            class="text-center light-blue d-flex justify-center"
            @click="goToMember(member)">
            <q-card-title>
              {{ member['publicName'] }}
            </q-card-title>
          </q-card>
        </q-col>
      </q-row>
    </div>

    <br>

    <div style="display: flex">
      <q-container>
        <q-card
          class="text-center green d-flex justify-center"
          @click="addMembre()">
          <q-card-title>
            Ajouter un membre à l'équipe
          </q-card-title>
        </q-card>
      </q-container>
      <q-container>
        <q-card
          class="text-center green d-flex justify-center"
          @click="showDialogueCreerHero()">
          <q-card-title>
            Créer un héros
          </q-card-title>
        </q-card>
      </q-container>
      <q-container>
        <q-card
          class="text-center red d-flex justify-center"
          @click="showDialogueSupprimerHero()">
          <q-card-title>
            Supprimer un héros de l'équipe
          </q-card-title>
        </q-card>
      </q-container>
    </div>
  </q-container>
</template>

<script>
import {defineComponent} from 'vue';
import {useStore} from 'pinia';
import EventDialog from "../components/EventDialog.vue";
import ListPower from "../components/ListPowers.vue";

export default defineComponent({
  name: 'CurrentTeamView',

  components: {
    ListPower,
    EventDialog
  },

  setup() {
    const store = useStore();

    let showDialogueCreer = false;
    let showDialogue = false;
    let errorText = null;
    let errorDialog = false;
    let showButtonOK = null;
    let showButtonFermer = null;
    let listInfosHeros = null;
    let publicName = '';
    let realName = '';
    let powers = [];
    let powerName = null;
    let powerType = null;
    let powerLevel = null;
    let messageAlert = null;
    let messageAlertName = null;
    let messageAlertCreate = null;
    let showDialogueDelete = false;

    const addMembre = async () => {
      showDialogue = true;
      showButtonOK = false;
      showButtonFermer = true;
      errorDialog = false;
      listInfosHeros = await store.getAllHeroAlias();
    };

    const closeDialogue = async (button) => {
      if (button) {
        let response = await store.createOrganisation({name: this.orgName, password: this.orgPass});
        if (response.data !== undefined && response.data.error !== 0) {
          errorText = response.data;
        } else {
          await store.getAllOrganisations();
          showDialogue = false;
        }
      } else {
        this.orgPass = null;
        this.orgName = null;
        errorText = null;
        showDialogue = false;
        showButtonOK = null;
        showButtonFermer = null;
        showDialogueCreer = false;
        messageAlert = null;
      }
    };

    const goToMember = async (member) => {
      await store.setCurrentHero(member);
      await router.push("/hero/current");
    };

    const createHeroFromStore = async () => {
      if (publicName === null || publicName === '') {
        messageAlertName = "Le nom public doit être renseigné !";
        return;
      }
      if (realName === null || realName === '') {
        messageAlertName = "Le nom réel doit être renseigné !";
        return;
      }
      let answer = await store.createHeros({publicName: publicName, realName: realName, powers: powers});
      if (!answer['_id']) {
        messageAlertCreate = answer.data;
      } else {
        await store.addHerosToTeam(answer['_id']);
        closeDialogueCreer();
      }
    };

    const closeDialogueCreer = () => {
      messageAlert = null;
      messageAlertName = null;
      showDialogueCreer = false;
    };

    const showDialogueCreerHero = () => {
      messageAlert = null;
      showDialogueCreer = true;
    };

    const addPower = () => {
      messageAlert = null;
      if (powerName === null) {
        messageAlert = "Le nom du pouvoir ne peut pas être null !";
        return;
      }
      powerType = parseInt(powerType);
      if (!Number.isInteger(powerType) || powerType === null || isNaN(powerType)) {
        messageAlert = "Le type du pouvoir doit être un entier !";
        return;
      }
      powerType = parseInt(powerType);
      if (powerType < 1) {
        messageAlert = "Le type du pouvoir doit être supérieur ou égale à 1 !";
        return;
      }
      if (powerType > 7) {
        messageAlert = "Le type du pouvoir doit être inférieur ou égale à 7 !";
        return;
      }
      powerLevel = parseInt(powerLevel);
      if (!Number.isInteger(powerLevel) || powerLevel === null || isNaN(powerLevel)) {
        messageAlert = "Le niveau du pouvoir doit être un entier !";
        return;
      }
      if (powerLevel < 0) {
        messageAlert = "Le niveau du pouvoir doit être supérieur ou égale à 0 !";
        return;
      }
      if (powerLevel > 100) {
        messageAlert = "Le niveau du pouvoir doit être inférieur ou égale à 100 !";
        return;
      }
      messageAlert = null;
      powers.push({
        "name": powerName,
        "type": powerType,
        "level": powerLevel
      });
    };

    const addHeroFromStore = async (id) => {
      await store.addHerosToTeam(id);
      showDialogue = false;
    };

    const showDialogueSupprimerHero = () => {
      showDialogueDelete = true;
    };

    const closeDialogueDelete = () => {
      showDialogueDelete = false;
    };

    const deleteHeroFromStore = async (id) => {
      await store.deleteHero({idHero: id});
      closeDialogueDelete();
    };

    const deletePower = (newPowersTab) => {
      powers = newPowersTab;
    };

    return {
      showDialogueCreer,
      showDialogue,
      errorText,
      errorDialog,
      showButtonOK,
      showButtonFermer,
      listInfosHeros,
      publicName,
      realName,
      powers,
      powerName,
      powerType,
      powerLevel,
      messageAlert,
      messageAlertName,
      messageAlertCreate,
      showDialogueDelete,
      addMembre,
      closeDialogue,
      goToMember,
      createHeroFromStore,
      closeDialogueCreer,
      showDialogueCreerHero,
      addPower,
      addHeroFromStore,
      showDialogueSupprimerHero,
      closeDialogueDelete,
      deleteHeroFromStore,
      deletePower
    };
  }
});
</script>
