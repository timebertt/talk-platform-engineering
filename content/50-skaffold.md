# Bonus: Local Development

### Build, Push, and Deploy With Skaffold and Kind

vvv

## Problem: Slow Development Cycle

![Dev cycle takes too long](../assets/dev-cycle-too-long.png)
<!-- .element: class="r-stretch" -->

vvv

## Skaffold and Local Clusters to the Rescue!

<!-- .slide: class="center" -->

vvv

## Lab: Skaffold

- Create a local cluster in a Docker container using [kind](https://kind.sigs.k8s.io/).
- Create a simple web application using the programming language and framework of your choice (e.g., Node.js with Express, Python with Flask, Go with net/http, etc.)
- Containerize the application using a Dockerfile, a [buildpack](https://buildpacks.io/), or a language-specific build tool like [ko](https://ko.build/).
- Add Kubernetes YAML manifests to deploy the application in the cluster (e.g., Deployment, Service).
- Install [Skaffold](https://skaffold.dev/) and set up a configuration file (`skaffold.yaml`) including the build and deploy settings for your application.
- Use `skaffold run` to build the Docker image, load it into the kind cluster, and deploy the application to the local Kubernetes cluster.[^kubeconfig]
- Make changes to the application code and use `skaffold dev` to automatically rebuild and redeploy the application in the cluster.

<!-- .element: style="font-size:0.7em;" -->

[^kubeconfig]: Remember to set the `KUBECONFIG` environment variable to point to the kind cluster's kubeconfig file. If Skaffold detects a local kind cluster, it will skip pushing the image to a remote registry and load it directly into the kind cluster, which speeds up the development workflow and eliminates the need for a remote image registry.
