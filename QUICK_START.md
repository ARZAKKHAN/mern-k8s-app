# ⚡ Quick Start Guide

Is guide se tum 15-20 minutes mein pura setup kar sakte ho.

## 🎯 Prerequisites

Ye install hone chahiye:
- Docker Desktop
- Homebrew

## 🚀 Automated Setup

### Option 1: Setup Script (Recommended)

```bash
# Project directory mein jao
cd /Users/arzakkhan/work/kt-Kubernetes/mern-k8s-app

# Script ko executable banao
chmod +x setup.sh

# Script run karo
./setup.sh
```

Script ye sab automatically karega:
- ✅ Prerequisites check
- ✅ Configuration update
- ✅ Docker images build aur push
- ✅ Git setup
- ✅ MicroK8s installation aur configuration
- ✅ ArgoCD installation
- ✅ Credentials provide

### Option 2: Manual Setup

Agar script use nahi karna chahte, to ye commands run karo:

```bash
# 1. Install prerequisites
brew install kubectl helm ubuntu/microk8s/microk8s

# 2. Install MicroK8s
microk8s install
microk8s start
microk8s enable dns storage ingress helm3

# 3. Update configuration files
# Replace YOUR_DOCKERHUB_USERNAME with your username in:
# - k8s/backend-deployment.yaml
# - k8s/frontend-deployment.yaml
# - helm-chart/values.yaml

# Replace YOUR_GITHUB_USERNAME in:
# - argocd/application.yaml

# 4. Build and push Docker images
docker login
cd backend && docker build -t YOUR_USERNAME/mern-backend:latest . && docker push YOUR_USERNAME/mern-backend:latest && cd ..
cd frontend && docker build -t YOUR_USERNAME/mern-frontend:latest . && docker push YOUR_USERNAME/mern-frontend:latest && cd ..

# 5. Git setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mern-k8s-app.git
git push -u origin main

# 6. Install ArgoCD
microk8s kubectl create namespace argocd
microk8s kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 7. Wait for ArgoCD
microk8s kubectl wait --for=condition=Ready pods --all -n argocd --timeout=300s

# 8. Get ArgoCD password
microk8s kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

## 🎮 Deploy Application

### Method 1: Using ArgoCD (Recommended)

```bash
# 1. Port-forward ArgoCD (new terminal)
microk8s kubectl port-forward svc/argocd-server -n argocd 8080:443

# 2. Deploy application
microk8s kubectl apply -f argocd/application.yaml

# 3. Check status
microk8s kubectl get pods -n mern-app -w
```

### Method 2: Using Helm

```bash
helm install mern-app helm-chart/ --create-namespace
```

### Method 3: Using kubectl

```bash
microk8s kubectl apply -f k8s/
```

## 🌐 Access Application

```bash
# 1. Add to /etc/hosts
echo "127.0.0.1 mern-app.local" | sudo tee -a /etc/hosts

# 2. Open browser
open http://mern-app.local
```

## 🔍 Verify Everything

```bash
# Check all pods
microk8s kubectl get pods -n mern-app

# Check services
microk8s kubectl get svc -n mern-app

# Check ingress
microk8s kubectl get ingress -n mern-app

# Check ArgoCD app
microk8s kubectl get application -n argocd
```

## 📊 Access ArgoCD UI

```bash
# 1. Port-forward (if not already running)
microk8s kubectl port-forward svc/argocd-server -n argocd 8080:443

# 2. Get password
microk8s kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# 3. Open browser
open https://localhost:8080

# Login with:
# Username: admin
# Password: (from step 2)
```

## 🧪 Test Application

```bash
# Health check
curl http://mern-app.local/api/health

# Create a task
curl -X POST http://mern-app.local/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing API"}'

# Get all tasks
curl http://mern-app.local/api/tasks
```

## 🔧 Common Issues

### Issue: Pods not starting
```bash
# Check events
microk8s kubectl get events -n mern-app --sort-by='.lastTimestamp'

# Check pod logs
microk8s kubectl logs -n mern-app deployment/backend
```

### Issue: Can't access application
```bash
# Check ingress
microk8s kubectl describe ingress -n mern-app

# Verify /etc/hosts
cat /etc/hosts | grep mern-app
```

### Issue: Image pull error
```bash
# Make sure images are public on Docker Hub
# Or login to Docker Hub
docker login
```

## 🧹 Cleanup

```bash
# Delete application
microk8s kubectl delete namespace mern-app

# Delete ArgoCD
microk8s kubectl delete namespace argocd

# Stop MicroK8s
microk8s stop
```

## 📚 Next Steps

1. **Read Full Guide**: Check `DEPLOYMENT_GUIDE.md` for detailed explanations
2. **Interview Prep**: Read `ARGOCD_INTERVIEW_GUIDE.md` for interview questions
3. **Customize**: Modify the application as per your needs
4. **Learn More**: Explore Kubernetes, Helm, and ArgoCD documentation

## 🆘 Need Help?

- Check logs: `microk8s kubectl logs -n mern-app deployment/DEPLOYMENT_NAME`
- Describe resources: `microk8s kubectl describe pod -n mern-app POD_NAME`
- Check events: `microk8s kubectl get events -n mern-app`
- Read full guide: `DEPLOYMENT_GUIDE.md`

---

**Happy Deploying! 🚀**
