# Observability

### Monitoring Your Cluster With Kube-Prometheus-Stack

vvv

## What is Observability?

Observability signals, a.k.a. types of telemetry data:

- Metrics
- Logs
- Traces

vvv

## Kube-Prometheus-Stack Overview

TODO: architecture diagram

vvv

## Prometheus

vvv

## Grafana

vvv

## Alertmanager

vvv

## kube-state-metrics

vvv

## node-exporter

vvv

## cadvisor

vvv

## Aside: OpenTelemetry

- Open-source observability framework: [opentelemetry.io](https://opentelemetry.io/)

vvv

## Lab: Kube-Prometheus-Stack

- Install the [kube-prometheus-stack chart](https://artifacthub.io/packages/helm/prometheus-community/kube-prometheus-stack) using a Flux `HelmRelease` in the `monitoring` namespace
- Enable persistent storage for Prometheus[^prometheus-persistence] and Grafana[^grafana-persistence]
- Expose Grafana and Prometheus[^ingress-auth] via an Ingress, and ensure a DNS record and a TLS certificate for each Ingress
- Retrieve the generated Grafana credentials from the Kubernetes Secret
- Explore the pre-configured Grafana dashboards for monitoring the cluster's resource consumption

<!-- .element: style="font-size:0.8em;" -->

[^ingress-auth]: Usually, you should secure access to telemetry data using authentication mechanisms such as [OAuth2 Proxy](https://oauth2-proxy.github.io/oauth2-proxy/). For the sake of simplicity, this lab does not include authentication for Prometheus.
[^prometheus-persistence]: Hint: use the `prometheus.prometheusSpec.storageSpec` values to add a `volumeClaimTemplate`.
[^grafana-persistence]: Hint: use the `grafana.useStatefulSet` and `grafana.persistence` values. Possible values for the `grafana` section are documented in the [grafana chart](https://artifacthub.io/packages/helm/grafana/grafana).
