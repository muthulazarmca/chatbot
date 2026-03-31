import dayjs from 'dayjs';
import { useState } from 'preact/hooks';
import { Chatbot } from 'supersimpledev';
import LoaderImage from '../assets/loading-spinner.gif';
import './ChatInput.css';

export function ChatInput({chatMessages, setChatMessages}) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function saveInpuText(event) {
    setInputText(event.target.value);
  }

  async function sendMessage() {
    if (isLoading || inputText === '') {
    return;
    }

    const messageToSend = inputText; // ✅ store first
    // Set isLoading to true at the start, and set it to
    // false after everything is done.
    setIsLoading(true);

    // We can put this at the top of the function or
    // after the first setChatMessages(). Both work.
    setInputText('');
  
    const newChatMessages = [
      ...chatMessages,
      {
      message: inputText,
      sender: 'user',
      id: crypto.randomUUID(),
      time: dayjs().valueOf()
      }
    ];
    // setChatMessages(newChatMessages);
    setChatMessages([
      ...newChatMessages,
      // This creates a temporary Loading... message.
      // Because we don't save this message in newChatMessages,
      // it will be remove later, when we add the response.
      {
        message: <img src={LoaderImage} className="loading-spinner" />,
        sender: 'robot',
        id: crypto.randomUUID()
      }
    ]);

    const response = await Chatbot.getResponseAsync(messageToSend);
    setChatMessages([
      ...newChatMessages,
      {
      message: response,
      sender: 'robot',
      id: crypto.randomUUID(),
      time: dayjs().valueOf()
      }
    ]);
    // Set isLoading to false after everything is done.
    setIsLoading(false);
    // setInputText('');
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // IMPORTANT
        sendMessage();
    } else if (event.key === 'Escape') {
        setInputText('');
    }            
  }

  function clearMessages() {
    setChatMessages([]);

    // Here, you could also run:
    // localStorage.setItem('messages', JSON.stringify([]));

    // However, because chatMessages is being updated, the
    // useEffect in the App component will run, and it will
    // automatically update messages in localStorage to be [].
  }

  return (
    <div className="chat-input-container">
      <input 
        placeholder="Send a message to Chatbot" 
        size="30" 
        onChange = {saveInpuText}
        onKeyUp={handleKeyDown}
        value={inputText}
        className="chat-input"
      />
      <button
      onClick = {sendMessage}
      className="send-button"
      >Send</button>
      <button
        onClick={clearMessages}
        className="clear-button"
      >Clear</button>
    </div>
  );
}