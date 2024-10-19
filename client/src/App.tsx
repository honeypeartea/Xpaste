import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://192.168.0.29:3001'; // Replace with your actual server IP
const socket = io(SERVER_URL);

const App: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<{ text: string }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        socket.on('messageReceived', (msg: { text: string }) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('messageReceived');
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = { text: message };
            socket.emit('sendMessage', newMessage);
            setMessage('');
        }
    };

    const copyLatestMessage = () => {
        if (messages.length > 0) {
            const textToCopy = messages[messages.length - 1].text;

            if (navigator.clipboard && window.isSecureContext) {
                // For modern browsers
                navigator.clipboard.writeText(textToCopy)
                    .then(() => alert('Latest message copied to clipboard!'))
                    .catch(err => console.error('Failed to copy message: ', err));
            } else {
                // Fallback for older browsers and mobile
                const textArea = textAreaRef.current;
                if (textArea) {
                    textArea.value = textToCopy;
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        alert('Latest message copied to clipboard!');
                    } catch (err) {
                        console.error('Failed to copy message: ', err);
                    }
                    textArea.blur();
                }
            }
        } else {
            alert('No messages to copy');
        }
    };

    return (
        <div className="App" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Real-Time Chat</h1>
            <div className="input-area" style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message here..."
                    style={{ width: 'calc(100% - 120px)', marginRight: '10px', padding: '10px' }}
                />
                <button onClick={sendMessage} style={{ padding: '10px', width: '100px' }}>Send</button>
            </div>
            <button onClick={copyLatestMessage} style={{ marginBottom: '10px', padding: '10px' }}>
                Copy Latest Message
            </button>
            <div className="messages" style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                {messages.map((msg, index) => (
                    <p key={index} className="message" style={{ margin: '5px 0' }}>{msg.text}</p>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <textarea
                ref={textAreaRef}
                style={{ position: 'absolute', left: '-9999px' }}
                aria-hidden="true"
            />
        </div>
    );
};

export default App;