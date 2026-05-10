const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const conversation = [];

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);
    conversation.push({ role: 'user', text: userMessage });
    input.value = '';

    // Tampilkan pesan sementara
    const botMessageElement = document.createElement('div');
    botMessageElement.classList.add('message', 'bot');
    botMessageElement.textContent = 'Gemini is thinking...';
    chatBox.appendChild(botMessageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversation }),
        });

        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

        const data = await response.json();

        if (data && data.result) {
            botMessageElement.textContent = data.result;
            conversation.push({ role: 'model', text: data.result });
        } else {
            botMessageElement.textContent = 'Sorry, no response received.';
        }
    } catch (error) {
        console.error('Error:', error);
        botMessageElement.textContent = 'Failed to get response from server.';
    } finally {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}