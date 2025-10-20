import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Image as ImageIcon, History, Star, Settings, Users, HelpCircle } from "lucide-react";

export default function ReduxAI() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpBoxOpen, setHelpBoxOpen] = useState(false);
  const chatEndRef = useRef(null);

  const handleAsk = async (query) => {
    if (!query.trim()) return;
    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const apiKey = "YOUR_API_KEY";
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "google/gemma-3n-e2b-it:free", messages: [...messages, userMessage], max_tokens: 500 }),
      });
      const data = await res.json();
      const answer = data?.choices?.[0]?.message?.content || "Sorry, I couldn't find an answer.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error fetching AI response." }]);
    } finally {
      setLoading(false);
    }
    setPrompt("");
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleAsk(prompt); };
  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, { name: file.name, src: event.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => { e.preventDefault(); };

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen flex flex-col bg-gradient-to-b from-black via-purple-950 to-black`} onDrop={handleDrop} onDragOver={handleDragOver}>      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-black shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 rounded-r-2xl overflow-hidden`}>
        <div className="p-6 flex flex-col gap-6 bg-black">
          <button className="flex items-center gap-2 text-white hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-purple-900 transition">
            <History /> Chat History
          </button>
          <button className="flex items-center gap-2 text-white hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-purple-900 transition">
            <Star /> Favorites
          </button>
          <button className="flex items-center gap-2 text-white hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-purple-900 transition">
            <Settings /> Settings
          </button>
          <button className="flex items-center gap-2 text-white hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-purple-900 transition">
            <Users /> Shared AI Sessions
          </button>
          <button className="flex items-center gap-2 text-white hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-purple-900 transition">
            <Star /> Public Prompts
          </button>
        </div>
      </div>

      {/* Help Box */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-purple-950/90 text-white shadow-lg border-l border-purple-800 transform ${helpBoxOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 rounded-l-2xl p-6 flex flex-col gap-4`}>        
        <h2 className="text-2xl font-bold mb-3">Help & Support</h2>
        <p className="text-sm text-purple-200">Need help? Here’s what you can do:</p>
        <ul className="list-disc list-inside space-y-2 text-purple-300">
          <li>💡 Type your questions in the chat box below.</li>
          <li>📤 Drag & drop images to analyze or process.</li>
          <li>🧠 Use Shared Sessions to collaborate with friends.</li>
          <li>🌐 Explore Public Prompts to get inspiration.</li>
        </ul>
      </div>

      {/* Top Buttons */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-6 left-6 z-20 bg-purple-900 p-3 rounded-full text-white shadow-lg hover:bg-purple-800 transition"
      >
        ☰
      </button>

      <button
        onClick={() => setHelpBoxOpen(!helpBoxOpen)}
        className="fixed top-6 right-6 z-20 bg-purple-900 p-3 rounded-full text-white shadow-lg hover:bg-purple-800 transition"
      >
        <HelpCircle size={24} />
      </button>

      {/* Center Logo */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent tracking-wide drop-shadow-lg">
          Redux
        </h1>
      </div>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full flex flex-col gap-4 mt-32 rounded-3xl bg-transparent">          
        {messages.map((msg, idx) => (
          <div key={idx} className={`px-6 py-4 rounded-3xl max-w-[75%] flex justify-between items-start transition-colors duration-500 ${msg.role === "user" ? "self-end bg-purple-800 text-white shadow-md hover:bg-purple-700" : "self-start bg-purple-900 border border-purple-800 text-white shadow-inner hover:bg-purple-800"}`}>              
            <span className="break-words">{msg.content}</span>
          </div>
        ))}
        {loading && (
          <div className="self-start px-6 py-4 rounded-3xl max-w-[75%] bg-purple-900 border border-purple-800 text-white flex items-center gap-3 animate-pulse shadow-inner">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-150"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-300"></div>
            Redux is typing...
          </div>
        )}
        <div ref={chatEndRef}></div>

        {/* Display Dropped Images */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, index) => (
              <div key={index} className="w-32 h-32 rounded-xl overflow-hidden border border-purple-800">
                <img src={img.src} alt={img.name} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Input Bar */}
      <div className="bg-black p-5 shadow-xl flex items-center gap-4 max-w-4xl mx-auto w-full rounded-3xl mt-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything or generate image..."
          className="flex-1 border border-purple-900 rounded-full px-6 py-3 bg-purple-950 text-white outline-none placeholder-purple-400 focus:ring-2 focus:ring-purple-500 transition-colors duration-500"
        />
        <button
          className="bg-purple-900 text-white p-3 rounded-full hover:bg-purple-800 transition-shadow shadow-lg"
          onClick={() => handleAsk(prompt)}
        >
          <Send size={24} />
        </button>
        <button className="text-purple-400 hover:text-purple-500 transition">
          <ImageIcon size={24} />
        </button>
        <button className="text-purple-400 hover:text-purple-500 transition">
          <Mic size={24} />
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-purple-400 hover:text-purple-500 transition"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  );
}
