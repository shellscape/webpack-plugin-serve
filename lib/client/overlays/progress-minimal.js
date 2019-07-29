/*
  Copyright © 2018 Andrew Powell, Matheus Gonçalves da Silva

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { addCss, addHtml } = require('./util');

const ns = 'wps-progress-minimal';
const html = `
<div id="${ns}" class="${ns}-hidden">
  <div id="${ns}-bar"></div>
</div>
`;
const css = `
#${ns} {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: 100vw;
  z-index: 2147483645;
}

#${ns}-bar {
  width: 0%;
  height: 4px;
  background-color: rgb(186, 223, 172);
}

@keyframes ${ns}-fade {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}

.${ns}-disappear {
  animation: ${ns}-fade .3s;
  animation-fill-mode: forwards;
  animation-delay: .5s;
}

.${ns}-hidden {
  display: none;
}
`;

let hideOnPageVisible = false;

const update = (percent) => {
  const bar = document.querySelector(`#${ns}-bar`);
  bar.style.width = `${percent}%`;
};

const reset = (wrapper) => {
  wrapper.classList.add(`${ns}-disappear`);
};

const init = (options, socket) => {
  if (options.firstInstance) {
    document.addEventListener('DOMContentLoaded', () => {
      addCss(css);
      addHtml(html);

      const wrapper = document.querySelector(`#${ns}`);
      wrapper.addEventListener('animationend', () => {
        update(0);
        wrapper.classList.add(`${ns}-hidden`);
      });
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && hideOnPageVisible) {
        const wrapper = document.querySelector(`#${ns}`);
        reset(wrapper);
        hideOnPageVisible = false;
      }
    });
  }

  socket.addEventListener('message', (message) => {
    const { action, data } = JSON.parse(message.data);

    if (action !== 'progress') {
      return;
    }

    const percent = Math.floor(data.percent * 100);
    const wrapper = document.querySelector(`#${ns}`);

    wrapper.classList.remove(`${ns}-hidden`, `${ns}-disappear`);

    if (data.percent === 1) {
      if (document.hidden) {
        hideOnPageVisible = true;
      } else {
        reset(wrapper);
      }
    } else {
      hideOnPageVisible = false;
    }

    update(percent);
  });
};

module.exports = {
  init
};
