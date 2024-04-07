<template>
  <q-row v-if="powers.length !== 0">
    <q-col
      v-for="(power, index) in powers"
      :key="index"
      cols="4">
      <q-card
        :style="{ backgroundColor: calculateColor(power['level']) }"
        class="text-center d-flex justify-center">
        <q-card-text>
          <b>Nom :</b> {{ power['name'] }}<br>
          <b>Type :</b> {{ power['type'] }}<br>
          <b>Niveau :</b> {{ power['level'] }}<br>
          <q-btn @click="deletePower(index)">Supprimer</q-btn>
        </q-card-text>
      </q-card>
    </q-col>
  </q-row>
  <q-card-text v-else>Ce héros ne possède pas de pouvoir pour le moment !</q-card-text>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ListPower',

  props: {
    powers: Array
  },

  setup(props, { emit }) {
    const calculateColor = (level) => {
      const hue = ((100 - level) * 1.2).toFixed(0);
      return `hsl(${hue}, 100%, 50%)`;
    };

    const deletePower = (index) => {
      const tempPowersTab = [...props.powers];
      tempPowersTab.splice(index, 1);
      emit('deletePower', tempPowersTab);
    };

    return {
      calculateColor,
      deletePower
    };
  }
};
</script>
