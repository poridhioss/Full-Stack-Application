#!/bin/bash

# K3s Deployment Script for User Management Application
# This script deploys the full-stack application to k3s cluster

set -e

echo "🚀 Deploying User Management Application to k3s..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if k3s is running
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl not found. Please install k3s first."
    exit 1
fi

# Check if k3s cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to k3s cluster. Please check your cluster status."
    exit 1
fi

print_success "Connected to k3s cluster"

# Step 1: Build Docker images
print_status "Building Docker images..."

# Build backend image
print_status "Building backend image..."
cd ../backend
docker build -t user-management-backend:latest .

# Build frontend image
print_status "Building frontend image..."
cd ../frontend
docker build -t user-management-frontend:latest .

# Import images to k3s
print_status "Importing images to k3s..."
k3s ctr images import <(docker save user-management-backend:latest)
k3s ctr images import <(docker save user-management-frontend:latest)

print_success "Docker images built and imported to k3s"

# Step 2: Deploy to k3s
cd ../k8s

print_status "Creating namespace and RBAC..."
kubectl apply -f namespace.yaml

print_status "Deploying database initialization script..."
kubectl apply -f postgres-init.yaml

print_status "Deploying PostgreSQL database..."
kubectl apply -f postgres.yaml

print_status "Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/postgres -n user-management

print_status "Deploying backend service..."
kubectl apply -f backend.yaml

print_status "Waiting for backend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/backend -n user-management

print_status "Deploying frontend service..."
kubectl apply -f frontend.yaml

print_status "Waiting for frontend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n user-management

# Step 3: Get access information
print_success "Deployment completed successfully!"

echo ""
echo "📋 Access Information:"
echo "===================="

# Get NodePort
NODEPORT=$(kubectl get svc frontend-service -n user-management -o jsonpath='{.spec.ports[0].nodePort}')
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')

echo "🌐 Frontend URL (NodePort): http://$NODE_IP:$NODEPORT"
echo "🔧 Backend API: http://$NODE_IP:$NODEPORT/api"

# Get pod status
echo ""
echo "📊 Pod Status:"
kubectl get pods -n user-management

echo ""
echo "🔍 Service Status:"
kubectl get svc -n user-management

echo ""
echo "💡 Useful Commands:"
echo "  - View logs: kubectl logs -f deployment/[frontend|backend|postgres] -n user-management"
echo "  - Scale services: kubectl scale deployment/[service-name] --replicas=3 -n user-management"
echo "  - Delete deployment: kubectl delete namespace user-management"

print_success "Application is ready to use!"
