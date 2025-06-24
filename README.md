# HR Recommendations

This project "رشُد" analyzes employee data and suggests relevant certifications and courses using OpenRouter AI. It runs entirely inside Docker Compose and uses a small microservices architecture.

## Components
- **app**: FastAPI gateway serving the web UI and accepting uploads.
- **analyzer**: Worker service consuming tasks from RabbitMQ and calling OpenRouter.
- **RabbitMQ**: message broker for asynchronous processing.
- **PostgreSQL**: stores recommendations.

The frontend offers a modern indigo theme with Arabic/English support and dark/light mode. Results appear in animated cards grouped by roadmap steps with links, prices and PDF export.

The application checks available OpenRouter models. By default it uses the free `deepseek/deepseek-r1-0528:free` model. If the model configured in `.env` (`OPENROUTER_ANALYSIS_MODEL`) is unavailable, it falls back to another free option such as `openai/gpt-3.5-turbo`.

## Usage
```bash
git clone <repo-url>
cd HR
cp .env.example .env
# edit .env and add your OPENROUTER_API_KEY
# you may also change `OPENROUTER_ANALYSIS_MODEL` or `USED_LANGUAGE`
make up  # runs docker compose up
```
Open <http://localhost:8000> in your browser. Upload a CSV or Excel file and wait while the analyzer service fills the results table.

The app checks the model configured in `.env`. If the ID is invalid, it will retry automatically with the free `openai/gpt-3.5-turbo` model so processing continues without user intervention.
