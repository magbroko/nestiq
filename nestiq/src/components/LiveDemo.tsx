import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'nestiq';
  text: string;
  timestamp: Date;
}

const getAIResponse = (userInput: string): string => {
  const input = userInput.toLowerCase().trim();

  if (
    input.includes('hello') ||
    input.includes('hi') ||
    input.includes('hey') ||
    input.includes('good morning') ||
    input.includes('good afternoon')
  ) {
    return "Hello! Welcome to NestIQ. I'm your AI real estate assistant. Are you looking to buy, rent, or invest in a property? Tell me what you have in mind and I'll find the perfect match for you.";
  }

  if (input.includes('budget') || input.includes('afford') || input.includes('cost') || input.includes('price') || input.includes('much')) {
    const amounts = input.match(/[\d,]+/);
    if (amounts) {
      return `Great, a budget of ₦${amounts[0]} gives you some excellent options. I currently have properties ranging from compact luxury apartments to spacious family homes within that range. What type of property are you looking for — apartment, detached house, or townhouse?`;
    }
    return "That's an important consideration! What's your approximate budget range? Knowing this helps me show you only the properties that are a perfect fit for your finances.";
  }

  if (
    input.includes('location') ||
    input.includes('area') ||
    input.includes('island') ||
    input.includes('lagos') ||
    input.includes('abuja') ||
    input.includes('lekki') ||
    input.includes('vi') ||
    input.includes('ikoyi') ||
    input.includes('ajah') ||
    input.includes('victoria')
  ) {
    return "Excellent taste in location! That area has seen strong appreciation over the past 3 years. I have several properties available there. Are you looking for 2, 3, or 4+ bedrooms? And would you prefer a serviced estate or a standalone property?";
  }

  if (
    input.includes('viewing') ||
    input.includes('inspection') ||
    input.includes('visit') ||
    input.includes('see the property') ||
    input.includes('tour')
  ) {
    return "I'd be happy to schedule a viewing for you! I have availability this Saturday at 10:00 AM, 12:00 PM, or 2:00 PM, and Sunday at 11:00 AM. Which time works best for you? I'll send a confirmation and property details to your WhatsApp immediately.";
  }

  if (
    input.includes('saturday') ||
    input.includes('sunday') ||
    input.includes('monday') ||
    input.includes('tuesday') ||
    input.includes('tomorrow') ||
    input.includes('weekend') ||
    input.includes('am') ||
    input.includes('pm')
  ) {
    return "Perfect! Your viewing is confirmed. You'll receive a WhatsApp confirmation within the next 2 minutes with the property address, agent contact, and a checklist of what to bring. Is there anything specific you'd like me to flag for the agent before your visit?";
  }

  if (
    input.includes('bedroom') ||
    input.includes('bed') ||
    input.includes('room') ||
    input.includes('bathroom') ||
    input.includes('ensuite')
  ) {
    const beds = input.match(/(\d+)\s*bed/);
    const count = beds ? beds[1] : '3';
    return `I have ${count === '1' ? 'several' : parseInt(count) > 3 ? '6' : '9'} ${count}-bedroom properties currently available that match your criteria. The top 3 picks based on value-for-money are in Lekki Phase 1, Banana Island, and Victoria Island. Would you like me to send you photos and floor plans for all three?`;
  }

  if (input.includes('mortgage') || input.includes('loan') || input.includes('financing') || input.includes('finance')) {
    return "Great question! NestIQ works with several accredited mortgage providers who offer competitive rates for qualified buyers. Are you a first-time buyer? I can connect you directly with our financing partners — approval decisions typically come within 48 hours.";
  }

  if (
    input.includes('whatsapp') ||
    input.includes('call') ||
    input.includes('contact') ||
    input.includes('speak') ||
    input.includes('agent') ||
    input.includes('human')
  ) {
    return "Absolutely! I'll connect you with one of our specialist agents right away. Before I do, let me send your pre-qualified profile so they can prepare tailored options before your call. Could you confirm your name and preferred contact number?";
  }

  if (input.includes('3 bed') || input.includes('3bed') || input.includes('three bed')) {
    return "Great choice! I have 7 three-bedroom properties available right now. The most popular this week is a fully serviced 3-bed apartment in Lekki Phase 1 at ₦95M, and a detached 3-bed house in Ikeja GRA at ₦78M. What's your budget range so I can narrow it down?";
  }

  if (input.includes('thank') || input.includes('great') || input.includes('perfect') || input.includes('amazing')) {
    return "You're very welcome! NestIQ is here to make your property journey seamless. Is there anything else I can help you with — more listings, pricing comparisons, or neighborhood information?";
  }

  if (input.includes('how') && (input.includes('work') || input.includes('does it') || input.includes('do you'))) {
    return "I'm NestIQ — an AI real estate assistant trained on thousands of property transactions. I can help you find properties, answer questions about listings, check availability, schedule viewings, and connect you with certified agents. What would you like to start with?";
  }

  return "That's a great question! To give you the most relevant property options, could you tell me: (1) your budget range, (2) preferred location, and (3) property type — apartment or house? With those three details, I can match you with the perfect listings immediately.";
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const initialMessages: Message[] = [
  {
    id: '0',
    sender: 'nestiq',
    text: "Hi there! I'm NestIQ, your AI real estate assistant. I can help you find your perfect property, schedule viewings, and answer any questions. What are you looking for today?",
    timestamp: new Date(),
  },
];

export default function LiveDemo() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const delay = 1000 + Math.random() * 800;

    setTimeout(() => {
      const response = getAIResponse(trimmed);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'nestiq',
        text: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = [
    "I'm looking for a 3-bed apartment",
    "What's available in Lekki?",
    "Book a viewing for Saturday",
    "My budget is ₦80 million",
  ];

  return (
    <section
      id="demo"
      className="py-28 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0D1B2A 0%, #091525 50%, #0D1B2A 100%)',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(200,169,110,0.05)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C8A96E' }}>
            Interactive Demo
          </p>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-5"
            style={{ color: '#F4F1EC' }}
          >
            Try NestIQ{' '}
            <span className="gradient-text">Right Now</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(244,241,236,0.6)' }}>
            Type any property question and experience the AI that never sleeps.
            This is exactly what your buyers will encounter.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#0f1e2d',
              border: '1px solid rgba(200,169,110,0.2)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,169,110,0.08)',
            }}
          >
            {/* Chat header */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{
                background: 'rgba(200,169,110,0.07)',
                borderBottom: '1px solid rgba(200,169,110,0.15)',
              }}
            >
              <div className="relative">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #C8A96E, #A88A52)',
                    color: '#0D1B2A',
                  }}
                >
                  <Bot size={20} />
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                  style={{ backgroundColor: '#22c55e', borderColor: '#0f1e2d' }}
                />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#F4F1EC' }}>
                  NestIQ Assistant
                </p>
                <p className="text-xs" style={{ color: '#22c55e' }}>
                  ● Online — replies in seconds
                </p>
              </div>
              <div className="ml-auto">
                <div
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: 'rgba(200,169,110,0.1)',
                    color: '#C8A96E',
                    border: '1px solid rgba(200,169,110,0.2)',
                  }}
                >
                  LIVE DEMO
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4 h-[380px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {msg.sender === 'nestiq' && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto"
                        style={{
                          background: 'linear-gradient(135deg, #C8A96E, #A88A52)',
                          color: '#0D1B2A',
                        }}
                      >
                        <Bot size={14} />
                      </div>
                    )}
                    <div className={`max-w-[78%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div
                        className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                        style={
                          msg.sender === 'user'
                            ? {
                                background: 'rgba(200,169,110,0.18)',
                                color: '#F4F1EC',
                                borderBottomRightRadius: '4px',
                                border: '1px solid rgba(200,169,110,0.25)',
                              }
                            : {
                                background: 'rgba(255,255,255,0.06)',
                                color: '#F4F1EC',
                                borderBottomLeftRadius: '4px',
                                border: '1px solid rgba(255,255,255,0.08)',
                              }
                        }
                      >
                        {msg.text}
                      </div>
                      <span
                        className="text-xs px-1"
                        style={{ color: 'rgba(244,241,236,0.3)' }}
                      >
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2.5 items-end"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #C8A96E, #A88A52)',
                        color: '#0D1B2A',
                      }}
                    >
                      <Bot size={14} />
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#C8A96E' }}
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.18,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div
              className="px-5 py-3"
              style={{ borderTop: '1px solid rgba(200,169,110,0.08)' }}
            >
              <p className="text-xs mb-2.5" style={{ color: 'rgba(244,241,236,0.35)' }}>
                Quick replies:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(reply);
                      inputRef.current?.focus();
                    }}
                    className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 hover:scale-105"
                    style={{
                      background: 'rgba(200,169,110,0.08)',
                      color: '#C8A96E',
                      border: '1px solid rgba(200,169,110,0.2)',
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div
              className="px-4 py-4 flex items-center gap-3"
              style={{
                borderTop: '1px solid rgba(200,169,110,0.12)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about properties, pricing, viewings..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[rgba(244,241,236,0.3)]"
                style={{
                  color: '#F4F1EC',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                disabled={isTyping}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: input.trim() && !isTyping
                    ? 'linear-gradient(135deg, #C8A96E, #A88A52)'
                    : 'rgba(200,169,110,0.2)',
                }}
                whileHover={input.trim() && !isTyping ? { scale: 1.1 } : {}}
                whileTap={input.trim() && !isTyping ? { scale: 0.9 } : {}}
              >
                <Send size={16} style={{ color: input.trim() && !isTyping ? '#0D1B2A' : '#C8A96E' }} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
