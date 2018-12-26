import Vue from 'vue';
import App from './App';

const render = () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  new Vue({
    el,
    render: h => h(App)
  })
}

render()
