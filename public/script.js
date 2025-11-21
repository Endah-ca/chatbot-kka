async function sendMsg(){
 const m=document.getElementById("msg").value;
 if(!m) return;
 document.getElementById("chat").innerHTML+=`<p><b>Kamu:</b> ${m}</p>`;
 document.getElementById("msg").value="";
 const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:m})});
 const d=await r.json();
 document.getElementById("chat").innerHTML+=`<p><b>Bot:</b> ${d.reply}</p>`;
}