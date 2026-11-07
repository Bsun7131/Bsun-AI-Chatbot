/*
Copyright (c) 2026 Bisan Subba.
All rights reserved.
Bsun AI Chatbot — Frontend JavaScript
*/

"use strict";

// Public Cloudflare Worker endpoint.
// No private keys or tokens are stored here.
const WORKER_URL =
  "https://bsun-ai-chatbot-api.bisansubba.workers.dev/public-chat";

// Display a message in the conversation area.
function addMessage(text, sender) {
  const chat = document.querySelector(".chat");

  if (!chat) return;

  const message = document.createElement("div");
  message.className = "message";

  if (sender === "user") {
  message.style.background = "#245b91";
} else {
  message.style.background = "#254766";
}

  message.style.marginTop = "12px";

  // Prevent messages from being interpreted as HTML.
  message.textContent =
  sender === "assistant"
    ? text.replace(/\*\*(.*?)\*\*/g, "$1")
    : text;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

// Send a verified message to Bsun AI Chatbot.
async function sendMessage() {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!input || !sendBtn || sendBtn.disabled) return;

  const message = input.value.trim();

  if (!message) return;

  // Check that Cloudflare Turnstile has loaded.
  if (
    !window.turnstile ||
    typeof window.turnstile.getResponse !== "function"
  ) {
    addMessage(
      "Security verification is still loading. Please wait.",
      "assistant"
    );
    return;
  }

  // Get the visitor's Turnstile verification token.
  const turnstileToken = window.turnstile.getResponse();

  if (!turnstileToken) {
    addMessage(
      "Please complete the Cloudflare security verification first.",
      "assistant"
    );
    return;
  }

  sendBtn.disabled = true;

  addMessage(message, "user");
  input.value = "";

  try {
    // Send the message securely to Cloudflare Worker.
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        turnstileToken: turnstileToken
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "The AI service is unavailable."
      );
    }

    // Display the AI response.
    addMessage(
      data.reply || "No AI response received.",
      "assistant"
    );

  } catch (error) {
    addMessage(
      "Error: " + error.message,
      "assistant"
    );

  } finally {
    sendBtn.disabled = false;

    // Turnstile tokens are single-use.
    // Reset the widget for the next message.
    if (
      window.turnstile &&
      typeof window.turnstile.reset === "function"
    ) {
      window.turnstile.reset();
    }
  }
}
