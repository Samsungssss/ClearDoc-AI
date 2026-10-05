import React, { useState, useRef, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';
import { Send, Mic, MicOff, Search, Brain, Check } from 'lucide-react';

interface ChatSheetProps {
  isOpen: boolean;
  onClose: () => void;
  documentText?: string;
  documentName?: string;
  initialQuery?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  sourceFound?: boolean;
}

const SUGGESTIONS = [
  'What is the final deadline?',
  'What are my next actions?',
  'Are there any penalties mentioned?',
  'Who do I need to contact?',
];

export const ChatSheet: React.FC<ChatSheetProps> = ({
  isOpen,
  onClose,
  documentText = '',
  documentName = 'Document',
  initialQuery = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `I've read "${documentName}". What would you like to clarify?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceFound: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSend(initialQuery);
    }
  }, [initialQuery, isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText,
          question: userMsg.content,
          conversationHistory: messages.slice(-4),
          useThinking,
          useSearchGrounding: useSearch,
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: `msg-${Date.now()}-reply`,
        role: 'assistant',
        content: data.content || 'I could not find an answer in the document.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceFound: data.sourceFoundInDoc,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: 'ClearDoc could not process your question. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoice = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRecorderRef.current = rec;

      rec.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      rec.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const b64 = (reader.result as string).split(',')[1];
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64: b64, mimeType: 'audio/webm' }),
          });
          const d = await res.json();
          if (d.text) {
            setInput(d.text);
          }
        };
      };

      rec.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const stopVoice = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      height="full"
      title="Ask ClearDoc"
      subtitle={documentName}
    >
      <div className="flex flex-col h-[74vh] sm:h-[70vh]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] text-xs sm:text-sm leading-relaxed p-3.5 rounded-[18px] ${
                  m.role === 'user'
                    ? 'bg-[#171717] text-[#FFFFFF] rounded-br-[4px]'
                    : 'bg-[#F5F5F5] text-[#171717] rounded-bl-[4px] border border-[#EEEEEE]'
                }`}
              >
                {m.content}
              </div>
              <span className="text-[10px] text-[#A6A6A6] mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-[#6F6F6F] p-3 bg-[#F5F5F5] rounded-[16px] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#171717] animate-pulse" />
              <span>Reading document...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-3 py-1.5 bg-[#F5F5F5] hover:bg-[#EEEEEE] text-[11px] text-[#333333] border border-[#EEEEEE] rounded-[12px] transition-colors shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-2 border-t border-[#EEEEEE] space-y-2">
          {/* Options toggle row */}
          <div className="flex items-center justify-between text-[11px] text-[#6F6F6F]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseThinking(!useThinking)}
                className={`flex items-center gap-1 transition-colors ${
                  useThinking ? 'text-[#000000] font-semibold' : 'text-[#A6A6A6]'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Deep Audit</span>
              </button>

              <button
                onClick={() => setUseSearch(!useSearch)}
                className={`flex items-center gap-1 transition-colors ${
                  useSearch ? 'text-[#000000] font-semibold' : 'text-[#A6A6A6]'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Grounding</span>
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this document..."
              className="flex-1 bg-[#F5F5F5] hover:bg-[#EEEEEE] focus:bg-[#FFFFFF] border border-[#EEEEEE] focus:border-[#000000] text-xs sm:text-sm text-[#171717] placeholder-[#A6A6A6] rounded-[18px] py-3 pl-4 pr-10 outline-none transition-all"
            />

            <button
              type="button"
              onClick={isRecording ? stopVoice : startVoice}
              className={`w-9 h-9 rounded-[14px] flex items-center justify-center transition-colors ${
                isRecording
                  ? 'bg-[#171717] text-[#FFFFFF]'
                  : 'bg-[#F5F5F5] text-[#6F6F6F] hover:text-[#171717]'
              }`}
              aria-label="Dictate"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-[14px] bg-[#171717] hover:bg-[#000000] disabled:bg-[#D9D9D9] text-[#FFFFFF] flex items-center justify-center transition-colors"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </BottomSheet>
  );
};
