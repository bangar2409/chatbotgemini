document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function appendMessage(sender, text) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    // Scroll ke bawah
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const text = userInput.value.trim();

    if (text === '') return;

    appendMessage('user', text);
    userInput.value = '';

    // URL BACKEND LOKAL (Pastikan server.js berjalan di port 3000)
    const backendUrl = 'http://localhost:3000/api/chat'; 

    try {
        // Tampilkan pesan loading
        const loadingMsg = document.createElement('div');
        loadingMsg.classList.add('message', 'bot', 'loading');
        loadingMsg.textContent = 'Gemini sedang mengetik...';
        document.getElementById('chat-box').appendChild(loadingMsg);
        document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: text }),
        });

        // Hapus pesan loading
        if (document.querySelector('.loading')) {
            document.querySelector('.loading').remove();
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.response; 

        appendMessage('bot', botResponse);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Hapus pesan loading jika ada error
        if (document.querySelector('.loading')) {
            document.querySelector('.loading').remove();
        }
        appendMessage('bot', 'Maaf, terjadi kesalahan saat menghubungi server atau API.');
    }
}