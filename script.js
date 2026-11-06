
/*
Copyright (c) 2026 Bisan Subba.
All rights reserved.
Bsun AI Chatbot — Frontend JavaScript
*/

"use strict";

// The AI connection remains disabled for safety.
const AI_ENABLED = false;

// Display a message in the conversation area.
function addMessage(text, sender) {
    const chat = document.querySelector(".chat");

    if (!chat) return;

    const message = document.createElement("div");
    message.className = "message";

    if (sender === "user") {
        message.style.background = "#245b91";
        message.style.marginTop = "12px";
    } else {
        message.style.marginTop = "12px";
    }

    // textContent prevents messages being interpreted as HTML.
    message.textContent = text;

    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}

// Prepare a safe local demonstration.
function sendMessage() {
    if (!AI_ENABLED) {
        addMessage(
            "AI connection is not enabled yet.",
            "assistant"
        );
        return;
    }
}
