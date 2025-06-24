# HR Recommendations

This project analyzes employee data and suggests relevant certifications and courses using OpenRouter AI. Upload a CSV or Excel file with employee information and get structured recommendations.

The web interface uses a sidebar layout with Arabic RTL support. It includes language and dark mode toggles. Results appear in animated cards grouped under their roadmap steps with links, prices and PDF export. A library page lets you browse saved courses and certifications.

The application automatically checks the available OpenRouter models. If the model configured in `.env` is unavailable, it falls back to a free option such as `openai/gpt-3.5-turbo`.

## Usage

```bash
git clone <repo-url>
cd HR
cp .env.example .env
# edit .env and add your OPENROUTER_API_KEY
make up
```

The application will be available at `http://localhost:8000`.
