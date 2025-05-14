import { useState, useEffect } from 'react';
import { Paperclip, Send, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

interface ChatMessage {
  sender: string;
  message: string;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Preload some initial messages or welcome message
    setMessages([
      { sender: 'AI', message: 'Hello, Faculty! How can I assist you today?' },
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;
    
    // Add user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'Faculty', message: userInput },
    ]);

    // Simulate AI response (This could be replaced with actual API calls)
    setLoading(true);
    setUserInput('');

    // Call your AI API here (for example, OpenAI's API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(userInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'AI', message: aiResponse },
      ]);
      setLoading(false);
    }, 1500); // Simulate delay for AI response
  };

  const generateAIResponse = (query: string) => {
    // Example AI responses (replace with real API logic)
    if (query.toLowerCase().includes('grading')) {
      return "I can help you grade assignments! Please provide the assignment details.";
    } else if (query.toLowerCase().includes('lecture notes')) {
      return "I can assist with finding or creating lecture notes. Please specify the topic.";
    } else if (query.toLowerCase().includes('assignments')) {
      return "I can help you manage assignments! Let me know the details of the assignment.";
    }
    return "I'm here to assist you with any course-related tasks. How can I help you today?";
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([{ sender: 'AI', message: 'Hello, Faculty! How can I assist you today?' }]);
    setUserInput('');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Assistant for Faculty"
        subtitle="Get instant help with course-related tasks"
        icon={Paperclip}
        />
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8 flex flex-col h-full">
        {/* Reset Chat */}
        <button
          onClick={handleResetChat}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          <RefreshCw className="w-4 h-4 inline-block mr-2" />
          Reset Chat
        </button>

        {/* Chat Messages */}
        <div className="flex-1 bg-gray-100 p-4 rounded-lg overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                msg.sender === 'Faculty' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <strong>{msg.sender}:</strong>
              <p>{msg.message}</p>
            </div>
          ))}
          {loading && (
            <div className="p-3 rounded-lg bg-gray-200 text-gray-700">
              <strong>AI:</strong> Processing your request...
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything related to your course..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Attachments */}
        <div className="mt-4 text-sm text-gray-600 flex items-center space-x-2">
          <Paperclip className="w-5 h-5 text-gray-500" />
          <span>Attach Files</span>
        </div>
      </div>
    </div>
  );
}
