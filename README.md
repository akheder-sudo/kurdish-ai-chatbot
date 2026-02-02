# kurdish-ai-chatbot
AI chatbot for Kurdish language (Kurmanji & Sorani)

## Features
- Greets and chats in Kurmanji and Sorani
- Answers simple questions about time/date
- Handles basic intents like help, thanks, and farewell
- Includes a React web interface for local testing

## Run (CLI)
```bash
python3 main.py
```

Optional: provide your name.
```bash
python3 main.py --name "Aso"
```

## Run (Web)
```bash
cd web
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
Then open `http://localhost:5173`.

## Testing
There are no automated tests yet. To do a quick manual check, run:
```bash
python3 main.py
```
Then try some example prompts from the list below.

## Example prompts
- "سڵاو"
- "کات چەندە؟"
- "ناوت چییە؟"
- "سوپاس"
- "خوات"
