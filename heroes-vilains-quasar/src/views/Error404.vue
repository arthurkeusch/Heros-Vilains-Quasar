<template>
  <q-page4041 v-if="randomPage === 1"/>
  <q-page4042 v-else-if="randomPage === 2"/>
  <q-page4043 v-else-if="randomPage === 3"/>
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue';
import {useStore} from 'pinia';

import QPage4041 from "../components/ErrorPage/Page404-1.vue";
import QPage4042 from "../components/ErrorPage/Page404-2.vue";
import QPage4043 from "../components/ErrorPage/Page404-3.vue";

export default defineComponent({
  name: 'ErrorPage',

  components: {
    QPage4041,
    QPage4042,
    QPage4043
  },

  setup() {
    const store = useStore();
    const randomPage = ref(null);

    const getRandomValues = () => {
      randomPage.value = Math.floor(Math.random() * 3) + 1;
    };

    onMounted(getRandomValues);

    return {
      randomPage
    };
  }
});
</script>
