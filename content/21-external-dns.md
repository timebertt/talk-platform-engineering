# Managing DNS Records

### external-dns

vvv

![DNS record missing](../assets/dns-missing.jpg)
<!-- .element: class="r-stretch" -->

vvv

## Motivation

- We need DNS records for our applications
- Manually managing DNS records is tedious and error-prone
- Dynamic environments (like Kubernetes) need automated DNS updates
- external-dns keeps DNS records in sync with your cluster resources
- Reduces toil and risk of stale or missing records

vvv

## external-dns

- Kubernetes controller that automates DNS record management
- Maintained by the Kubernetes community: [kubernetes-sigs/external-dns](https://github.com/kubernetes-sigs/external-dns/)
- Supports different sources of record configuration: `Ingress`, `Gateway`, `Service`, etc.
- Supports many DNS providers: Google Cloud DNS, AWS Route53, Azure DNS, etc.
- Declarative infrastructure: DNS state should match the cluster state

vvv

## Source: Ingress

```yaml[1-7|11-15|7,14-15]
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: podinfo
spec:
  rules:
  - host: podinfo.example.com
    http:
      paths:
      # ...
status:
  loadBalancer:
    ingress:
    - ip: 141.72.176.127
    # ...
```

vvv

## Source: Service

```yaml[1-4,7-11|12-16|5-6,15-16]
apiVersion: v1
kind: Service
metadata:
  name: podinfo
  annotations:
    external-dns.alpha.kubernetes.io/hostname: podinfo.example.com
spec:
  type: LoadBalancer
  selector:
    app: podinfo
  # ...
status:
  loadBalancer:
    ingress:
    - ip: 141.72.176.127
    # ...
```

vvv

## Record Ownership

- external-dns uses `TXT` records to track record ownership ("registry")
- Puts its owner ID in an additional `TXT` record
- When updating, checks if it owns the record
- Prevents conflicts with records managed manually or on other clusters
- Ensures external-dns only manages its own records

```bash
$ dig +short a-podinfo.example.com TXT
"heritage=external-dns,external-dns/owner=<id>,external-dns/resource=ingress/podinfo-prod/podinfo"
```

vvv

## Lab DNS Setup

- Until [dyndns.dhbw.cloud](https://dyndns.dhbw.cloud) is fully functional, we use a shared public zone managed in Google Cloud DNS
- Google Cloud Project: `timebertt-dhbw`
- Zone: `dski23a.timebertt.dev.`
- Zone name: `dski23a-timebertt-dev`
- All students can create records in this zone
- A shared service account key is provided for access

vvv

## Lab DNS Setup: Preventing Conflicts ⚠️

- Each cluster uses a unique subdomain:  
  `<cluster-name>.dski23a.timebertt.dev`
  - Example: `student-abcd.dski23a.timebertt.dev`
- Each cluster uses a unique external-dns owner ID:  
  `<cluster-name>`
  - Example: `student-abcd`

vvv

## Lab DNS Setup: Don't Leak the Key! 🔐

![Don't commit secrets to Git](../assets/secrets-git.jpg)
<!-- .element: class="r-stretch" -->

ℹ️ We will cover secure secrets management later.

vvv

## Lab: external-dns

- Get the service account key from [Moodle](https://moodle.dhbw-mannheim.de/course/section.php?id=103110) and create a Kubernetes secret in the `external-dns` namespace (don't commit the key to Git!):
  ```bash
  kubectl create namespace external-dns
  kubectl -n external-dns create secret generic google-clouddns --from-file service-account.json=key.json
  ```
- [Deploy external-dns](https://kubernetes-sigs.github.io/external-dns/latest/charts/external-dns/) in the `external-dns` namespace using a Flux `HelmRelease`.
- Configure the [Google Cloud DNS provider](https://kubernetes-sigs.github.io/external-dns/latest/docs/tutorials/gke/#deploy-externaldns).
- Enable the sources: `ingress` and `service`.
- Configure the `TXT` registry with owner ID `<cluster-name>`.
- Update the `Ingress` manifests of the `podinfo` application from the [Kustomize Lab](#/lab-kustomize) to use different hostnames under your cluster's subdomain, e.g., `podinfo.<cluster-name>.dski23a.timebertt.dev`.
- Verify access to the application environments using `curl` with the configured hostnames.

<!-- .element: style="font-size: 0.8em;" -->
