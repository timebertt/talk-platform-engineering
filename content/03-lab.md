# Lab Exercises

<https://github.com/timebertt/platform-engineering-lab>

vvv

## Lab Exercises

- Each student gets their own Kubernetes cluster in the [DHBW Cloud](https://dhbw.cloud/)
- Tasks are presented in the slides
- Solutions and explanations can be found in the `labs` directory of the [platform-engineering-lab repository](https://github.com/timebertt/platform-engineering-lab)

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

## Lab: Get Started

Run a quick test to verify your setup:

```bash
# Configure kubectl to use the downloaded kubeconfig file 
export KUBECONFIG=<path-to-your-kubeconfig-file>

kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --type=LoadBalancer --port=80
kubectl get svc nginx # pick one external IP
curl http://<LOAD_BALANCER_IP>
```
