
const morse = {
A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--",
Z: "--..",
1: ".----", 2: "..---", 3: "...--", 4: "....-",
5: ".....", 6: "-....", 7: "--...", 8: "---..",
9: "----.", 0: "-----",
" ": "/"
};

let socket = null;

function toMorse(text){
    return text
        .toUpperCase()
        .split("")
        .map(c => morse[c] || "")
        .join(" ");
}

function addMessage(username, text){

    const chat = document.getElementById("chat");

    const bubble = document.createElement("div");
    bubble.className = "message";

    if(username === "Helper"){
        bubble.classList.add("self");
    }

    const time = new Date().toLocaleTimeString();

    bubble.innerHTML = `
        <div class="message-header">
            <span>${username}</span>
            <span>${time}</span>
        </div>
        <div class="message-text">${text}</div>
        <div class="message-morse">${toMorse(text)}</div>
    `;

    chat.appendChild(bubble);

    // Auto scroll
    setTimeout(() => {
        chat.scrollTop = chat.scrollHeight;
    }, 0);
}

function connect(){

    let ip = document.getElementById("connection-code").value.trim();

    if (!ip) {
        ip = "localhost";
    }

    const protocol = location.protocol === "https:" ? "wss://" : "ws://";

    socket = new WebSocket(protocol + ip + ":3000");

    socket.onopen = () => {

        document.querySelector(".connection").classList.add("hidden");

        document.getElementById("status").textContent = "Connected";

        const dot = document.getElementById("dot");
        dot.classList.remove("dot-gray","dot-red");
        dot.classList.add("dot-green");
    };

    socket.onmessage = (event)=>{
        const data = JSON.parse(event.data);
        addMessage(data.user, data.text);
    };

    socket.onerror = ()=>{
        alert("Connection failed");
    };

    socket.onclose = ()=>{
        document.getElementById("status").textContent = "Disconnected";

        const dot = document.getElementById("dot");
        dot.classList.remove("dot-green");
        dot.classList.add("dot-red");
    };
}

function send(){

    const input = document.getElementById("message-input");
    const text = input.value.trim();

    if(!text || !socket || socket.readyState !== WebSocket.OPEN){
        return;
    }

    socket.send(JSON.stringify({
        user: "Helper",
        text: text
    }));

    addMessage("Helper", text);

    input.value = "";
}

// Button events
document.getElementById("connect-button").onclick = connect;
document.getElementById("send-button").onclick = send;

// Enter key to send
document.getElementById("message-input").addEventListener("keydown", (e)=>{
    if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        send();
    }
});
