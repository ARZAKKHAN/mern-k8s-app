# 🚀 Complete Deployment Guide - Zero to Hero

Is guide mein har step detail mein hai. Bilkul zero se shuru karke production-ready deployment tak.

## 📋 Table of Contents

1. [Prerequisites Installation](#1-prerequisites-installation)
2. [Project Setup](#2-project-setup)
3. [Docker Images Build](#3-docker-images-build)
4. [MicroK8s Setup](#4-microk8s-setup)
5. [Helm Installation](#5-helm-installation)
6. [ArgoCD Installation](#6-argocd-installation)
7. [Application Deployment](#7-application-deployment)
8. [Testing & Verification](#8-testing--verification)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites Installation

### Step 1.1: Install Homebrew (agar already nahi hai)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 1.2: Install Docker Desktop

```bash
# Docker Desktop download karo
# https://www.docker.com/products/docker-desktop

# Ya Homebrew se install karo
brew install --cask docker

# Docker Desktop open karo aur start karo
open -a Docker
```

**Wait**: Docker Desktop ko fully start hone do (whale icon green hona chahiye)

### Step 1.3: Install MicroK8s

```bash
# MicroK8s install karo
brew install ubuntu/microk8s/microk8s

# MicroK8s install karo
microk8s install

# Status check karo
microk8s status --wait-ready
```

### Step 1.4: Install kubectl

```bash
# kubectl install karo
brew install kubectl

# Version check karo
kubectl version --client
```

### Step 1.5: Install Helm

```bash
# Helm install karo
brew install helm

# Version check karo
helm version
```

### Step 1.6: Git Setup

```bash
# Git install check karo
git --version

# Agar nahi hai to install karo
brew install git

# Git config karo
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 2. Project Setup

### Step 2.1: Project Directory Navigate Karo

```bash
# Apne project folder mein jao
cd /Users/arzakkhan/work/kt-Kubernetes/mern-k8s-app
```

### Step 2.2: Docker Hub Account Setup

1. **Docker Hub pe jao**: https://hub.docker.com
2. **Sign up/Login** karo
3. **Username** note kar lo (ye zaruri hai)

### Step 2.3: Docker Login

```bash
# Docker Hub mein login karo
docker login

# Username aur password enter karo
```

### Step 2.4: GitHub Repository Setup

```bash
# GitHub pe new repository banao: mern-k8s-app

# Local git initialize karo
git init

# Files add karo
git add .

# First commit karo
git commit -m "Initial commit: MERN app with K8s configs"

# GitHub remote add karo (apna username replace karo)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/mern-k8s-app.git

# Push karo
git branch -M main
git push -u origin main
```

---

## 3. Docker Images Build

### Step 3.1: Update Docker Image Names

**Important**: Sabse pehle apna Docker Hub username update karo

```bash
# Backend deployment file update karo
# File: k8s/backend-deployment.yaml
# Line: image: YOUR_DOCKERHUB_USERNAME/mern-backend:latest
# Replace: YOUR_DOCKERHUB_USERNAME with your actual username

# Frontend deployment file update karo
# File: k8s/frontend-deployment.yaml
# Line: image: YOUR_DOCKERHUB_USERNAME/mern-frontend:latest

# Helm values file update karo
# File: helm-chart/values.yaml
# Lines: 
#   backend.image.repository: YOUR_DOCKERHUB_USERNAME/mern-backend
#   frontend.image.repository: YOUR_DOCKERHUB_USERNAME/mern-frontend
```

### Step 3.2: Build Backend Image

```bash
# Backend directory mein jao
cd backend

# Docker image build karo (apna username replace karo)
docker build -t YOUR_DOCKERHUB_USERNAME/mern-backend:latest .

# Image verify karo
docker images | grep mern-backend

# Docker Hub pe push karo
docker push YOUR_DOCKERHUB_USERNAME/mern-backend:latest

# Project root mein wapas aao
cd ..
```

### Step 3.3: Build Frontend Image

```bash
# Frontend directory mein jao
cd frontend

# Docker image build karo (apna username replace karo)
docker build -t YOUR_DOCKERHUB_USERNAME/mern-frontend:latest .

# Image verify karo
docker images | grep mern-frontend

# Docker Hub pe push karo
docker push YOUR_DOCKERHUB_USERNAME/mern-frontend:latest

# Project root mein wapas aao
cd ..
```

### Step 3.4: Verify Docker Hub

```bash
# Browser mein jao aur check karo:
# https://hub.docker.com/u/YOUR_DOCKERHUB_USERNAME

# Dono images (mern-backend aur mern-frontend) dikhni chahiye
```

---

## 4. MicroK8s Setup

### Step 4.1: Start MicroK8s

```bash
# MicroK8s start karo
microk8s start

# Status check karo
microk8s status --wait-ready
```

### Step 4.2: Enable Required Addons

```bash
# DNS enable karo (service discovery ke liye)
microk8s enable dns

# Storage enable karo (MongoDB persistence ke liye)
microk8s enable storage

# Ingress enable karo (external access ke liye)
microk8s enable ingress

# Registry enable karo (optional, local images ke liye)
microk8s enable registry

# Helm3 enable karo
microk8s enable helm3

# Status check karo
microk8s status
```

Output aisa dikhna chahiye:
```
microk8s is running
high-availability: no
  datastore master nodes: 127.0.0.1:19001
  datastore standby nodes: none
addons:
  enabled:
    dns                  # (core) CoreDNS
    ha-cluster           # (core) Configure high availability on the current node
    helm3                # (core) Helm 3 - Kubernetes package manager
    ingress              # (core) Ingress controller for external access
    storage              # (core) Alias to hostpath-storage add-on
```

### Step 4.3: Configure kubectl

```bash
# MicroK8s config ko kubectl ke liye setup karo
microk8s kubectl config view --raw > ~/.kube/config

# Ya alias banao (recommended)
alias kubectl='microk8s kubectl'

# Verify karo
kubectl get nodes

# Output:
# NAME       STATUS   ROLES    AGE   VERSION
# microk8s   Ready    <none>   5m    v1.28.x
```

### Step 4.4: Verify Ingress Controller

```bash
# Ingress controller pods check karo
kubectl get pods -n ingress

# Output mein nginx-ingress-microk8s-controller running hona chahiye
```

---

## 5. Helm Installation

### Step 5.1: Verify Helm

```bash
# Helm version check karo
helm version

# Helm repos list karo
helm repo list
```

### Step 5.2: Add Common Helm Repos (Optional)

```bash
# Bitnami repo add karo
helm repo add bitnami https://charts.bitnami.com/bitnami

# Stable repo add karo
helm repo add stable https://charts.helm.sh/stable

# Repos update karo
helm repo update
```

### Step 5.3: Verify Helm Chart

```bash
# Apne project directory mein jao
cd /Users/arzakkhan/work/kt-Kubernetes/mern-k8s-app

# Helm chart validate karo
helm lint helm-chart/

# Output: "1 chart(s) linted, 0 chart(s) failed"

# Helm chart dry-run karo (actual deploy nahi hoga)
helm install mern-app helm-chart/ --dry-run --debug
```

---

## 6. ArgoCD Installation

### Step 6.1: Create ArgoCD Namespace

```bash
# ArgoCD namespace banao
kubectl create namespace argocd
```

### Step 6.2: Install ArgoCD

```bash
# ArgoCD install karo
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Installation verify karo
kubectl get pods -n argocd

# Wait: Sare pods "Running" status mein aane tak wait karo (2-3 minutes)
```

### Step 6.3: Install ArgoCD CLI

```bash
# ArgoCD CLI install karo
brew install argocd

# Version check karo
argocd version --client
```

### Step 6.4: Access ArgoCD UI

```bash
# ArgoCD server ko port-forward karo
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Browser mein kholo: https://localhost:8080
# (New terminal window mein ye command chalta rahega)
```

### Step 6.5: Get ArgoCD Admin Password

```bash
# New terminal window open karo

# Initial admin password get karo
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Password copy kar lo
# Username: admin
# Password: (jo abhi copy kiya)
```

### Step 6.6: Login to ArgoCD

```bash
# ArgoCD CLI se login karo
argocd login localhost:8080

# Username: admin
# Password: (jo step 6.5 mein mila)

# Warning about certificate ignore kar sakte ho (y enter karo)

# Password change karo (optional but recommended)
argocd account update-password
```

---

## 7. Application Deployment

### Step 7.1: Update ArgoCD Application Config

```bash
# File: argocd/application.yaml
# Update karo:
# - repoURL: https://github.com/YOUR_GITHUB_USERNAME/mern-k8s-app.git
```

### Step 7.2: Method 1 - Deploy Using ArgoCD (Recommended)

```bash
# ArgoCD application create karo
kubectl apply -f argocd/application.yaml

# Application status check karo
argocd app list

# Application sync karo (agar auto-sync nahi hai)
argocd app sync mern-app

# Sync status watch karo
argocd app get mern-app --refresh
```

### Step 7.3: Method 2 - Deploy Using Helm (Alternative)

```bash
# Helm se directly deploy karo
helm install mern-app helm-chart/ --create-namespace

# Release status check karo
helm list

# Pods check karo
kubectl get pods -n mern-app
```

### Step 7.4: Method 3 - Deploy Using kubectl (Alternative)

```bash
# Namespace banao
kubectl apply -f k8s/namespace.yaml

# MongoDB deploy karo
kubectl apply -f k8s/mongodb-deployment.yaml

# Backend deploy karo
kubectl apply -f k8s/backend-deployment.yaml

# Frontend deploy karo
kubectl apply -f k8s/frontend-deployment.yaml

# Ingress deploy karo
kubectl apply -f k8s/ingress.yaml
```

### Step 7.5: Verify Deployment

```bash
# Namespace check karo
kubectl get namespaces

# Pods check karo
kubectl get pods -n mern-app

# Services check karo
kubectl get svc -n mern-app

# Ingress check karo
kubectl get ingress -n mern-app

# Detailed status
kubectl get all -n mern-app
```

Expected Output:
```
NAME                            READY   STATUS    RESTARTS   AGE
pod/mongodb-xxx                 1/1     Running   0          2m
pod/backend-xxx                 1/1     Running   0          2m
pod/frontend-xxx                1/1     Running   0          2m

NAME                       TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)
service/mongodb-service    ClusterIP   10.152.183.xxx   <none>        27017/TCP
service/backend-service    ClusterIP   10.152.183.xxx   <none>        5000/TCP
service/frontend-service   ClusterIP   10.152.183.xxx   <none>        80/TCP
```

---

## 8. Testing & Verification

### Step 8.1: Configure /etc/hosts

```bash
# /etc/hosts file edit karo
sudo nano /etc/hosts

# Ye line add karo:
127.0.0.1 mern-app.local

# Save karo (Ctrl+O, Enter, Ctrl+X)
```

### Step 8.2: Test Application

```bash
# Browser mein kholo:
# http://mern-app.local

# Ya curl se test karo:
curl http://mern-app.local

# Backend health check:
curl http://mern-app.local/api/health
```

### Step 8.3: Test MongoDB Connection

```bash
# MongoDB pod mein exec karo
kubectl exec -it -n mern-app deployment/mongodb -- mongosh

# MongoDB shell mein:
show dbs
use mernapp
show collections
db.tasks.find()

# Exit: exit
```

### Step 8.4: Check Logs

```bash
# Backend logs check karo
kubectl logs -n mern-app deployment/backend --tail=50

# Frontend logs check karo
kubectl logs -n mern-app deployment/frontend --tail=50

# MongoDB logs check karo
kubectl logs -n mern-app deployment/mongodb --tail=50

# Real-time logs (follow mode)
kubectl logs -n mern-app deployment/backend -f
```

### Step 8.5: Test ArgoCD Sync

```bash
# Code mein koi change karo (e.g., backend/server.js)
# Git commit aur push karo
git add .
git commit -m "Test change"
git push

# ArgoCD UI mein jao aur "Refresh" click karo
# Ya CLI se:
argocd app sync mern-app

# Changes automatically deploy ho jayenge
```

---

## 9. Troubleshooting

### Issue 1: Pods Not Starting

```bash
# Pod status check karo
kubectl get pods -n mern-app

# Pod describe karo (detailed info)
kubectl describe pod -n mern-app POD_NAME

# Events check karo
kubectl get events -n mern-app --sort-by='.lastTimestamp'
```

### Issue 2: Image Pull Errors

```bash
# Docker Hub login verify karo
docker login

# Image pull manually test karo
docker pull YOUR_DOCKERHUB_USERNAME/mern-backend:latest

# Kubernetes secret create karo (agar private repo hai)
kubectl create secret docker-registry regcred \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=YOUR_DOCKERHUB_USERNAME \
  --docker-password=YOUR_DOCKERHUB_PASSWORD \
  --docker-email=YOUR_EMAIL \
  -n mern-app
```

### Issue 3: MongoDB Connection Failed

```bash
# MongoDB service check karo
kubectl get svc -n mern-app mongodb-service

# MongoDB pod logs check karo
kubectl logs -n mern-app deployment/mongodb

# Backend environment variables check karo
kubectl get deployment -n mern-app backend -o yaml | grep -A 5 env
```

### Issue 4: Ingress Not Working

```bash
# Ingress controller check karo
kubectl get pods -n ingress

# Ingress details check karo
kubectl describe ingress -n mern-app mern-app-ingress

# /etc/hosts file verify karo
cat /etc/hosts | grep mern-app

# Ingress controller logs check karo
kubectl logs -n ingress -l app.kubernetes.io/name=ingress-nginx
```

### Issue 5: ArgoCD Sync Failed

```bash
# ArgoCD application status check karo
argocd app get mern-app

# Sync errors check karo
kubectl describe application -n argocd mern-app

# Manual sync try karo
argocd app sync mern-app --force

# ArgoCD server logs check karo
kubectl logs -n argocd deployment/argocd-server
```

### Issue 6: Port Already in Use

```bash
# Port 8080 pe running process check karo
lsof -i :8080

# Process kill karo
kill -9 PID

# Ya different port use karo
kubectl port-forward svc/argocd-server -n argocd 8081:443
```

---

## 🎯 Quick Commands Reference

### Deployment Commands

```bash
# Full deployment (ArgoCD method)
kubectl apply -f argocd/application.yaml
argocd app sync mern-app

# Full deployment (Helm method)
helm install mern-app helm-chart/ --create-namespace

# Update deployment
helm upgrade mern-app helm-chart/
```

### Monitoring Commands

```bash
# Watch all resources
kubectl get all -n mern-app -w

# Watch pods
kubectl get pods -n mern-app -w

# Watch ArgoCD apps
watch argocd app list
```

### Cleanup Commands

```bash
# Delete application (ArgoCD)
argocd app delete mern-app

# Delete application (Helm)
helm uninstall mern-app

# Delete namespace
kubectl delete namespace mern-app

# Delete ArgoCD
kubectl delete namespace argocd
```

### Restart Commands

```bash
# Restart deployment
kubectl rollout restart deployment/backend -n mern-app
kubectl rollout restart deployment/frontend -n mern-app
kubectl rollout restart deployment/mongodb -n mern-app

# Check rollout status
kubectl rollout status deployment/backend -n mern-app
```

---

## 🎓 Next Steps

1. **Scaling**: Replicas badhao
   ```bash
   kubectl scale deployment/backend --replicas=3 -n mern-app
   ```

2. **Monitoring**: Prometheus aur Grafana setup karo
   ```bash
   microk8s enable prometheus
   ```

3. **CI/CD**: GitHub Actions setup karo for automatic builds

4. **SSL/TLS**: HTTPS enable karo with cert-manager

5. **Production**: Cloud provider (AWS EKS, GCP GKE, Azure AKS) pe deploy karo

---

## 📞 Support

Issues face kar rahe ho? Check karo:
- Logs: `kubectl logs`
- Events: `kubectl get events`
- Describe: `kubectl describe`
- ArgoCD UI: https://localhost:8080

---

**Congratulations! 🎉** Tumne successfully MERN app ko Kubernetes pe deploy kar diya hai with ArgoCD, Helm, aur Ingress!
