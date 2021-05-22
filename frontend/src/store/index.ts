import dev from './dev';
import prod from './prod';

const store = () => {
  return dev;
  // if (process.env.ENVIRONMENT) {
  //   return dev;
  // }

  // return prod;
};

export default store();
