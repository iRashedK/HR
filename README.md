# HR Recommendations

This project "رشُد" analyzes employee data and suggests relevant certifications and courses using OpenRouter AI. It runs entirely inside Docker Compose and uses a small microservices architecture.

## Components
- **app**: FastAPI gateway serving the web UI and accepting uploads.
- **analyzer**: Worker service consuming tasks from RabbitMQ and calling OpenRouter.
- **RabbitMQ**: message broker for asynchronous processing.
- **PostgreSQL**: stores recommendations.

The frontend supports Arabic/English and dark/light mode without external CSS libraries. Results appear in animated cards grouped under roadmap steps with links, prices and PDF export.

The application checks available OpenRouter models. If the model configured in `.env` is unavailable, it falls back to a free option such as `openai/gpt-3.5-turbo`.

## Usage
```bash
git clone <repo-url>
cd HR
cp .env.example .env
# edit .env and add your OPENROUTER_API_KEY
make up
```
Open <http://localhost:8000> in your browser. Upload a CSV or Excel file and wait while the analyzer service fills the results table.
