const tbody = document.getElementById("content-display");

async function init() {
  try {
    const response = await fetch("/api/url");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const urls = await response.json();

    urls.forEach((url) => {
      const id = url.replace(/[^a-zA-Z0-9]/g, "_");

      const row = document.createElement("tr");
      row.id = id;

      row.innerHTML = `
                <td>${url}</td>
                <td class="status">Waiting...</td>
                <td class="statusCode">-</td>
                <td class="responseTime">-</td>
                <td class="error">-</td>
            `;

      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", init);

const protocol = window.location.protocol === "https:" ? "wss" : "ws";

const socket = new WebSocket(`${protocol}://${window.location.host}`);
console.log(socket);
// const socket = new WebSocket("ws://localhost:3000");
const websocket_status = document.getElementById("websocket_status");

socket.onopen = () => {
  websocket_status.textContent = "Connected";
};
let counter = 0;
socket.onmessage = (event) => {
  // console.log(counter)
  const data = JSON.parse(event.data);
  if (data.type === "checking") {
    counter = counter + 1;
    document.getElementById("status").textContent =
      "Refreshed " + counter + " Times";
    return;
  }

  const id = data.url.replace(/[^a-zA-Z0-9]/g, "_");
  const row = document.getElementById(id);
  if (!row) return;

  row.querySelector(".status").textContent = data.status;
  row.querySelector(".statusCode").textContent = data.statusCode;
  row.querySelector(".responseTime").textContent =
    data.responseTime != null ? `${data.responseTime} ms` : "-";
  row.querySelector(".error").textContent = data.error || "-";
};

socket.onclose = () => {
  websocket_status.textContent = "Disconnected";
};

document.getElementById("addBtn").addEventListener("click", async () => {
  const url = document.getElementById("urlInput").value.trim();
  if (!url) return;

  const response = await fetch("/api/url/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (response.ok) {
    document.getElementById("urlInput").value = "";

    const id = url.replace(/[^a-zA-Z0-9]/g, "_");
    if (!document.getElementById(id)) {
      const row = document.createElement("tr");
      row.id = id;
      row.innerHTML = `
                <td>${url}</td>
                <td class="status">Waiting...</td>
                <td class="statusCode">-</td>
                <td class="responseTime">-</td>
                <td class="error">-</td>
            `;
      tbody.appendChild(row);
    }
  }
});
