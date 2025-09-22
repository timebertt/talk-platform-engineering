/*
  Inject a QR code and link into predefined elements on the slides.
  This plugin uses the SLIDES_URL macro injected during build time (DefinePlugin) to determine the URL to display.
  The slides QR code is displayed on all `img` elements with class `slides-qr-code`.
  The slides link is displayed on all `a` elements with class `slides-qr-code`.

  Example:
    <img class="slides-qr-code"></img>
    <!-- .element: class="r-stretch" -->

    <a class="slides-qr-code"></a>
*/

import QRCode from 'qrcode';

const pluginClass = 'slides-qr-code';

export default () => {
  return {
    id: 'slides-qr-code',
    init: (deck) => {
      const slidesURL = SLIDES_URL;
      if (!slidesURL)
        return;

      let url = new URL(slidesURL);
      // drop hash (slide number) and query (added in speaker view)
      url.hash = '';
      url.search = '';

      deck.on('ready', async () => {
        try {
          // generate QR code with link to slides and place it on `img` tags with our class
          let svg = await new Promise((resolve, reject) => {
            QRCode.toString(url.href, {type: 'svg', scale: 10, margin: 1}, (err, svg) => {
              if (err)
                return reject(err);
              resolve(svg);
            });
          });

          // use img tag + data URL (inline source)
          // img is included by all stylesheets by default, other tags like canvas are not
          let dataURL = 'data:image/svg+xml;base64,' + window.btoa(svg);

          for (let img of deck.getSlidesElement().querySelectorAll('img.' + pluginClass)) {
            img.src = dataURL;
          }
        } catch (err) {
          console.error('failed to generate slides QR code: ' + err);
        }

        // inject link to slides on `a` tags with our class
        for (let link of deck.getSlidesElement().querySelectorAll('a.' + pluginClass)) {
          link.href = url.href;
          link.text = url.href;
        }
      });
    }
  };
}
