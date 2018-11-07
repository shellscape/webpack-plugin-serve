/*
  Copyright © 2018 Andrew Powell, Matheus Gonçalves da Silva

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { addJSText, addCss, addHtml } = require('./util');

const ns = 'wps_simple_progress';

const progressHtml = `
<div class="${ns} ${ns}-hidden">
  <div class="${ns}__bar"></div>
</div>
`;

const progressCss = `
.${ns} {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  width: 100vw;
}

.${ns}__bar {
  width: 0%;
  height: 4px;
  background-color: rgb(186, 223, 172);
  transition: width 1s ease-in-out;
}
.${ns}-hidden{
  display: none;
}
`;

const progressJS = `
var elem = document.querySelector(".${ns}__bar");
var progressWrapper = document.querySelector(".${ns}");

function ${ns}_reset() {
  progressWrapper.classList.add("${ns}-hidden");
  elem.style.width = '0%';
}

function ${ns}_setPercentage(percentage){
  elem.style.width = percentage + '%';
}`;

const update = (progress) => {
  wps_simple_progress_setPercentage(progress);
};

const init = (options, socket) => {
  document.addEventListener('DOMContentLoaded', () => {
    addHtml(progressHtml);
    addCss(progressCss);
    addJSText(progressJS);
  });

  socket.addEventListener('message', (message) => {
    const { action, data } = JSON.parse(message.data);

    if (action !== 'progress') {
      return;
    }

    const percent = Math.floor(data.percent * 100);

    document.querySelector(`.${ns}`).classList.remove(`${ns}-hidden`);

    if (data.percent === 1) {
      setTimeout(() => wps_simple_progress_reset(), 5e3);
    }

    update(percent);
  });
};

module.exports = {
  init
};
