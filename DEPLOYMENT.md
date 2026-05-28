# Graph Sentinel - DigitalOcean Deployment Guide

This guide provides step-by-step instructions to deploy the Graph Sentinel application stack (Vite Frontend, Node Backend, and Python ML Anomaly Detection Service) to DigitalOcean.

We offer two deployment pathways:
- **Option A (Recommended & Cost-Effective)**: Deploying as a multi-container Docker Compose application on a single DigitalOcean Droplet VPS.
- **Option B (Fully Managed)**: Deploying using DigitalOcean App Platform (PaaS) using the provided App Spec file.

---

## Prerequisites
Before starting, ensure you have:
1. A DigitalOcean account.
2. A Supabase project set up. You will need your **Supabase URL** and **Anon API Key** (found under Project Settings -> API in your Supabase dashboard).

---

## Option A: Deploying on a DigitalOcean Droplet (Docker Compose)
This option runs the frontend (Nginx), Node backend, and Python ML service on a single VPS. It is the most cost-effective approach.

### Step 1: Spin up a DigitalOcean Droplet
1. Go to **Droplets** -> **Create Droplet**.
2. **Choose Region**: Select the datacenter closest to your target audience.
3. **Choose an Image**: Select **Ubuntu 22.04 LTS** or the **Docker One-Click App** (from the Marketplace tab, which comes with Docker and Docker Compose pre-installed).
4. **Choose Size**: Select the **Basic Plan**. We recommend selecting a CPU option with at least **2GB RAM** (e.g., $12/mo Premium Intel/AMD or regular $12/mo option) to handle TensorFlow execution comfortably.
5. **Authentication**: Choose **SSH Key** (highly recommended) or password.
6. Click **Create Droplet**.

---

### Step 2: Configure Virtual Swap Memory (Crucial for TensorFlow)
Even with 2GB of RAM, Python's TensorFlow can experience memory spikes during training or inference. Creating a swap file provides extra memory headroom and prevents Out-of-Memory (OOM) crashes.

Once logged into your droplet via SSH (`ssh root@your_droplet_ip`), run:
```bash
# 1. Create a 4GB swap file
sudo fallocate -l 4G /swapfile

# 2. Set file permissions
sudo chmod 600 /swapfile

# 3. Format as swap space
sudo mkswap /swapfile

# 4. Enable swap
sudo swapon /swapfile

# 5. Make swap persistent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 6. Verify swap is active
free -h
```

---

### Step 3: Clone Code and Set Up Environment Variables
1. Clone your project repository onto the droplet:
   ```bash
   git clone https://github.com/SagarAgarwal2/graph-sentinel.git
   cd graph-sentinel
   ```
2. Create a `.env` file in the root directory:
   ```bash
   nano .env
   ```
3. Paste the following configuration, replacing the placeholders with your actual Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   *Note: Docker Compose will automatically read these variables, injecting them into the Frontend container at build time and the Backend container at runtime.*

---

### Step 4: Build and Start the Application
Run Docker Compose to build the containers and launch them in detached mode (background):
```bash
docker compose up --build -d
```
Docker will now:
- Build the Python ML container installing `tensorflow`.
- Build the Node API backend container.
- Build the static Vite React frontend and load it into Nginx.
- Start all services on an internal network. Only Nginx (frontend) is exposed to the public on port `80`.

You can view the logs to verify everything started successfully:
```bash
docker compose logs -f
```

---

### Step 5: Set up SSL (HTTPS) with Let's Encrypt
In production, running over HTTP is insecure. You should assign a domain name to your Droplet IP and configure HTTPS.

#### Using Certbot on Nginx (Direct Host method):
If you have a domain name (e.g., `graphsentinel.com`) pointing to your Droplet IP:
1. Log into your droplet and install Certbot:
   ```bash
   sudo apt update
   sudo apt install -y certbot python3-certbot-nginx
   ```
2. Run Certbot to acquire and install the SSL certificate:
   ```bash
   sudo certbot --nginx -d graphsentinel.com -d www.graphsentinel.com
   ```
3. Certbot will automatically edit your host's Nginx configuration to enable SSL and set up automatic renewal.

*(Note: If you use this method, you should bind your Docker frontend service to port `127.0.0.1:8080` instead of port `80` in `docker-compose.yml`, and use the host's Nginx to reverse-proxy traffic from port `80`/`443` to `http://127.0.0.1:8080`.)*

---

## Option B: Deploying on DigitalOcean App Platform (Managed PaaS)
This option is a fully managed serverless deployment that connects directly to your GitHub repository and redeploys on every git push.

### Step 1: Push your code to GitHub
Ensure the new configuration files (`.do/app.yaml`, `Dockerfile.backend`, `Dockerfile.ml`, `requirements.txt`) are pushed to your GitHub repository.

### Step 2: Import the App Spec File
1. In the DigitalOcean Control Panel, click **Apps** -> **Create App**.
2. Select **GitHub** as the source and select your repository.
3. If DigitalOcean detects the `.do/app.yaml` file in your repository, it will automatically configure the components (Frontend static site, Node Backend service, and Python ML service) as outlined in the spec.
4. If it doesn't do it automatically:
   - Click **Import App Spec** at the bottom of the creation flow.
   - Paste the contents of `.do/app.yaml`.

---

### Step 3: Configure Environment Variables
In the App Platform dashboard, go to the **App-level Settings** (or individual component settings) and define the following variables:

#### App-Level / Component Variables:
1. **`VITE_SUPABASE_URL`**: Your Supabase URL (e.g. `https://xxx.supabase.co`).
2. **`VITE_SUPABASE_ANON_KEY`**: Your Supabase Anon Key.
3. **`VITE_API_BASE_URL`**: Set this to `/api` (This ensures the React client directs requests to the DO routing proxy).

These variables will automatically flow into the build pipeline for your static site (`frontend`) and runtime configurations for the Node service (`backend`).

### Step 4: Deploy
1. Click **Create Resources** / **Deploy**.
2. App Platform will build the React frontend, Node backend, and ML backend container.
3. Once the build finishes, DigitalOcean will output a public domain name (e.g., `graph-sentinel-xxx.ondigitalocean.app`) where your app is securely accessible via HTTPS.

---

## Maintenance and Logs

### Checking Logs (Droplet / Option A)
To view logs for specific components:
```bash
# Node backend logs
docker compose logs backend --tail=100 -f

# Python ML service logs
docker compose logs ml --tail=100 -f

# Nginx frontend logs
docker compose logs frontend --tail=100 -f
```

### Updating the Application
Whenever you push updates to your main repository, you can pull and restart the app on the Droplet:
```bash
git pull origin main
docker compose up --build -d
```
*(On App Platform, updates are automatic upon pushing to the designated GitHub branch).*
