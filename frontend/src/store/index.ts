import dev, { history as devHistory } from './dev';
import prod, { history as prodHistory } from './prod';

const store = () => {
  if (process.env.NODE_ENV !== 'production') {
    return dev;
  }
  return prod;
};

export default store;

export const history = process.env.NODE_ENV !== 'production' ? devHistory : prodHistory;
