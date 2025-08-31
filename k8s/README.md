# Kubernetes Deployment for User Management Application

This directory contains Kubernetes manifests to deploy the User Management full-stack application on a k3s cluster.

## 📋 Prerequisites

- **k3s cluster** running and accessible
- **kubectl** configured to access your k3s cluster
- **Docker** for building images
- **Local development images** built from Docker compose setup

## 🚀 Quick Deployment

### **Option 1: Using Deployment Scripts**

**Linux/Mac:**
```bash
cd k8s
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```cmd
cd k8s
deploy.bat
```

### **Option 2: Manual Deployment**

```bash
# 1. Build and import Docker images
cd backend
docker build -t user-management-backend:latest .
cd ../frontend  
docker build -t user-management-frontend:latest .

# Import to k3s (if using local images)
k3s ctr images import <(docker save user-management-backend:latest)
k3s ctr images import <(docker save user-management-frontend:latest)

# 2. Deploy to k3s
cd ../k8s
kubectl apply -f namespace.yaml
kubectl apply -f postgres-init.yaml
kubectl apply -f postgres.yaml
kubectl apply -f backend.yaml
kubectl apply -f frontend.yaml
kubectl apply -f ingress.yaml
```

### **Option 3: Using Kustomize**
```bash
cd k8s
kubectl apply -k .
```

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    k3s Cluster                             │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │  Frontend   │    │   Backend   │    │ PostgreSQL  │    │
│  │   (nginx)   │◄──►│  (Node.js)  │◄──►│ (Database)  │    │
│  │  Port: 80   │    │ Port: 5000  │    │ Port: 5432  │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│         │                                                  │
│  ┌─────────────┐                                          │
│  │ NodePort    │                                          │
│  │ Port: 30080 │                                          │
│  └─────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
   External Access
 http://NODE_IP:30080
```

## 🔧 Services & Access

### **Frontend (NodePort)**
- **Service**: `frontend-service`
- **Type**: NodePort
- **Port**: 30080
- **Access**: `http://[NODE-IP]:30080`

### **Backend (ClusterIP)**
- **Service**: `backend-service`
- **Type**: ClusterIP
- **Port**: 5000
- **Access**: Via frontend proxy `/api`

### **Database (ClusterIP)**
- **Service**: `postgres-service`
- **Type**: ClusterIP
- **Port**: 5432
- **Access**: Internal only

## 📁 Manifest Files

| File | Description |
|------|-------------|
| `namespace.yaml` | Namespace and RBAC configuration |
| `postgres-init.yaml` | Database initialization scripts |
| `postgres.yaml` | PostgreSQL deployment and service |
| `backend.yaml` | Backend API deployment and service |
| `frontend.yaml` | Frontend deployment and NodePort service |
| `ingress.yaml` | Ingress configuration (alternative access) |
| `kustomization.yaml` | Kustomize configuration |

## 🛠️ Configuration

### **Environment Variables**

#### **Backend Configuration:**
```yaml
NODE_ENV: production
DATABASE_HOST: postgres-service
DATABASE_USER: postgres
DATABASE_NAME: user_management
DATABASE_PORT: 5432
```

#### **Frontend Configuration:**
```yaml
REACT_APP_API_URL: /api
```

### **Secrets (Base64 Encoded):**
```yaml
DATABASE_PASSWORD: cG9zdGdyZXMxMjM=  # postgres123
JWT_SECRET: and0X3NlY3JldF9rZXk=      # jwt_secret_key
```

## 🔍 Monitoring & Debugging

### **Check Pod Status:**
```bash
kubectl get pods -n user-management
kubectl describe pod [POD-NAME] -n user-management
```

### **View Logs:**
```bash
# Frontend logs
kubectl logs -f deployment/frontend -n user-management

# Backend logs  
kubectl logs -f deployment/backend -n user-management

# Database logs
kubectl logs -f deployment/postgres -n user-management
```

### **Check Services:**
```bash
kubectl get svc -n user-management
kubectl describe svc frontend-service -n user-management
```

### **Database Connection Test:**
```bash
# Connect to postgres pod
kubectl exec -it deployment/postgres -n user-management -- psql -U postgres -d user_management

# Test queries
\dt  # List tables
SELECT * FROM users;
```

## 📈 Scaling

### **Scale Deployments:**
```bash
# Scale frontend
kubectl scale deployment/frontend --replicas=3 -n user-management

# Scale backend  
kubectl scale deployment/backend --replicas=3 -n user-management
```

### **Horizontal Pod Autoscaler:**
```bash
# Enable HPA for backend (requires metrics-server)
kubectl autoscale deployment backend --cpu-percent=70 --min=2 --max=10 -n user-management
```

## 🔄 Updates

### **Update Images:**
```bash
# Update backend image
kubectl set image deployment/backend backend=user-management-backend:v2.0.0 -n user-management

# Update frontend image
kubectl set image deployment/frontend frontend=user-management-frontend:v2.0.0 -n user-management
```

### **Rolling Updates:**
```bash
# Check rollout status
kubectl rollout status deployment/backend -n user-management

# Rollback if needed
kubectl rollout undo deployment/backend -n user-management
```

## 🗑️ Cleanup

### **Delete Application:**
```bash
# Using cleanup script
./cleanup.sh

# Manual cleanup
kubectl delete namespace user-management
```

### **Remove Docker Images:**
```bash
k3s ctr images remove user-management-backend:latest
k3s ctr images remove user-management-frontend:latest
```

## 🔒 Security Considerations

1. **Secrets Management**: Update default passwords and secrets
2. **RBAC**: Minimal permissions configured
3. **Network Policies**: Consider implementing for production
4. **Image Security**: Scan images for vulnerabilities
5. **Resource Limits**: Configured to prevent resource exhaustion

## 🌐 Alternative Access Methods

### **Using Ingress (instead of NodePort):**
```bash
# Deploy ingress
kubectl apply -f ingress.yaml

# Add to /etc/hosts
echo "[NODE-IP] user-management.local" >> /etc/hosts

# Access via domain
curl http://user-management.local
```

### **Port Forwarding (for development):**
```bash
# Forward frontend
kubectl port-forward svc/frontend-service 3000:80 -n user-management

# Forward backend
kubectl port-forward svc/backend-service 5000:5000 -n user-management
```

## 🚨 Troubleshooting

### **Common Issues:**

1. **ImagePullBackOff**: Ensure images are built and available in k3s
2. **Pending Pods**: Check resource availability and storage classes
3. **Database Connection**: Verify postgres pod is running and healthy
4. **Frontend 404**: Check nginx configuration and API proxy setup

### **Debug Commands:**
```bash
# Check cluster info
kubectl cluster-info

# Check node resources
kubectl top nodes

# Check events
kubectl get events -n user-management --sort-by='.lastTimestamp'
```

## 📞 Support

For issues and questions:
1. Check pod logs and events
2. Verify service endpoints
3. Test database connectivity
4. Check resource utilization

Your User Management application is now ready for production deployment on k3s! 🎉
