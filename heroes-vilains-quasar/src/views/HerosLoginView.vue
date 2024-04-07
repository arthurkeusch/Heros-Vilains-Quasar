<template>
  <q-page>
    <q-container>
      <q-card>
        <q-card-title>Connexion héro</q-card-title>

        <q-card-text>
          <q-input v-model="username" label="Identifiant"></q-input>
        </q-card-text>

        <q-card-text>
          <q-input v-model="password" label="Mot de passe"></q-input>
        </q-card-text>

        <q-card-actions>
          <q-space></q-space>
          <q-btn :loading="loading" @click="checkInput">Se connecter</q-btn>
        </q-card-actions>

      </q-card>
    </q-container>
  </q-page>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {useStore} from 'pinia';

export default defineComponent({
  name: 'HeroLoginView',

  setup() {
    const store = useStore();

    const username = ref('');
    const password = ref('');
    const loading = ref(false);

    const loginUser = async () => {
      loading.value = true;
      await store.dispatch('loginUser', {username: username.value, password: password.value});
      loading.value = false;
      if (store.state.user.authUser) {
        await router.push('/hero/current');
      }
    };

    const checkInput = () => {
      loginUser();
    };

    return {
      username,
      password,
      loading,
      checkInput
    };
  }
});
</script>
