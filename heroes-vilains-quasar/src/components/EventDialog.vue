<template>
  <q-dialog :v-model="show" persistent :max-width="width" :retain-focus="false">
    <q-card>
      <q-card-section class="headline">
        {{ title }}
      </q-card-section>
      <q-card-section>
        <slot></slot>
      </q-card-section>

      <q-card-actions>
        <q-space />
        <q-btn v-if="showButtonOK" color="green darken-1" @click="$emit('closeDialog', true)">
          Ok
        </q-btn>
        <q-btn v-if="showButtonFermer" color="warning" @click="$emit('closeDialog', false)">
          Fermer
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventDialog',
  props: {
    title: String,
    width: String,
    show: Boolean,
    showButtonOK: Boolean,
    showButtonFermer: Boolean
  },
});
</script>
