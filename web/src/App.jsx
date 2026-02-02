import { useMemo, useState } from "react";

const BOT_NAME = "KurdishBot";

const INTENTS = [
  {
    name: "greeting",
    keywords: ["slaw", "slav", "silav", "sllaw", "سڵاو", "سلام", "merheba", "hello", "hi"],
    responses: [
      "سڵاو! چۆن دەتوانم یارمەتیت بدەم؟",
      "Slaw! Ez çawa dikarim alîkari te bikim?",
      "Hello! How can I help you today?"
    ]
  },
  {
    name: "thanks",
    keywords: ["سوپاس", "spas", "supas", "thank", "thanks"],
    responses: [
      "Spas! Herdem amade me.",
      "سوپاس! هەموو جارێک لە خزمەتت دام.",
      "You're welcome!"
    ]
  },
  {
    name: "name",
    keywords: ["nav", "name", "ناو", "ناوت", "navê"],
    responses: [
      `Navê min ${BOT_NAME} e.`,
      `ناوی من ${BOT_NAME}ە.`
    ]
  },
  {
    name: "time",
    keywords: ["kat", "time", "کات"],
    responses: []
  },
  {
    name: "date",
    keywords: ["roj", "date", "ڕۆژ", "بەروار", "berwar"],
    responses: []
  },
  {
    name: "help",
    keywords: ["help", "alîkarî", "یارمەتی", "ferman", "commands"],
    responses: [
      "دەکرێت پرسیاری سادە بکەیت وەک: ناوت چییە؟ کات چەندە؟",
      "Tu dikarî pirsên bingehîn bikî: Navê te çi ye? Kat çend e?",
      "You can ask: What's your name? What time is it?"
    ]
  },
  {
    name: "farewell",
    keywords: ["xatir", "bye", "خوات", "خواتێ", "خواتان", "داوا", "بەخێر"],
    responses: ["بەخێر بڕۆ!", "Xatirê te!", "Goodbye!"]
  }
];

const FALLBACK_RESPONSES = [
  "ببورە، من زانیاریم نییە لەم بابەتەدا. دەتوانی پرسیاری سادەتر بکەیت؟",
  "Bibore, ez li ser vê mijarê zaniyarîyê kêm im. Dikarî pirsêkî hêsan bikî?",
  "Sorry, I don't have that yet. Could you rephrase?"
];

const QUICK_PROMPTS = ["سڵاو", "کات چەندە؟", "ناوت چییە؟", "سوپاس", "خوات"];

const normalize = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[؟?!.،,]/g, " ")
    .replace(/\s+/g, " ");

const matchIntent = (message) => {
  const normalized = normalize(message);
  return INTENTS.find((intent) =>
    intent.keywords.some((keyword) => normalized.includes(keyword))
  );
};

const responseFor = (intent) => {
  if (intent.name === "time") {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `کات ${hh}:${mm} ـە. / Kat ${hh}:${mm} e.`;
  }
  if (intent.name === "date") {
    const today = new Date().toISOString().slice(0, 10);
    return `ئەمڕۆ ${today} ـە. / Îro ${today} e.`;
  }
  return intent.responses[Math.floor(Math.random() * intent.responses.length)];
};

const buildMessage = (role, text) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  text
});

export default function App() {
  const [messages, setMessages] = useState(() => [
    buildMessage("bot", "سڵاو! Slaw! I'm ready to chat in Kurdish."),
    buildMessage("bot", "Try greetings, ask for the time, or say thanks.")
  ]);
  const [input, setInput] = useState("");

  const canSend = input.trim().length > 0;
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const pushMessage = (message) => setMessages((prev) => [...prev, message]);

  const handleSend = (text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    pushMessage(buildMessage("user", trimmed));

    const intent = matchIntent(trimmed);
    const reply = intent ? responseFor(intent) : FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    pushMessage(buildMessage("bot", reply));
    setInput("");
  };

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Kurdish AI Chatbot</p>
          <h1>{BOT_NAME}</h1>
          <p className="subtitle">A lightweight web chat interface for Kurmanji &amp; Sorani users.</p>
        </div>
        <div className="status">
          <span className="status-dot" />
          Local demo
        </div>
      </header>

      <main className="chat-panel">
        <div className="chat-log">
          {reversedMessages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <span className="message-role">{message.role === "bot" ? BOT_NAME : "You"}</span>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="composer">
          <div className="quick-prompts">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="prompt"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="input-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canSend) {
                  handleSend(input);
                }
              }}
              placeholder="Write in Kurdish or English..."
              aria-label="Chat message"
            />
            <button type="button" onClick={() => handleSend(input)} disabled={!canSend}>
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
