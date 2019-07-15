require('./component');

if (module.hot) {
  module.hot.accept((err) => {
    if (err) {
      console.error('HMR', err);
    }
  });
}
