/*
  Copyright © 2018 Andrew Powell, Matheus Gonçalves da Silva

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { addCss, addHtml } = require('./util');

const ns = 'wps-progress';
const html = `<div id="${ns}" class="${ns}-hidden-meter"></div>`;
const meterHtml = `
<svg id="{{id}}" class="${ns}-meter ${ns}-noselect ${ns}-hidden-meter" x="0px" y="0px" viewBox="0 0 80 80">
  <circle class="${ns}-bg" cx="50%" cy="50%" r="35"></circle>
  <path class="${ns}-fill" d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0" />
  <text class="${ns}-percent" x="50%" y="51%">
    <tspan class="${ns}-percent-value">0</tspan>
    <tspan class="${ns}-percent-super">%</tspan>
  </text>
</svg>
`;
const css = `
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');

#${ns} {
  width: 200px;
  position: absolute;
  right: 5%;
  top: 5%;
  z-index: 1000;
}

#${ns}.${ns}-hidden {
  display: none;
}

.${ns}-meter{
  height: 200px;
  margin-top: 20px;
  transition: opacity .25s ease-in-out;
  width: 200px;
}

.${ns}-bg {
  fill: #282d35;
}

.${ns}-fill {
  fill: rgba(0, 0, 0, 0);
  stroke: rgb(186, 223, 172);
  stroke-dasharray: 219.99078369140625;
  stroke-dashoffset: -219.99078369140625;
  stroke-width: 10;
  transform: rotate(90deg)translate(0px, -80px);
  transition: stroke-dashoffset 1s;
}

.${ns}-percent {
  font-family: 'Open Sans';
  font-size: 18px;
  fill: #ffffff;
}

.${ns}-percent-value {
  alignment-baseline: middle;
  text-anchor: middle;
}

.${ns}-percent-super {
  fill: #bdc3c7;
  font-size: .45em;
  baseline-shift: 10%;
}

.${ns}-noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: default;
}

@keyframes ${ns}-hidden-meter-display {
	0% {
		opacity: 1;
		transform: scale(1);
		-webkit-transform: scale(1);
	}
	99% {
		display: inline-flex;
		opacity: 0;
		transform: scale(0);
		-webkit-transform: scale(0);
	}
	100% {
		display: none;
		opacity: 0;
		transform: scale(0);
		-webkit-transform: scale(0);
	}
}

.${ns}-hidden-meter {
  animation: ${ns}-hidden-meter-display .3s;
  animation-fill-mode:forwards;
  display: inline-flex;
}
`;

const init = (options, socket) => {
  const { compilerName } = options;
  const targetId = `${ns}-${compilerName}`;

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector(`#${ns}`);
    if (!container) {
      addCss(css);
      addHtml(html);
    }

    addHtml(meterHtml.replace('{{id}}', targetId), container);
  });

  const update = (percent) => {
    const max = -219.99078369140625;
    const value = document.querySelector(`#${targetId} .${ns}-percent-value`);
    const track = document.querySelector(`#${targetId} .${ns}-fill`);
    const offset = ((100 - percent) / 100) * max;

    track.setAttribute('style', `stroke-dashoffset: ${offset}`);
    value.innerHTML = percent.toString();
  };

  const checkAll = () => {
    const meters = document.querySelectorAll(`.${ns}-meter`);

    for (const meter of meters) {
      if (!meter.classList.contains(`${ns}-hidden-meter`)) {
        return false;
      }
    }

    return true;
  };

  const reset = (container, svg) => {
    svg.classList.add(`${ns}-hidden-meter`);

    if (checkAll) {
      container.classList.add(`${ns}-hidden`);
    }

    setTimeout(() => update(0), 1e3);
  };

  socket.addEventListener('message', (message) => {
    const { action, data } = JSON.parse(message.data);

    if (action !== 'progress') {
      return;
    }

    const percent = Math.floor(data.percent * 100);
    const container = document.querySelector(`#${ns}`);
    const svg = document.querySelector(`#${targetId}`);

    if (!svg) {
      return;
    }

    // we can safely call this even if it doesn't have the class
    container.classList.remove(`${ns}-hidden`);
    svg.classList.remove(`${ns}-hidden-meter`);

    if (data.percent === 1) {
      setTimeout(() => reset(container, svg), 5e3);
    }

    update(percent);
  });
};

module.exports = { init };
