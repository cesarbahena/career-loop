# Launching Career-Loop for Kubernetes Testing with Minikube

This guide provides step-by-step instructions to deploy and test the `career-loop` application on a local Kubernetes cluster using Minikube.

## Prerequisites

Ensure you have the following installed on your system:

*   **Minikube:** For running a local Kubernetes cluster.
*   **kubectl:** For interacting with the Kubernetes cluster.
*   **Docker:** For building container images.
*   **Node.js & npm (or yarn/pnpm):** For frontend development tools.
*   **Python & pip:** For backend and scraper development tools.

## Steps to Launch and Test

### 1. Start Minikube Cluster

First, ensure your Minikube cluster is running. If it's not, start it.

```bash
minikube start
```

### 2. Configure Docker to use Minikube's Daemon

This step is crucial. It tells your local Docker client to build images directly inside Minikube's Docker environment, making them instantly available to your Minikube cluster without needing to push them to an external registry.

**Important:** You must run this command in **every new terminal session** where you plan to build Docker images for Minikube.

```bash
eval $(minikube docker-env)
```

### 3. Build Docker Images

Now, build the Docker images for each of your services. Make sure you are in the project's root directory (`career-loop/`) when running these commands.

```bash
# Build Backend image
docker build -t career-loop-backend:latest -f backend/Dockerfile .

# Build Frontend image
docker build -t career-loop-frontend:latest -f frontend/Dockerfile .

# Build Scraper image (note the context path for the scraper)
docker build -t career-loop-scraper:latest -f services/scraper/Dockerfile services/scraper
```

### 4. Apply Kubernetes Manifests

Once the images are built and available in Minikube's Docker daemon, deploy your application using the Kubernetes manifests located in the `k8s/` directory.

```bash
kubectl apply -f k8s/
```

### 5. Check Deployment Status

Monitor the status of your pods in the `career-loop` namespace until they are all running. It might take a few moments for all services to start up.

```bash
kubectl get pods -n career-loop
kubectl get deployments -n career-loop
kubectl get services -n career-loop
```

### 6. Access the Application via Ingress

To access the frontend and backend API from your web browser, you'll need to enable Minikube's Ingress controller and tunnel external traffic to it.

#### a. Enable Minikube Ingress Addon

Ensure the Ingress controller is enabled in your Minikube cluster:

```bash
minikube addons enable ingress
```

#### b. Start Minikube Tunnel

Open a **new terminal window** specifically for this step. The `minikube tunnel` command will run indefinitely in the background, creating a network route that allows external access to your Ingress resources.

```bash
minikube tunnel
```

**You will be prompted for your `sudo` password.** Please run this command yourself in the new terminal. Keep this terminal window open as long as you want to access your application.

#### c. Get Ingress IP/Hostname

Once `minikube tunnel` is running (in the separate terminal), switch back to your original terminal and get the Ingress IP address.

```bash
kubectl get ingress -n career-loop
```

Look for the `ADDRESS` column in the output. This IP address (or hostname if configured) is where your application is accessible.

#### d. Access in Browser

Open your web browser and navigate to the Ingress IP address (e.g., `http://<INGRESS_IP_ADDRESS>`).

*   The **frontend dashboard** should be accessible at `http://<INGRESS_IP_ADDRESS>/`.
*   The **backend API's health endpoint** should be accessible at `http://<INGRESS_IP_ADDRESS>/api/health`.

### Troubleshooting

*   If pods are not starting, check logs: `kubectl logs <pod-name> -n career-loop`.
*   Ensure `minikube tunnel` is running if you cannot access the Ingress.
*   Verify Docker images are correctly built and loaded into Minikube's daemon.
