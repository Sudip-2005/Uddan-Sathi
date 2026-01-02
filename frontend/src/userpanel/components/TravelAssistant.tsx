import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Loader2, RefreshCcw } from "lucide-react";
import ReactMarkdown from "react-markdown"; // Import the formatter
import { Button } from "@/components/ui/button";
import { getTravelAssistantResponse } from "../services/aiService";

const TravelAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "model", text: "### Welcome to AirCare Bot! 🤖\nHow can I help you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever a new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const aiResponse = await getTravelAssistantResponse(input, messages);
    setMessages((prev) => [...prev, { role: "model", text: aiResponse }]);
    setIsTyping(false);
  };

  const clearChat = () => {
    setMessages([{ role: "model", text: "Chat cleared. How can I help now?" }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white rounded-[2rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          
          {/* Enhanced Header */}
          <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Bot size={24} />
              </div>
              <div>
                <p className="font-bold leading-none text-base">AirCare Bot</p>
                <span className="flex items-center gap-1 text-[10px] opacity-80 mt-1 uppercase tracking-tighter">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Ready to assist
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={clearChat} className="hover:bg-white/10 p-2 rounded-full transition-colors" title="Clear Chat">
                <RefreshCcw size={18} />
              </button>
              <button 
  onClick={() => setIsOpen(!isOpen)}
  className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
>
  {isOpen ? <X size={28} /> : <Bot size={28} />}
</button>
            </div>
          </div>

          {/* Chat Body with Markdown Support */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#F8FAFC]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-white text-slate-800 border border-slate-100 rounded-tl-none prose prose-slate"
                }`}>
                  {/* Markdown Component handles the formatting */}
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 size={18} className="animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about your query..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
            <Button 
              onClick={handleSend} 
              disabled={isTyping || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 h-12 w-12 rounded-xl shadow-md transition-transform active:scale-90"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button (robot icon) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Travel Assistant"
        title="Travel Assistant"
        className="w-16 h-16 bg-gradient-to-br from-slate-900 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </button>
    </div>
  );
};

export default TravelAssistant;