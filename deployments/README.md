# Deployments

Deployment configurations and manifests for Evolution of Todo project.

## Structure

```
deployments/
 ├─ phase-1-console/        # (N/A) CLI deployment
 ├─ phase-2-web/            # Web application deployment
 │  ├─ docker-compose.yml   # Local development
 │  └─ systemd/             # Systemd service files
 ├─ phase-3-chatbot/        # Chatbot service deployment
 │  ├─ docker-compose.yml   # Multi-service setup
 │  └─ env.example          # Environment variables
 ├─ phase-4-kubernetes/     # Kubernetes manifests
 │  ├─ namespace.yaml       # Kubernetes namespace
 │  ├─ deployment.yaml      # Deployment manifest
 │  ├─ service.yaml         # Service manifest
 │  ├─ ingress.yaml         # Ingress configuration
 │  └─ configmap.yaml       # Configuration
 ├─ phase-5-cloud/          # Cloud deployment configs
 │  ├─ terraform/           # Terraform IaC
 │  ├─ helm/                # Helm charts
 │  └─ cloudformation/       # AWS CloudFormation
 └─ scripts/                # Deployment helper scripts
```

## Deployment by Phase

### Phase 1: Console
Run directly:
```bash
npm run phase1
```

### Phase 2: Web
Local deployment:
```bash
docker-compose -f deployments/phase-2-web/docker-compose.yml up
```

### Phase 3: Chatbot
Multi-service deployment:
```bash
docker-compose -f deployments/phase-3-chatbot/docker-compose.yml up
```

### Phase 4: Local Kubernetes
Apply manifests:
```bash
kubectl apply -f deployments/phase-4-kubernetes/
```

### Phase 5: Cloud
Infrastructure as Code:
```bash
# AWS
terraform apply -f deployments/phase-5-cloud/terraform/

# Or use Helm
helm install todo deployments/phase-5-cloud/helm/
```

## Configuration

Each phase has an `env.example` file showing required environment variables.

Copy and customize for your environment:
```bash
cp deployments/phase-X/env.example deployments/phase-X/.env
```

## Health Checks

All deployments include health check endpoints:
- `/health` - Basic health check
- `/health/ready` - Readiness probe
- `/health/live` - Liveness probe

## Monitoring & Logging

- **Phase 1-2:** Console output
- **Phase 3:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Phase 4:** Kubernetes native (Prometheus, Grafana)
- **Phase 5:** Cloud provider metrics

## Scaling

- **Phase 1-2:** Vertical scaling (instance size)
- **Phase 3:** Horizontal scaling (docker-compose replicas)
- **Phase 4:** Kubernetes auto-scaling
- **Phase 5:** Cloud auto-scaling policies

## CI/CD Integration

GitHub Actions workflows (add `.github/workflows/`):
- Test on PR
- Build and push on merge
- Deploy to staging on main branch
- Manual approval for production

## Rollback Procedures

- **Phase 2:** Docker image tagging
- **Phase 3:** docker-compose rollback
- **Phase 4:** Kubernetes rollback
- **Phase 5:** Blue-green deployment

---

**Status:** Ready for Phase 2+  
**Last Updated:** January 17, 2026
