/* eslint-disable no-undef*/

const loadingSpinnerHTML = `
<div id="wps-progress-wrapper">
  <style type="text/css">
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');

  #wps-progress{
    width: 200px;
    height: 200px;
    position: absolute;
    right: 0;
    top: 0;
  }

  #wps-progress .fill{
    fill: rgba(0, 0, 0, 0);
    stroke-width: 10;
    transform: rotate(90deg)translate(0px, -80px);
  }

  #wps-progress .bg {
    fill: #34495e;
  }

  #wps-progress .fill {
    stroke: rgb(186, 223, 172);
    stroke-dasharray: 219.99078369140625;
    stroke-dashoffset: -219.99078369140625;
    transition: stroke-dashoffset 1s;
  }

  #wps-progress .percent {
    font-family: 'Open Sans';
    font-size: 18px;
    fill: rgb(255, 255, 255);
  }

  #wps-progress .percent .value {
    alignment-baseline: middle;
    text-anchor: middle;
  }

  #wps-progress .percent .super {
    fill: #bdc3c7;
    font-size: .45em;
    baseline-shift: 10%;
  }

  .noselect {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: default;
  }

  .hidden{
    visibility: hidden;
  }

  </style>

  <svg id="wps-progress" class="noselect hidden" data-progress="100" x="0px" y="0px" viewBox="0 0 80 80">
    <circle class="bg" cx="50%" cy="50%" r="35"></circle>
    <path class="fill" d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0" />
    <text class="percent" x="50%" y="51%"><tspan class="value">0</tspan><tspan class="super">%</tspan></text>
  </svg>
</div>
`;

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
