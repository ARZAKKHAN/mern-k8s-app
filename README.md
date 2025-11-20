# MERN Stack Application with Kubernetes, Helm, and ArgoCD

A complete MERN (MongoDB, Express, React, Node.js) application deployed on Kubernetes using MicroK8s, Helm, ArgoCD, and Ingress Controller.

## 📋 Project Structure

```
mern-k8s-app/
├── backend/              # Node.js + Express API
├── frontend/             # React Application
├── k8s/                  # Kubernetes manifests
├── helm-chart/           # Helm chart templates
├── argocd/               # ArgoCD application config
└── docs/                 # Documentation
```

## 🚀 Features

- **Backend**: RESTful API with Express.js
- **Frontend**: Modern React UI with task management
- **Database**: MongoDB with persistent storage
- **Containerization**: Docker images for all services
- **Orchestration**: Kubernetes deployment
- **Package Management**: Helm charts
- **GitOps**: ArgoCD for continuous deployment
- **Ingress**: NGINX Ingress Controller for routing

## 🛠️ Technologies Used

- **Frontend**: React, Axios, CSS3
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **Container**: Docker
- **Orchestration**: Kubernetes (MicroK8s)
- **Package Manager**: Helm
- **GitOps**: ArgoCD
- **Ingress**: NGINX Ingress Controller

## 📦 Prerequisites

- macOS (or Linux)
- Docker Desktop
- MicroK8s
- Helm
- kubectl
- Git
- Docker Hub account
- GitHub account

## 🎯 Quick Start

See `DEPLOYMENT_GUIDE.md` for complete step-by-step instructions.

## 📝 API Endpoints

- `GET /api/health` - Health check
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## 🌐 Access Application

After deployment:
- Application: http://mern-app.local
- ArgoCD UI: http://localhost:8080 (port-forward)

## 📚 Documentation

- [Complete Deployment Guide](DEPLOYMENT_GUIDE.md)
- [ArgoCD Interview Guide](ARGOCD_INTERVIEW_GUIDE.md)

## 🤝 Contributing

Feel free to fork and contribute!

## 📄 License

MIT License
