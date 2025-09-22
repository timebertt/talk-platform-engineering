# Platform Engineering Lecture

_A Practical Guide to the Cloud-Native Toolkit_

[![Netlify Status](https://api.netlify.com/api/v1/badges/e340e09a-a0ff-47ef-9d7d-5b07bbd05bd8/deploy-status)](https://app.netlify.com/projects/talk-platform-engineering/deploys)

Take me to the [slides](https://talks.timebertt.dev/platform-engineering/)!

## About

This is a lecture by [@timebertt](https://github.com/timebertt) at [DHBW Mannheim](https://www.mannheim.dhbw.de/).
It is the first part of the Data Engineering module (third year) of the [Data Science and Artificial Intelligence course](https://www.mannheim.dhbw.de/studium/studienangebot/bachelor-studienangebot/data-science-kuenstliche-intelligenz).

### Abstract

TODO

### References

TODO

## Presenting and Editing the Slides

Slides are built in Markdown using [reveal.js](https://revealjs.com/), packaged with [webpack](https://webpack.js.org/), and deployed with [Netlify](https://www.netlify.com/).

### Prerequisites

Install a recent `node` version. Preferably, the one specified in [`.nvmrc`](./.nvmrc) (e.g., using [nvm](https://github.com/nvm-sh/nvm)).

```bash
nvm use
```

Install the dependencies:

```bash
npm install
```

### Present Locally

Perform a production build and serve the slides from the `dist` folder:

```bash
NODE_ENV=production npm run build
npm run serve
```

Important: Set `NODE_ENV=production` to yield the same build outputs as in production deploys to Netlify.
If you don't set it, the QR will link to a local IP instead of the canonical URL, for example.

### Edit Locally

Run a dev server with hot-reload and open the slides in the browser:

```bash
npm start
```

Now, start editing the [content](./content) files.
When saving, slides are automatically rebuilt and refreshed in the browser.

> Note, that `npm start` doesn't write the output to `dist`.

### Build Locally

Run a full build and write output files to `dist`:

```bash
npm run build
```

Now, output files can be inspected in the `dist` folder.
Also, the slides can be served locally from the `dist` folder (no hot-reload):

```bash
npm run serve
```

Using the above will output non-minimized files.
Set `NODE_ENV=production` to enable minimization as it is done in Netlify builds:

```bash
NODE_ENV=production npm run build
```

## Netlify Deploys

Netlify builds and publishes new commits to the `main` branch on <https://talk-platform-engineering.netlify.app/>.

<https://github.com/timebertt/talks> contains a [Netlify proxy configuration](https://github.com/timebertt/talks/blob/master/netlify.toml) to make the slides available at <https://talks.timebertt.dev/platform-engineering/>.

The Netlify site is configured to publish deploy previews for pull requests to the `main` branch and for pushes to arbitrary other branches.
