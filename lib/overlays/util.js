/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const addHtml = (html, parent) => {
  const div = document.createElement('div');
  const nodes = [];

  div.innerHTML = html.trim();

  while (div.firstChild) {
    nodes.push((parent || document.body).appendChild(div.firstChild));
  }

  return nodes;
};

const appendElementHead = (element) => {
  document.head.appendChild(element);
};

const addCss = (css) => {
  const style = document.createElement('style');

  style.type = 'text/css';

  if (css.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  // append the stylesheet for the svg
  appendElementHead(style);
};

const createScript = () => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  return script;
};

/**
 * Adds src to script tag
 * and adds it into the dom.
 * @param {String} path
 * <script type="text/javascript" src={path}></script>
 */
const addJSSrc = (path) => {
  const script = createScript();
  script.src = path;
  appendElementHead(script);
};

/**
 * Adds content inside script tag
 * and adds it into the dom.
 * @param {String} content
 * <script type="text/javascript">content</script>
 */
const addJSText = (content) => {
  const script = createScript();
  script.text = content;
  document.head.appendChild(script);
};

const socketMessage = (socket, handler) => {
  socket.addEventListener('message', (message) => {
    const { action, data } = JSON.parse(message.data);
    handler(action, data);
  });
};

module.exports = {
  addCss,
  addHtml,
  socketMessage,
  addJSSrc,
  addJSText
};
