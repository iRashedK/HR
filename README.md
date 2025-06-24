# HR Recommendations

This project analyzes employee data and suggests relevant certifications and courses using OpenRouter AI. Upload a CSV or Excel file with employee information and get structured recommendations.

The web interface includes language and dark mode toggles. Results appear in interactive cards showing roadmaps, links and prices, and can be downloaded as PDF files. A separate library page allows filtering saved courses and certifications.

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
