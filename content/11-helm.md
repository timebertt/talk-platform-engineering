# Deployment Tooling

### Helm

vvv

## Helm

> The package manager for Kubernetes

- Uses reusable, parameterized templates called "charts"
- Handles configuration, upgrades, and rollbacks
- Large ecosystem of pre-built charts for popular software
- Simplifies deployment of "off-the-shelf" applications

vvv

## Helm Concepts

- **Chart**: A package of Kubernetes resources (e.g., collection of YAML templates)
- **Values**: Configuration data to customize a chart (parameters)
- **Release**: An instance of a chart running in a cluster
- **Repository**: A collection of published charts (e.g., [Artifact Hub](https://artifacthub.io/))

vvv

## Writing a Helm Chart

TL;DR: Use `helm create` to scaffold a chart

```text
$ helm create slides

slides/
├── .helmignore   # Contains patterns to ignore when packaging Helm charts.
├── Chart.yaml    # Information about your chart
├── values.yaml   # The default values for your templates
├── charts/       # Charts that this chart depends on
└── templates/    # The template files
    └── tests/    # The test files
```

vvv

## `Chart.yaml` Example

```yaml[]
# Chart.yaml
apiVersion: v2
type: application
name: slides
description: A Helm chart for deploying lecture slides
version: 0.1.0 # version shown in the chart repository
appVersion: "1.0.0" # typically used as the application image tag
```

vvv

## Example Template

```gotemplate[1-6|7-8|10-16|17-21]
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "myapp.fullname" . }}
  labels:
    app: {{ include "myapp.name" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  # ...
  template:
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: {{ .Values.service.port }}
        env:
        {{- range $key, $value := .Values.env }}
        - name: {{ $key }}
          value: "{{ $value }}"
        {{- end }}
```

vvv

## Publishing Charts to OCI Repositories

- Package chart:
  ```bash
  helm package ./slides
  # creates slides-0.1.0.tgz
  ```
- Push to an OCI registry:
  ```bash
  helm registry login ghcr.io
  helm push slides-0.1.0.tgz oci://ghcr.io/timebertt/charts
  ```
- Install from OCI registry:
  ```bash
  helm install myapp oci://ghcr.io/timebertt/charts/slides --version 0.1.0
  ```

vvv

## Consuming Community Charts

- Add a repository and fetch its charts:
  ```bash
  # OCI repository (newer, preferred)
  helm repo add prometheus-community oci://ghcr.io/prometheus-community/charts/prometheus
  # HTTPS repository (older)
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

  helm repo update
  ```
- Customize and install a chart:
  ```bash
  helm install my-prometheus prometheus-community/prometheus \
    --namespace monitoring \
    --set server.persistentVolume.size=10Gi \
    --values my-values.yaml
  ```

vvv

## More Helm Commands

- `helm search repo <keyword>` – Search for charts
- `helm show values <chart>` – Show configurable values of a chart
- `helm list` – List releases installed in the cluster
- `helm upgrade --install ...` – Install or upgrade a release
- `helm uninstall <release>` – Remove a release

vvv

## Lab: Helm

- Use [Helm](https://helm.sh/) to deploy the [podinfo](https://github.com/stefanprodan/podinfo) application – as done previously in the [Kustomize lab](#/lab-kustomize).
- To prevent conflicts with the previous lab, use new namespaces `podinfo-helm-dev` and `podinfo-helm-prod`.
- Set the service ports to `12002` and `12003` respectively.

vvv

![Kustomize vs. Helm](../assets/kustomize-vs-helm.jpg)
<!-- .element: class="r-stretch" -->

vvv

## Kustomize vs. Helm

| Kustomize                       | Helm                         |
|---------------------------------|------------------------------|
| Native Kubernetes tool          | Separate tool                |
| Composes and transforms objects | Go templates over YAML files |
| Simpler, less abstraction       | More powerful customization  |
| No built-in distribution        | Chart repositories           |
| No resource tracking            | Release tracking, rollbacks  |

vvv

## TL;DR: When to Choose What?

- Use Helm for consuming and distributing reusable application charts
- Use Kustomize for everything else, especially non-reusable manifests
