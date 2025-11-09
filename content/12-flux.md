# Continuous Deployment

### GitOps With Flux

vvv

## What is GitOps?

- _The_ operating model for cloud native applications and infrastructure
- Uses **Git as the single source of truth** for declarative infrastructure and applications
- An automated system reconciles the live state with the state in Git
- Examples of cloud native GitOps tools: [Flux](https://fluxcd.io/), [Argo CD](https://argo-cd.readthedocs.io/)

vvv

## GitOps Principles

1. **Declarative**: The entire system is described declaratively in a Git repository.
2. **Versioned**: The desired state is versioned in Git, providing a trail of changes.
3. **Pulled Automatically**: Agents automatically pull the desired state from Git.
4. **Continuously Reconciled**: The system is continuously reconciled to match the desired state.

vvv

## Flux Overview

- CNCF graduated project for GitOps in Kubernetes
- A toolkit[^gotk] for keeping Kubernetes clusters in sync with sources of configuration
- Kubernetes-native: uses custom resources to define desired state
- Runs as a set of controllers in the cluster and pulls from remote sources
- Flux CLI for bootstrapping Flux installations and managing resources

[^gotk]: Often referred to as the "GitOps Toolkit" ("gotk" for short)

vvv

## Flux Concepts

- **Sources**: Define where your manifests and charts are:
  - `GitRepository`, `HelmRepository`, `OCIRepository`, `Bucket`
- **Reconcilers**: Apply the manifests from sources:
  - `Kustomization` for Kustomize overlays and raw/rendered manifests
  - `HelmRelease` for Helm charts

vvv

## Flux Architecture

![Flux Architecture](../assets/flux-architecture.png)
<!-- .element: class="r-stretch" -->

vvv

## Getting Started with Flux

```bash[1-2|4-6|8-9|11-17]
# Install the Flux CLI
brew install fluxcd/tap/flux

# Authenticate with GitHub (using the GitHub CLI or a personal access token)
export GITHUB_USER=timebertt
export GITHUB_TOKEN=$(gh auth token)

# Check prerequisites
flux check --pre

# Create your GitHub repository and bootstrap Flux on the cluster
flux bootstrap github \
  --owner=$GITHUB_USER \
  --repository=platform-engineering-lab \
  --branch=main \
  --path=./clusters/dhbw \
  --personal
```

vvv

## `GitRepository`

```yaml[]
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: platform-engineering-lab
  namespace: flux-system
spec:
  url: https://github.com/timebertt/platform-engineering-lab
  ref:
    branch: main
  interval: 1m
```

vvv

## `Kustomization`

```yaml[]
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: podinfo-dev
  namespace: flux-system
spec:
  sourceRef:
    kind: GitRepository
    name: platform-engineering-lab
  path: ./deploy/podinfo/development
  interval: 10m
  prune: true
```

vvv

## `HelmRepository`

```yaml[]
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: podinfo
  namespace: flux-system
spec:
  interval: 15m
  url: https://stefanprodan.github.io/podinfo
```

vvv

## `HelmRelease`

```yaml[]
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: podinfo
  namespace: flux-system
spec:
  interval: 5m
  chart:
    spec:
      chart: podinfo
      version: '6.9.0'
      sourceRef:
        kind: HelmRepository
        name: podinfo
        namespace: flux-system
  values:
    replicaCount: 2
```

vvv

## Aside: OCI Artifacts

Open Container Initiative (OCI) artifacts for distributing not just container images, but also other artifacts like Helm charts and configuration data

```bash[1-5|7-9]
flux push artifact \
  oci://ghcr.io/timebertt/platform-engineering-lab/manifests:$(git rev-parse --short HEAD) \
  --path="./deploy" \
  --source="https://github.com/timebertt/platform-engineering-lab" \
  --revision="main@sha1:$(git rev-parse HEAD)"

flux tag artifact \
  oci://ghcr.io/timebertt/platform-engineering-lab/manifests:$(git rev-parse --short HEAD) \
  --tag latest
```

vvv

## Aside: OCI Artifacts (2)

```yaml[1-10|11-23]
apiVersion: source.toolkit.fluxcd.io/v1
kind: OCIRepository
metadata:
  name: platform-engineering-lab
  namespace: flux-system
spec:
  interval: 10m
  url: oci://ghcr.io/timebertt/platform-engineering-lab/manifests
  ref:
    tag: v0.1.0
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: podinfo-prod
  namespace: flux-system
spec:
  sourceRef:
    kind: OCIRepository
    name: platform-engineering-lab
  path: ./podinfo/production
  interval: 10m
  prune: true
```

vvv

## Lab: Flux

- [Install Flux](https://fluxcd.io/flux/get-started/) in your cluster and deploy applications using GitOps.
- Create a personal GitHub repository to store your Flux configuration and your deployment manifests.
- Add your manifests for the `podinfo` application from the [Kustomize Lab](#/lab-kustomize) to the repository.
- Create `Kustomization` manifests to deploy the `podinfo` application in both the `development` and `production` environments.
- Commit and push the new manifests to the main branch of your GitHub repository.
- Verify that Flux deploys the application in both environments as expected.
- Bonus: install [Headlamp](https://headlamp.dev/) and use the [Flux plugin](https://github.com/headlamp-k8s/plugins/blob/main/flux) for visualizing the state of your GitOps deployments.

<!-- .element: style="font-size: 0.8em;" -->
