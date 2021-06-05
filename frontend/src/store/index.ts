const store = () => {
  if (process.env.NODE_ENV !== 'production') {
    return require('./dev').default;
  }

  return require('./prod').default;
};

export default store;

export const history = process.env.NODE_ENV !== 'production' ? require('./dev').history : require('./prod').history;
