# Docker Configuration

Docker setup and containerization for Evolution of Todo project.

## Structure

```
docker/
 ├─ Dockerfile.phase1       # Phase 1: CLI application
 ├─ Dockerfile.phase2       # Phase 2: Web application
 ├─ Dockerfile.phase3       # Phase 3: Chatbot service
 ├─ Dockerfile.phase4       # Phase 4: Kubernetes deployment
 ├─ Dockerfile.phase5       # Phase 5: Cloud services
 ├─ docker-compose.yml      # Multi-container orchestration (Phase 2+)
 └─ .dockerignore           # Docker build exclusions
```

## Usage

### Phase 1: Console
No Docker required - CLI runs directly.

### Phase 2: Web
```bash
docker build -f docker/Dockerfile.phase2 -t todo-web:latest .
docker run -p 3000:3000 todo-web:latest
```

### Phase 3: Chatbot
```bash
docker-compose -f docker/docker-compose.yml up
```

### Phase 4: Local Kubernetes
```bash
docker build -f docker/Dockerfile.phase4 -t todo-service:latest .
kubectl apply -f deployments/phase-4-kubernetes/
```

### Phase 5: Cloud
Cloud-native deployment handled by cloud providers.

## Image Naming

- `todo-cli:latest` - Phase 1 CLI image
- `todo-web:latest` - Phase 2 web image
- `todo-api:latest` - Phase 2+ API image
- `todo-chatbot:latest` - Phase 3 chatbot image
- `todo-service:latest` - Phase 4+ service image

## Build Strategy

- **Development:** Use docker-compose for multi-service setup
- **Production:** Use multi-stage builds for minimal image size
- **Registry:** Prepare for pushing to Docker Hub (Phase 4+)

## Security

- Run as non-root user
- Use minimal base images (Alpine)
- Scan images for vulnerabilities
- Don't embed secrets in images

---

**Status:** Ready for Phase 2+  
**Last Updated:** January 17, 2026
