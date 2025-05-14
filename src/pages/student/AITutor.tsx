import { useState } from 'react';
import { Brain, Send, Book, Lightbulb, History } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your AI tutor. How can I help you with your studies today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: 'I understand your question. Let me help you with that...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.32))]">
      <PageHeader
        title="AI Tutor"
        subtitle="Your personal AI-powered learning assistant"
        icon={Brain}
      />

      <div className="grid grid-cols-4 gap-6 h-full">
        <div className="col-span-3">
          <Card className="p-6 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                onClick={handleSend}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Book className="w-5 h-5 mr-2 text-indigo-600" />
              Study Topics
            </h2>
            <div className="space-y-2">
              {['Mathematics', 'Physics', 'Chemistry', 'Biology'].map(
                (topic) => (
                  <button
                    key={topic}
                    className="w-full p-2 text-left text-sm hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {topic}
                  </button>
                )
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-indigo-600" />
              Quick Tips
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Ask specific questions</p>
              <p>• Request step-by-step explanations</p>
              <p>• Use examples in your questions</p>
              <p>• Ask for practice problems</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <History className="w-5 h-5 mr-2 text-indigo-600" />
              Recent Sessions
            </h2>
            <div className="space-y-2">
              {['Calculus Help', 'Physics Problem', 'Chemistry Review'].map(
                (session) => (
                  <button
                    key={session}
                    className="w-full p-2 text-left text-sm hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {session}
                  </button>
                )
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
