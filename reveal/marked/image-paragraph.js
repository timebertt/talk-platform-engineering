// Marked extension to unwrap paragraphs that contain only an image.
// E.g., instead of rendering
//   ![alt text](image.png)
// as
//   <p><img src="image.png" alt="alt text"></p>
// we want to render it as
//   <img src="image.png" alt="alt text">
// The r-stretch class doesn't work on images inside paragraphs.

export default function unwrapImageParagraph() {
  return {
    extensions: [{
      name: 'paragraph',
      renderer({tokens}) {
        if (tokens.length === 1 && tokens[0].type === 'image') {
          // If the paragraph contains only an image
          // return the image tag as-is, without the <p> wrapper
          return this.parser.parseInline(tokens);
        }

        // use default renderer
        return false;
      }
    }]
  };
}
