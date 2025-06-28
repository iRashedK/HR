# HR Recommendations

This project "رشُد" analyzes employee data and suggests relevant certifications and courses using OpenRouter AI. It runs entirely inside Docker Compose and uses a small microservices architecture.

## Components
- **app**: FastAPI gateway serving the web UI and accepting uploads.
- **analyzer**: Worker service consuming tasks from RabbitMQ and calling OpenRouter.
- **RabbitMQ**: message broker for asynchronous processing.
- **PostgreSQL**: stores recommendations.
- **frontend**: React + Tailwind interface with sidebar navigation.

The frontend offers a modern indigo theme with Arabic/English support and dark/light mode. Results appear in animated cards grouped by roadmap steps with links, prices and PDF export.

The application checks available OpenRouter models. By default it uses the free `deepseek/deepseek-r1-0528:free` model. If the model configured in `.env` (`OPENROUTER_ANALYSIS_MODEL`) is unavailable, it falls back to another free option such as `openai/gpt-3.5-turbo`.

## Usage
```bash
git clone <repo-url>
cd HR
cp .env.example .env
# edit .env and add your OPENROUTER_API_KEY
# you may also change `OPENROUTER_ANALYSIS_MODEL`, `USED_LANGUAGE`, or
# `RABBITMQ_MAX_TRIES` if RabbitMQ starts slowly
# `ANALYSIS_WORKERS` to control how many employees are processed in parallel
# `OPENROUTER_TIMEOUT` and `OPENROUTER_RETRIES` tweak request behaviour
make up  # runs docker compose up
```
After running `make up` visit <http://localhost:8000> in your browser to access the built‑in interface. Upload a CSV or Excel file and the service will automatically start processing it.  As results arrive you should see animated cards showing the roadmap steps with course and certification links.  If no results appear check the container logs and verify your `OPENROUTER_API_KEY` in `.env`.
If you want to develop the React UI separately, run it with Vite:
```bash
cd frontend
npm install
npm run dev
```
This starts the React UI on <http://localhost:3000> with a sidebar for navigation.

### Serving the React build with FastAPI

To serve the React interface from FastAPI (available on <http://localhost:8000>), build the frontend and copy the output:

```bash
cd frontend
npm run build
cp -r dist ../app/frontend_build
```

Restart the containers:

```bash
make down
make up
```

You should then see the latest build at <http://localhost:8000>.

The app checks the model configured in `.env`. If the ID is invalid, it will retry automatically with the free `openai/gpt-3.5-turbo` model so processing continues without user intervention.
