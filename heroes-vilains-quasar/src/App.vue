<template>
  <q-page-container>
    <error-dialog/>

    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn flat round dense class="text-white" v-if="$q.platform.is.desktop || $q.platform.is.mac" @click="drawer = !drawer">
            <q-icon name="menu" class="text-white"/>
          </q-btn>
          <q-space/>
          <q-menu>
            <template v-slot:activator="{ on }">
              <q-btn flat round dense class="text-white" v-on="on">
                <q-icon name="account" class="text-white"/>
              </q-btn>
            </template>

            <q-list>
              <q-item clickable @click="redirect(6)">
                <q-item-section>
                  <q-icon name="account-group"/>
                </q-item-section>
                <q-item-section>Login organisation</q-item-section>
              </q-item>

              <q-item clickable @click="redirect(8)">
                <q-item-section>
                  <q-icon name="account"/>
                </q-item-section>
                <q-item-section>Login hero</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawer" show-if-above :breakpoint="$q.screen.xs || $q.screen.sm || $q.screen.md"
                class="bg-grey-2" content-class="bg-grey-2">
        <q-list>
          <q-item clickable @click="redirect(1)">Accueil</q-item>
          <q-item clickable @click="redirect(2)">Organisation courante</q-item>
          <q-item clickable @click="redirect(3)">Liste des organisations</q-item>
          <q-item clickable @click="redirect(4)">Equipe courante</q-item>
          <q-item clickable @click="redirect(5)">Liste des équipes</q-item>
          <q-item clickable @click="redirect(7)">Page d'erreur 404</q-item>
          <q-item clickable @click="redirect(9)">Héro courant</q-item>
        </q-list>
      </q-drawer>

      <q-page-container>
        <router-view/>
      </q-page-container>
    </q-layout>
  </q-page-container>
</template>

<script>
import {ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { createPinia } from 'pinia';
import ErrorDialog from "./components/ErrorDialog.vue";

export default {
  name: 'App',

  components: {
    ErrorDialog
  },

  setup() {
    const drawer = ref(false);
    const route = useRoute();
    const router = useRouter();
    const store = createPinia();

    const redirect = async (id) => {
      if (id === 1 && route.path !== '/') {
        await router.push('/');
      } else if (id === 2 && route.path !== '/organisation/current') {
        await router.push('/organisation/current');
      } else if (id === 3 && route.path !== '/organisation') {
        await router.push('/organisation');
      } else if (id === 4 && route.path !== '/team/current') {
        await router.push('/team/current');
      } else if (id === 5 && route.path !== '/team/list') {
        await router.push('/team/list');
      } else if (id === 6 && route.path !== '/login') {
        await router.push('/login');
      } else if (id === 7 && route.path !== '/404') {
        await router.push('/404');
      } else if (id === 8 && route.path !== '/login/hero') {
        await router.push('/login/hero');
      } else if (id === 9 && route.path !== '/hero/current') {
        await router.push('/hero/current');
      }
    };

    return {
      drawer,
      redirect
    };
  }
}
</script>

<style scoped>
h3 {
  margin-right: 40px;
}
</style>
