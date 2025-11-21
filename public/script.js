async function sendMsg() {
    const m = document.getElementById("msg").value.trim();
    if (!m) return;

    document.getElementById("chat").innerHTML += `<p><b>Kamu:</b> ${m}</p>`;
    document.getElementById("msg").value = "";

    const r = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: m })
    });

    const d = await r.json();

    const reply = d.reply || "Bot tidak memberikan jawaban.";

    document.getElementById("chat").innerHTML += `<p><b>Bot:</b> ${reply}</p>`;
}
