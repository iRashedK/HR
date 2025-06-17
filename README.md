# Employee Training Planner

This repository provides a proof-of-concept employee training platform powered by OpenRouter. The backend uses the **Qwen** model to generate plans and is built with FastAPI while the frontend is built with React.

## Components
- **api-gateway**: FastAPI service that accepts CSV uploads and requests personalized learning plans from OpenRouter.
- **ui**: Minimal React interface with a simple sidebar menu.
- **training_data**: Example local training catalog.

## Docker
Run both services with:
```bash
docker-compose up --build
```
