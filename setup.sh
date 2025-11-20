#!/bin/bash

# MERN K8s App Setup Script
# This script helps you setup the entire application

set -e

echo "🚀 MERN Kubernetes App Setup Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check Prerequisites
echo "Step 1: Checking Prerequisites..."
echo "--------------------------------"

if command_exists docker; then
    print_success "Docker is installed"
else
    print_error "Docker is not installed. Please install Docker Desktop first."
    exit 1
fi

if command_exists kubectl; then
    print_success "kubectl is installed"
else
    print_error "kubectl is not installed. Run: brew install kubectl"
    exit 1
fi

if command_exists helm; then
    print_success "Helm is installed"
else
    print_error "Helm is not installed. Run: brew install helm"
    exit 1
fi

if command_exists microk8s; then
    print_success "MicroK8s is installed"
else
    print_warning "MicroK8s is not installed. Run: brew install ubuntu/microk8s/microk8s"
fi

echo ""

# Step 2: Get User Input
echo "Step 2: Configuration"
echo "--------------------"

read -p "Enter your Docker Hub username: " DOCKER_USERNAME
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$DOCKER_USERNAME" ] || [ -z "$GITHUB_USERNAME" ]; then
    print_error "Docker Hub and GitHub usernames are required!"
    exit 1
fi

print_success "Configuration saved"
echo ""

# Step 3: Update Configuration Files
echo "Step 3: Updating Configuration Files..."
echo "---------------------------------------"

# Update Kubernetes manifests
sed -i '' "s/YOUR_DOCKERHUB_USERNAME/$DOCKER_USERNAME/g" k8s/backend-deployment.yaml
sed -i '' "s/YOUR_DOCKERHUB_USERNAME/$DOCKER_USERNAME/g" k8s/frontend-deployment.yaml

# Update Helm values
sed -i '' "s/YOUR_DOCKERHUB_USERNAME/$DOCKER_USERNAME/g" helm-chart/values.yaml

# Update ArgoCD application
sed -i '' "s/YOUR_GITHUB_USERNAME/$GITHUB_USERNAME/g" argocd/application.yaml

print_success "Configuration files updated"
echo ""

# Step 4: Docker Login
echo "Step 4: Docker Hub Login"
echo "-----------------------"
print_info "Please login to Docker Hub"
docker login

if [ $? -eq 0 ]; then
    print_success "Docker login successful"
else
    print_error "Docker login failed"
    exit 1
fi
echo ""

# Step 5: Build Docker Images
echo "Step 5: Building Docker Images..."
echo "--------------------------------"

print_info "Building backend image..."
cd backend
docker build -t $DOCKER_USERNAME/mern-backend:latest .
if [ $? -eq 0 ]; then
    print_success "Backend image built"
else
    print_error "Backend image build failed"
    exit 1
fi
cd ..

print_info "Building frontend image..."
cd frontend
docker build -t $DOCKER_USERNAME/mern-frontend:latest .
if [ $? -eq 0 ]; then
    print_success "Frontend image built"
else
    print_error "Frontend image build failed"
    exit 1
fi
cd ..

echo ""

# Step 6: Push Docker Images
echo "Step 6: Pushing Docker Images..."
echo "-------------------------------"

print_info "Pushing backend image..."
docker push $DOCKER_USERNAME/mern-backend:latest
if [ $? -eq 0 ]; then
    print_success "Backend image pushed"
else
    print_error "Backend image push failed"
    exit 1
fi

print_info "Pushing frontend image..."
docker push $DOCKER_USERNAME/mern-frontend:latest
if [ $? -eq 0 ]; then
    print_success "Frontend image pushed"
else
    print_error "Frontend image push failed"
    exit 1
fi

echo ""

# Step 7: Git Setup
echo "Step 7: Git Repository Setup"
echo "---------------------------"

if [ -d .git ]; then
    print_warning "Git repository already initialized"
else
    git init
    print_success "Git repository initialized"
fi

git add .
git commit -m "Initial commit: MERN app with K8s, Helm, and ArgoCD" || print_warning "Nothing to commit"

print_info "Please create a GitHub repository named 'mern-k8s-app'"
print_info "Then run these commands:"
echo ""
echo "  git remote add origin https://github.com/$GITHUB_USERNAME/mern-k8s-app.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""

read -p "Press Enter after pushing to GitHub..."

echo ""

# Step 8: MicroK8s Setup
echo "Step 8: MicroK8s Setup"
echo "---------------------"

print_info "Starting MicroK8s..."
microk8s start

print_info "Enabling required addons..."
microk8s enable dns storage ingress helm3

print_success "MicroK8s setup complete"
echo ""

# Step 9: Setup kubectl alias
echo "Step 9: Setting up kubectl"
echo "-------------------------"

print_info "Creating kubectl alias..."
echo "alias kubectl='microk8s kubectl'" >> ~/.zshrc
source ~/.zshrc || true

print_success "kubectl alias created"
echo ""

# Step 10: ArgoCD Installation
echo "Step 10: ArgoCD Installation"
echo "---------------------------"

print_info "Creating ArgoCD namespace..."
microk8s kubectl create namespace argocd || print_warning "Namespace already exists"

print_info "Installing ArgoCD..."
microk8s kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

print_info "Waiting for ArgoCD pods to be ready..."
microk8s kubectl wait --for=condition=Ready pods --all -n argocd --timeout=300s

print_success "ArgoCD installed"
echo ""

# Step 11: Get ArgoCD Password
echo "Step 11: ArgoCD Access"
echo "---------------------"

print_info "Getting ArgoCD admin password..."
ARGOCD_PASSWORD=$(microk8s kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)

echo ""
print_success "ArgoCD Installation Complete!"
echo ""
echo "======================================"
echo "📋 IMPORTANT INFORMATION"
echo "======================================"
echo ""
echo "ArgoCD Admin Credentials:"
echo "  Username: admin"
echo "  Password: $ARGOCD_PASSWORD"
echo ""
echo "To access ArgoCD UI:"
echo "  1. Run: microk8s kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo "  2. Open: https://localhost:8080"
echo ""
echo "To deploy your application:"
echo "  microk8s kubectl apply -f argocd/application.yaml"
echo ""
echo "To access your app:"
echo "  1. Add to /etc/hosts: 127.0.0.1 mern-app.local"
echo "  2. Open: http://mern-app.local"
echo ""
echo "======================================"
echo ""

print_success "Setup Complete! 🎉"
echo ""
print_info "Next steps:"
echo "  1. Port-forward ArgoCD (in new terminal): microk8s kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo "  2. Deploy application: microk8s kubectl apply -f argocd/application.yaml"
echo "  3. Check status: microk8s kubectl get pods -n mern-app"
echo ""
print_info "For detailed instructions, see DEPLOYMENT_GUIDE.md"
print_info "For interview preparation, see ARGOCD_INTERVIEW_GUIDE.md"
