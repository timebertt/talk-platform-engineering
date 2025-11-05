// Marked extension for numbered, in-order markdown footnote references in reveal.js

const globalLinkDefs = {};
const globalLinkOrder = [];

export default function markedFootnoteReferences() {
  return {
    hooks: {
      preprocess(markdown) {
        const slideFootnoteDefs = {};
        const slideFootnoteOrder = [];

        // Extract link definitions from this file and add to global
        const linkDefRegex = /^\[\^(.+?)\]:\s*<([^>]+)>$/gm;
        let match;
        while ((match = linkDefRegex.exec(markdown))) {
          const id = match[1];
          if (!(id in globalLinkDefs)) {
            globalLinkDefs[id] = match[2].trim();
          }
        }

        // Remove link definitions from markdown
        markdown = markdown.replace(linkDefRegex, '').trim();

        // Extract footnote definitions from this slide
        const footnoteDefRegex = /^\[\^(.+?)\]:\s*(.+)$/gm;
        while ((match = footnoteDefRegex.exec(markdown))) {
          const id = match[1];
          if (!(id in slideFootnoteDefs)) {
            slideFootnoteDefs[id] = match[2].trim();
          }
        }

        // Remove footnote definitions from markdown
        markdown = markdown.replace(footnoteDefRegex, '').trim();

        // Replace link references with global numbers in order of first appearance, linking to the URL from global defs
        // Replace footnote references with per-slide numbers in order of first appearance
        let refRegex = /\[\^(.+?)\]/g;
        markdown = markdown.replace(refRegex, (m, id) => {
          // handle footnote reference
          if (id in slideFootnoteDefs) {
            let idx = slideFootnoteOrder.indexOf(id);
            if (idx === -1) {
              slideFootnoteOrder.push(id);
              idx = slideFootnoteOrder.length - 1;
            }

            return `<span class=\"footnote-ref\">${idx + 1}</span>`;
          }

          // handle link reference
          if (id in globalLinkDefs) {
            let idx = globalLinkOrder.indexOf(id);
            if (idx === -1) {
              globalLinkOrder.push(id);
              idx = globalLinkOrder.length - 1;
            }

            return `<span class=\"link-ref\"><a href=\"${globalLinkDefs[id]}\" target=\"_blank\" rel=\"noopener\">[${idx + 1}]</a></span>`;
          }

          throw new Error(`No link/footnote definition found for [^${id}].`);
        });

        // Append used footnote definitions at the end of the slide in order of appearance
        if (slideFootnoteOrder.length > 0) {
          markdown += '\n\n<div class="footnote-defs">\n\n';
          slideFootnoteOrder.forEach((id, index) => {
            markdown += `1. ${slideFootnoteDefs[id]}\n`;
          });
          markdown += '\n</div>\n';
        }

        return markdown;
      }
    }
  };
}
