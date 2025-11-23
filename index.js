import Reveal from 'reveal.js/dist/reveal.esm.js';

// plugins
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';
import Notes from 'reveal.js/plugin/notes/notes.esm.js';
import Search from 'reveal.js/plugin/search/search.esm.js';
import Zoom from 'reveal.js/plugin/zoom/zoom.esm.js';
import {Tldreveal} from 'tldreveal';
import GitHubButtons from './reveal/plugin/github-buttons';
import QRCode from './reveal/plugin/qr-code.js';
import SlidesQRCode from './reveal/plugin/slides-qr-code.js';

// marked extensions
import markedFootnoteReferences from './reveal/marked/footnotes.js';
import markedUnwrapImageParagraph from './reveal/marked/image-paragraph.js';

// styles
import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import 'highlight.js/styles/obsidian.css';
import 'tldreveal/dist/esm/index.css';
import './reveal/theme/dhbw.scss';
import './custom.scss';

// import all markdown files from ./content
// this loads them as webpack assets that our HTML template transforms into individual reveal sections
(ctx => {
  return ctx.keys().map(ctx);
})(require.context('./content/', false, /\.md$/));

// if the URL has ?export-pdf, add a class to the body to hide the link for downloading the PDF (via CSS)
const params = new URLSearchParams(window.location.search);
if (params.has('export-pdf')) {
  document.body.classList.add('export-pdf');
}

// Register marked customizations
const markdown = Markdown();
markdown.marked.use(markedFootnoteReferences());
markdown.marked.use(markedUnwrapImageParagraph());

// Register a capturing global event listener before tldreveal does.
// This disables the double click event listener of tldreveal to prevent accidental drawing.
window.addEventListener("dblclick", (event) => {
  // This stops other listeners on the same element (window)
  // from firing if they were added AFTER this one.
  event.stopImmediatePropagation();
}, true);

// initialize reveal.js and plugins
Reveal.initialize({
  plugins: [markdown, Highlight, Notes, Search, Zoom, Tldreveal, GitHubButtons, QRCode, SlidesQRCode],
  hash: true,
  history: true,
  center: false,
  controls: true,
  navigationMode: 'default',
  // disable scroll view on mobile devices
  scrollActivationWidth: null,
  slideNumber: true,
  // make hash links match slide number (zero-indexed by default)
  hashOneBasedIndex: true,

  width: 1200,
  height: 700,

  tldreveal: {
    isDarkMode: false,
    defaultStyles: {
      color: 'red'
    }
  }
});

// expose Reveal to the global scope for exporting PDFs with decktape
window.Reveal = Reveal;
