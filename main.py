#!/usr/bin/env python3
"""Kurdish AI chatbot (Kurmanji & Sorani) with a small intent engine."""
from __future__ import annotations

import argparse
import datetime as dt
import random
import re
from typing import Iterable

BOT_NAME = "KurdishBot"

INTENTS = [
    {
        "name": "greeting",
        "keywords": {
            "slaw",
            "slav",
            "silav",
            "sllaw",
            "سڵاو",
            "سلام",
            "merheba",
            "hello",
            "hi",
        },
        "responses": [
            "سڵاو! چۆن دەتوانم یارمەتیت بدەم؟",
            "Slaw! Ez çawa dikarim alîkari te bikim?",
            "Hello! How can I help you today?",
        ],
    },
    {
        "name": "thanks",
        "keywords": {"سوپاس", "spas", "supas", "thank", "thanks"},
        "responses": [
            "Spas! Herdem amade me.",
            "سوپاس! هەموو جارێک لە خزمەتت دام.",
            "You're welcome!",
        ],
    },
    {
        "name": "name",
        "keywords": {"nav", "name", "ناو", "ناوت", "navê"},
        "responses": [
            f"Navê min {BOT_NAME} e.",
            f"ناوی من {BOT_NAME}ە.",
        ],
    },
    {
        "name": "time",
        "keywords": {"kat", "time", "کات"},
        "responses": [],
    },
    {
        "name": "date",
        "keywords": {"roj", "date", "ڕۆژ", "بەروار", "berwar"},
        "responses": [],
    },
    {
        "name": "help",
        "keywords": {"help", "alîkarî", "یارمەتی", "ferman", "commands"},
        "responses": [
            "دەکرێت پرسیاری سادە بکەیت وەک: ناوت چییە؟ کات چەندە؟",
            "Tu dikarî pirsên bingehîn bikî: Navê te çi ye? Kat çend e?",
            "You can ask: What's your name? What time is it?",
        ],
    },
    {
        "name": "farewell",
        "keywords": {"xatir", "bye", "خوات",
                     "خواتێ", "خواتان", "داوا", "بەخێر"},
        "responses": [
            "بەخێر بڕۆ!",
            "Xatirê te!",
            "Goodbye!",
        ],
    },
]

FALLBACK_RESPONSES = [
    "ببورە، من زانیاریم نییە لەم بابەتەدا. دەتوانی پرسیاری سادەتر بکەیت؟",
    "Bibore, ez li ser vê mijarê zaniyarîyê kêm im. Dikarî pirsêkî hêsan bikî?",
    "Sorry, I don't have that yet. Could you rephrase?",
]


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[؟?!.،,]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def match_intent(message: str) -> dict | None:
    normalized = normalize(message)
    for intent in INTENTS:
        if any(keyword in normalized for keyword in intent["keywords"]):
            return intent
    return None


def response_for(intent: dict) -> str:
    if intent["name"] == "time":
        now = dt.datetime.now().strftime("%H:%M")
        return f"کات {now} ـە. / Kat {now} e."
    if intent["name"] == "date":
        today = dt.date.today().strftime("%Y-%m-%d")
        return f"ئەمڕۆ {today} ـە. / Îro {today} e."
    return random.choice(intent["responses"])


def chat_loop(user_name: str | None) -> None:
    print(f"{BOT_NAME}: سڵاو! Slaw! I'm ready to chat in Kurdish.")
    if user_name:
        print(f"{BOT_NAME}: خۆشحاڵم بە بینینت، {user_name}!")

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print(f"\n{BOT_NAME}: Xatirê te!")
            break

        if not user_input:
            continue

        intent = match_intent(user_input)
        if intent:
            reply = response_for(intent)
            print(f"{BOT_NAME}: {reply}")
            if intent["name"] == "farewell":
                break
        else:
            print(f"{BOT_NAME}: {random.choice(FALLBACK_RESPONSES)}")


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Kurdish AI chatbot")
    parser.add_argument("--name", help="Your name (optional)")
    return parser.parse_args(argv)


def main() -> None:
    args = parse_args()
    chat_loop(args.name)


if __name__ == "__main__":
    main()
