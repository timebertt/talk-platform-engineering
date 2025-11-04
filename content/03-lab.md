# Lab Exercises

<https://github.com/timebertt/platform-engineering-lab>

vvv

## Prerequisites

Please double-check:

- Connectivity to [DHBW Cloud](https://dhbw.cloud/)
- Command line terminal available
- Code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))
- [Docker Desktop](https://docs.docker.com/get-docker/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed
- [GitHub](https://github.com/) account ready
- Git installed and [authenticated with GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#authenticating-with-the-command-line)

<!-- .element: class="checklist" -->

vvv

## Cluster Credentials

![Lab](../assets/lab.jpg)
<!-- .element: class="r-stretch" -->

➡️ Get them in [Moodle](https://moodle.dhbw-mannheim.de/course/section.php?id=103110)

vvv

## Get Started 🚀

Run a quick test to verify your setup:

```bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --type=LoadBalancer --port=80
kubectl get svc nginx -oyaml | yq '.status.loadBalancer.ingress[].ip' # choose one
curl http://<LOAD_BALANCER_IP>
```
