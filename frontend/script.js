const socket = io();

// Prompt for username once
const username = prompt("Enter your name:") || "Anonymous";

const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");

// Join chat
socket.emit("join", username);

// Send message to server (do NOT add locally, server will broadcast)
sendBtn.addEventListener("click", () => {
  const text = messageInput.value;
  if (!text) return;
  const msgObj = { username, message: text };
  socket.emit("chatMessage", msgObj); // send to server
  messageInput.value = "";
});

// Listen for all messages from server
socket.on("chatMessage", (msgObj) => {
  addMessage(msgObj, msgObj.username === username);
});

// Function to add message to UI
function addMessage(msgObj, self) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add(self ? "self" : "other");
  div.textContent = `${msgObj.username}: ${msgObj.message}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  // Show notification if message from other user
  if (!self && "serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.active.postMessage({
        type: "show-notification",
        payload: msgObj,
      });
    });
  }
}

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker Registered ✅");
  });
}
