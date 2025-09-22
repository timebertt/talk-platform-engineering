/*
  Inject QR codes into predefined anchors on the slides.
  This plugin finds all `a` elements with class `qr-code` and injects their href as a QR code into the first child `img`
  element. If no child `img` element exists, it is created automatically.

  Example:
    <a href="https://github.com/timebertt" class="qr-code"></a>
*/

import QRCode from 'qrcode';

const pluginClass = 'qr-code';

export default () => {
  return {
    id: 'qr-code',
    init: (deck) => {
      deck.on('ready', async () => {
        // find all `a` tags with our class
        for (let link of deck.getSlidesElement().querySelectorAll('a.' + pluginClass)) {
          if (!link.href) {
            continue;
          }

          // find or create child img element
          let img = link.querySelector('img');
          if (!img) {
            img = document.createElement('img');
            link.appendChild(img)
          }

          try {
            let svg = await new Promise((resolve, reject) => {
              QRCode.toString(link.href, {type: 'svg', scale: 10, margin: 1}, (err, svg) => {
                if (err)
                  return reject(err);
                resolve(svg);
              });
            });

            // use img tag + data URL (inline source)
            // img is included by all stylesheets by default, other tags like canvas are not
            img.src = 'data:image/svg+xml;base64,' + window.btoa(svg);
          } catch (err) {
            console.error('failed to generate QR code for link: ' + err);
          }
        }
      });
    }
  };
}
