async function sendMsg() {
  const m = document.getElementById("msg").value.trim();
  if (!m) return;

  const chatDiv = document.getElementById("chat");
  chatDiv.innerHTML += `<p><b>Kamu:</b> ${m}</p>`;
  document.getElementById("msg").value = "";

  try {
    const r = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: m })
    });

    const d = await r.json();
    const reply = d.reply || "Bot tidak memberikan jawaban.";
    chatDiv.innerHTML += `<p><b>Bot:</b> ${reply}</p>`;

    // Scroll otomatis ke bawah
    chatDiv.scrollTop = chatDiv.scrollHeight;

  } catch (err) {
    chatDiv.innerHTML += `<p><b>Bot:</b> Terjadi kesalahan saat menghubungi server.</p>`;
  }
}
