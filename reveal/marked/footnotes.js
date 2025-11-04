// Marked extension for numbered, in-order markdown footnote references in reveal.js

// --- Global footnote state ---
const globalFootnoteOrder = [];
const globalFootnoteDefs = {};

export default function markedFootnoteReferences() {
  return {
    hooks: {
      preprocess(markdown) {
        // Extract footnote definitions from this file and add to global
        const footnoteDefRegex = /^\[\^(.+?)\]:\s*<([^>]+)>/gm;
        let match;
        while ((match = footnoteDefRegex.exec(markdown))) {
          if (!(match[1] in globalFootnoteDefs)) {
            globalFootnoteDefs[match[1]] = match[2].trim();
          }
        }

        // Remove footnote definitions from markdown
        markdown = markdown.replace(footnoteDefRegex, '').trim();

        // Replace references with global numbers in order of first appearance, linking to the URL from global defs
        let refRegex = /\[\^(.+?)\]/g;
        markdown = markdown.replace(refRegex, (m, id) => {
          let idx = globalFootnoteOrder.indexOf(id);
          if (idx === -1) {
            globalFootnoteOrder.push(id);
            idx = globalFootnoteOrder.length - 1;
          }
          const url = globalFootnoteDefs[id];
          if (url) {
            return `<span class=\"footnote-ref\"><a href=\"${url}\" target=\"_blank\" rel=\"noopener\">[${idx+1}]</a></span>`;
          } else {
            return `<span class=\"footnote-ref\">[${idx+1}]</span>`;
          }
        });

        return markdown;
      }
    }
  };
}
