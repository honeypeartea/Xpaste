import React, { useState } from 'react';
import { sendText} from "./service/ApiService";


const TextBox: React.FC = () => {
    const [text, setText] = useState<string>('');

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const handleSend = async () => {
        const response = await sendText(text);
        console.log('Response:', response);
    };

    return (
        <div>
            <input type="text" value={text} onChange={handleTextChange} />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default TextBox;
