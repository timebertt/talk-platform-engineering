# Observability

### Monitoring Your Application With the Prometheus Operator

vvv

![Prometheus Operator](../assets/prometheus-operator.png)
<!-- .element: class="r-stretch" -->

vvv

## Prometheus Operator

- Operator: custom Kubernetes controller managing instances of an application or component [^operator-pattern]
- Instances are managed via custom resources (defined via CustomResourceDefinitions)
- The [Prometheus Operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) manages Prometheus instances and their configuration
- Simplifies deployment and management of Prometheus in Kubernetes environments
- Supports dynamic configuration of scrape targets via Kubernetes resources

[^operator-pattern]: <https://kubernetes.io/docs/concepts/extend-kubernetes/operator/>

vvv

## Recap: Kube-Prometheus-Stack Overview

![Kube-Prometheus-Stack Architecture](../assets/kube-prometheus-stack.excalidraw.svg)
<!-- .element: class="r-stretch" -->

vvv

## The `Prometheus` Custom Resource

```yaml[1-7|8-10|11-19|20-22|23-29]
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: kube-prometheus-stack
  namespace: monitoring
spec:
  image: quay.io/prometheus/prometheus:v3.7.3
  # allows replication for HA, and sharding for horizontal scaling
  replicas: 1
  shards: 1
  # storage configuration
  retention: 10d
  retentionSize: 20GiB
  storage:
    volumeClaimTemplate:
      spec:
        resources:
          requests:
            storage: 20Gi
  # global intervals for scraping and rule evaluation
  scrapeInterval: 30s
  evaluationInterval: 30s
  # selectors for scare configurations
  serviceMonitorSelector:
    matchLabels:
      release: kube-prometheus-stack
  podMonitorSelector:
  ruleSelector:
  # ...
```

vvv

## Scrape Configuration for Applications

```yaml[1-7|8-10|11-19]
apiVersion: v1
kind: Service
metadata:
  name: my-application
  # labels allow the ServiceMonitor to select this Service as a scrape target
  labels:
    app: my-application
spec:
  selector:
    app: my-application
  ports:
  # typically, multiple dedicated ports:
  # one for actual application traffic, one for metrics
  - name: http
    port: 80
    targetPort: http
  - name: http-metrics
    port: 8080
    targetPort: http-metrics
```

vvv

## The `ServiceMonitor` Custom Resource

```yaml[1-7|8-12|13-17]
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-application
  labels:
    # must match Prometheus.spec.serviceMonitorSelector
    release: kube-prometheus-stack
spec:
  # must match the labels of the Service
  selector:
    matchLabels:
      app: my-application
  endpoints:
  # must match the port name in the Service
  - port: http-metrics
    path: /metrics
    interval: 10s
```

vvv

## Generated Prometheus Scrape Configuration

```yaml[1-2|3-7|8-17|18-23|24-28|29-30]
scrape_configs:
- job_name: serviceMonitor/<namespace>/my-application/0
  kubernetes_sd_configs:
  - role: endpoints
    namespaces:
      names:
      - <namespace>
  relabel_configs:
  - action: keep
    source_labels:
    - __meta_kubernetes_service_label_app
    - __meta_kubernetes_service_labelpresent_app
    regex: (my-application);true
  - action: keep
    source_labels:
    - __meta_kubernetes_endpoint_port_name
    regex: http-metrics
  - source_labels:
    - __meta_kubernetes_namespace
    target_label: namespace
  - source_labels:
    - __meta_kubernetes_pod_name
    target_label: pod
  - source_labels:
    - __meta_kubernetes_service_name
    target_label: job
    replacement: ${1}
  # ...
  scrape_interval: 10s
  metrics_path: /metrics
```

vvv

## Lab: Prometheus Operator

- Explore the `Prometheus` custom resource created in the [previous lab](#/lab-kube-prometheus-stack).
- Add a `ServiceMonitor` to scrape metrics from the `podinfo` application in the `podinfo-dev` and `podinfo-prod` namespaces.
  - Ensure the `Service` has a port for the metrics endpoint of the application.
  - Ensure that the `Service` labels match the `selector` in the `ServiceMonitor`.
  - Ensure that the `ServiceMonitor` labels match the `serviceMonitorSelector` in the `Prometheus` resource.
- Open the Prometheus web UI and verify that the `podinfo` metrics are being scraped.
- Query the `podinfo` metrics to calculate the request rate for the application per instance.
- Perform some HTTP requests or add a simple load generator to see the metrics in action.

<!-- .element: style="font-size:0.8em;" -->
