# Party Management Service

Master data management microservice for parties (employees, contractors, organizations).

## Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Keycloak (for authentication)

### Setup

1. Clone and navigate to project:
```bash
cd codebase/apps/domains/party-management-service
```

2. Install dependencies:
```bash
pip install -e ".[dev]"
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your PostgreSQL and Keycloak URLs
```

4. Run tests:
```bash
pytest tests/ -v
```

5. Start server:
```bash
python -m app.main
```

6. Access API docs:
```
http://localhost:8000/docs
```

### Docker

```bash
docker-compose up
```

## API Endpoints

### PARTY

- `POST /api/v1/parties` — Create party (Jefe only)
- `GET /api/v1/parties` — List parties (paginated)
- `GET /api/v1/parties/{id}` — Get party by ID
- `PATCH /api/v1/parties/{id}` — Update party

## Testing

```bash
# All tests
pytest tests/ -v

# Coverage
pytest tests/ --cov=app --cov-report=html

# Security tests only
pytest tests/security/ -v
```

## Architecture

- **Framework:** FastAPI 0.100+
- **ORM:** SQLAlchemy 2.0+ async
- **Validation:** Pydantic v2
- **Auth:** Keycloak PKCE + PyJWT
- **Logging:** structlog (JSON)
- **Database:** PostgreSQL 15+

## Deployment

1. Build Docker image:
```bash
docker build -t party-management-service:1.0.0 .
```

2. Push to registry:
```bash
docker tag party-management-service:1.0.0 registry.example.com/party-management-service:1.0.0
docker push registry.example.com/party-management-service:1.0.0
```

3. Deploy to Kubernetes (placeholder):
```bash
kubectl apply -f k8s/
```
