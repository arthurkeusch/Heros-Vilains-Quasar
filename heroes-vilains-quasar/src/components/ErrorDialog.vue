<template>
  <q-dialog v-model="showErrorDialogue" persistent max-width="500" no-focus-reset>
    <q-card>
      <q-card-section class="text-h6">
        {{ errorTitle }}
      </q-card-section>
      <q-card-section>
        {{ errorDescr }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="warning" @click="close">Fermer</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {defineComponent, computed} from 'vue';
import {useErrorStore} from 'stores/error';

export default defineComponent({
  name: 'ErrorDialog',

  setup() {
    const errorStore = useErrorStore();

    const showErrorDialogue = computed(() => errorStore.showErrorDialogue);
    const errorTitle = computed(() => errorStore.errorTitle);
    const errorDescr = computed(() => errorStore.errorDescr);

    const close = () => {
      errorStore.setShowErrorDialogue(false);
    };

    return {
      showErrorDialogue,
      errorTitle,
      errorDescr,
      close
    };
  }
});
</script>
