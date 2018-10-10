/* eslint-disable no-undef*/

const loadingSpinnerHTML = require('./spinner.html');

const LOADING_SPINNER_ID = '#wps-progress';
const LOADING_WRAPPER = '#wps-progress-wrapper';

function updateLoadingPercentage(percentage) {
  const max = -219.99078369140625;
  const progress = document.querySelector(LOADING_SPINNER_ID);
  const value = progress.querySelector('.value');
  const track = progress.querySelector('.fill');
  const offset = ((100 - percentage) / 100) * max;

  track.setAttribute('style', `stroke-dashoffset: ${offset}`);
  value.innerHTML = percentage.toString();
}

function reinitializeSpinner() {
  document.querySelector(LOADING_WRAPPER).remove();
  document.body.innerHTML += loadingSpinnerHTML;
}

// eslint-disable-next-line no-undef, no-unused-vars
const options = ʎɐɹɔosǝʌɹǝs;
const { address, secure } = options;
const protocol = secure ? 'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${address}/wps`);

window.onload = () => {
  document.body.innerHTML += loadingSpinnerHTML;
};

// prevents ECONNRESET errors on the server
window.addEventListener('beforeunload', () => socket.close());

socket.onmessage = (message) => {
  const { action, data } = JSON.parse(message.data);
  const spinnerElement = document.querySelector(LOADING_SPINNER_ID);
  const hasHiddenClass = spinnerElement ? spinnerElement.classList.contains('hidden') : false;
  switch (action) {
    case 'progress':
      if (hasHiddenClass) {
        spinnerElement.classList.remove('hidden');
      }
      if (data.percent === 100) {
        setTimeout(() => {
          reinitializeSpinner();
        }, 10000);
      }
      updateLoadingPercentage(data.percent);
      break;
    default:
  }
};

socket.onclose = () => warn(`The client WebSocket was closed. ${refresh}`);
