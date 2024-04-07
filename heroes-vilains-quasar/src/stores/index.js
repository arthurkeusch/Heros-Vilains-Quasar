import {store} from 'quasar/wrappers';
import {createPinia} from 'pinia';
import {useMyStore} from './pinia';

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  // Vous pouvez ajouter des plugins Pinia ici
  // pinia.use(SomePiniaPlugin)

  return pinia;
});

export {useMyStore};
