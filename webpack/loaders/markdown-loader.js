/**
 * This custom webpack loader asynchronously finds all local image references
 * in a markdown file, uses webpack's resolver to process them, and replaces
 * the original paths with the final hashed URLs.
 * It then returns the processed markdown content as a string to the next loader.
 */
module.exports = function (source) {
  // Tell webpack this loader is asynchronous.
  const callback = this.async();
  const markdownImageRegex = /!\[(.*?)]\((.*?)\)/g;
  const htmlImageRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;

  function processImage(match, type) {
    let fullMatch, imagePath, altText;
    if (type === 'markdown') {
      [fullMatch, altText, imagePath] = match;
    } else {
      [fullMatch, imagePath] = match;
    }
    // Ignore external images.
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return;
    }

    return new Promise((resolve, reject) => {
      // Use webpack's importModule to process the image path.
      // The result of the file-loader will be the final image path in source.default.
      this.importModule(imagePath, this.getOptions(), (err, source) => {
        if (err) return reject(err);
        let replacement;
        if (type === 'markdown') {
          replacement = `![${altText}](${source.default})`;
        } else {
          replacement = fullMatch.replace(imagePath, source.default);
        }
        resolve({
          original: fullMatch,
          replacement
        });
      });
    });
  }

  const promises = [];
  let match;
  while ((match = markdownImageRegex.exec(source)) !== null) {
    const promise = processImage.call(this, match, 'markdown');
    if (promise) promises.push(promise);
  }
  while ((match = htmlImageRegex.exec(source)) !== null) {
    const promise = processImage.call(this, match, 'html');
    if (promise) promises.push(promise);
  }

  // Process all image imports.
  Promise.all(promises)
    .then(results => {
      let finalSource = source;
      // Replace the original image reference with the final hashed image path.
      for (const result of results) {
        finalSource = finalSource.replace(result.original, result.replacement);
      }
      // Return the final, processed markdown string.
      callback(null, finalSource);
    })
    .catch(err => {
      callback(err);
    });
};
