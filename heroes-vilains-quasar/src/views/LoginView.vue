<template>
  <q-page>
    <q-page-container class="q-pa-md">
      <q-card>
        <q-card-section>
          <q-card-title class="text-h6">Connexion organisation</q-card-title>

          <q-input v-model="phrase" label="Phrase secrète"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn :loading="loading" color="primary" @click="checkInput">Se connecter</q-btn>
        </q-card-actions>
      </q-card>
    </q-page-container>
  </q-page>
</template>

<script>
import {useStore} from 'pinia';
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'LoginView',

  setup() {
    const store = useStore();

    const phrase = store.phrase;
    const loading = store.loading;

    const checkInput = async () => {
      loading.value = true;
      await store.login({phrase: phrase.value});
      loading.value = false;
      if (store.secret.auth) {
        store.user.authUser = false;
        await store.$router.push('/organisation');
      } else {
        alert("Connection échouée !");
      }
    };

    return {phrase, loading, checkInput};
  },
});
</script>
