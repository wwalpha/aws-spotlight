import { createHashHistory } from 'history';
import dev from './dev';
import prod from './prod';

export const history = createHashHistory();

const store = () => {
  return dev(history);
  // if (process.env.ENVIRONMENT) {
  //   return dev;
  // }

  // return prod;
};

export default store();
