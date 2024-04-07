import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ListTeamView from "../views/ListTeamView.vue";
import OrgaView from "../views/OrgaView.vue";
import LoginView from "../views/LoginView.vue";
import CurrentOrga from "../views/CurrentOrgaView.vue";
import CurrentTeam from "../views/CurrentTeam.vue";
import CurrentHeroView from "../views/CurrentHeroView.vue";
import { useErrorStore } from "stores/error";
import Error404 from "../views/Error404.vue";
import HerosLoginView from "../views/HerosLoginView.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      levelAuth: 0
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      levelAuth: 0
    }
  },
  {
    path: '/organisation',
    name: 'OrgaView',
    component: OrgaView,
    meta: {
      levelAuth: 0
    }
  },
  {
    path: '/organisation/current',
    name: 'currentOrga',
    component: CurrentOrga,
    meta: {
      levelAuth: 1
    }
  },
  {
    path: '/team/list',
    name: 'listTeamView',
    component: ListTeamView,
    meta: {
      levelAuth: 0
    }
  },
  {
    path: '/team/current',
    name: 'currentTeam',
    component: CurrentTeam,
    meta: {
      levelAuth: 1
    }
  },
  {
    path: '/hero/current',
    name: 'currentHero',
    component: CurrentHeroView,
    meta: {
      levelAuth: 1
    }
  },
  {
    path: '/login/hero',
    name: 'loginHero',
    component: HerosLoginView,
    meta: {
      levelAuth: 0
    }
  },
  {
    path: '/404',
    name: 'errorPage404',
    component: Error404,
    meta: {
      levelAuth: 0
    }
  },
  {
    path: '/:catchAll(.*)*',
    name: 'error404',
    redirect: { name: 'errorPage404' }
  },
];

export default route(function (/* { store, ssrContext } */) {
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  });

  function checkAccess(to) {
    const authStore = useAuthStore();
    if (to.meta.levelAuth === 1) {
      if (authStore.auth || authStore.authUser) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  router.beforeEach((to, from, next) => {
    if (to.name === 'error404') {
      next('/404');
    } else if (checkAccess(to)) {
      next();
    } else {
      const authStore = useErrorStore();
      authStore.setErrorTitle("Accès interdit");
      authStore.setErrorDescr("Vous devez être connecté pour accéder à cette page !");
      authStore.setShowErrorDialogue(true);
      next('/login');
    }
  });

  return router;
});
