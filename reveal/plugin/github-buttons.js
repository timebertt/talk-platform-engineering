/*
  Reveal.js plugin to render GitHub buttons.
  Generate a GitHub button by adding an anchor tag with the class `github-button` and the appropriate `href` attribute.
  Use https://buttons.github.io/ to generate the button code.
*/

import {render} from 'github-buttons';

export default () => {
  return {
    id: 'github-buttons',
    init: (deck) => {
      deck.on('ready', async () => {
        // inject link to slides on `a` tags with our class
        for (let anchor of deck.getSlidesElement().querySelectorAll('a.github-button')) {
          render(anchor, function (el) {
            anchor.parentNode.replaceChild(el, anchor);
          });
        }
      });
    }
  };
}
