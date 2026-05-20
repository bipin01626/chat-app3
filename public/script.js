const socket = io();

function sendText() {
  let input = document.getElementById("msg");
  let msg = input.value;

  if (msg.trim() === "") return;

  socket.emit("chat message", msg);
  input.value = "";
}

socket.on("chat message", (data) => {
  let li = document.createElement("li");
  li.innerText = data.user + ": " + data.message;
  document.getElementById("messages").appendChild(li);
});

socket.on("users", (users) => {
  document.getElementById("users").innerText = users.join(", ");
});

socket.on("full", (msg) => {
  alert(msg);
});

document.getElementById("msg").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendText();
});