import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DocumentAnalysis } from '../types/document';
import { Send, Mic, MicOff, Search, Brain, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

interface AskAiPanelProps {
  document: DocumentAnalysis;
}

const SUGGESTED_QUESTIONS = [
  'What is this document about?',
  'When is the deadline?',
  'How much do I have to pay?',
  'What documents do I need?',
  'What happens if I miss the deadline?',
  'Explain the penalties or risks.'
];

export const AskAiPanel: React.FC<AskAiPanelProps> = ({ document }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `I am ClearDoc AI. Ask any question about "${document.fileName}". I will prioritize information directly found in this document and alert you if anything is an interpretation or not specified.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceFoundInDoc: true,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);

  // Audio Recording State for Gemini 3.5 Transcribe
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await transcribeRecordedAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access could not be initialized. Please check browser microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeRecordedAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: 'audio/webm',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.text) {
            setInputValue((prev) => (prev ? `${prev} ${data.text}` : data.text));
          }
        }
        setIsTranscribing(false);
      };
    } catch (err) {
      console.error('Transcription error:', err);
      setIsTranscribing(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceFoundInDoc: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const docContext = document.extractedText || JSON.stringify(document);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: docContext,
          question: query,
          conversationHistory: messages.slice(-6),
          useThinking,
          useSearchGrounding,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat service encountered an error.');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        usedThinking: data.usedThinking,
        usedSearchGrounding: data.usedSearchGrounding,
        groundingSources: data.groundingSources,
        sourceFoundInDoc: data.sourceFoundInDoc,
        aiInterpretationWarning: data.aiInterpretationWarning,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I was unable to process your question at this moment. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceFoundInDoc: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ref-card flex flex-col h-[580px] sm:h-[650px] shadow-sm overflow-hidden">
      {/* Panel Header */}
      <div className="p-3.5 sm:p-4 border-b border-[#E2E6EE] bg-[#FFFFFF] flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#111111]">Ask About This Document</h3>
          <p className="text-[11px] text-[#5F6B7C]">
            Grounded in "{document.fileName}". Missing info is disclosed.
          </p>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setUseThinking(!useThinking)}
            className={`ref-btn-secondary !text-xs !py-1.5 !px-2.5 !min-h-[36px] ${
              useThinking ? '!bg-[#DCE1EB] !border-[#CFD5E1] font-semibold' : ''
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Thinking</span>
          </button>

          <button
            type="button"
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`ref-btn-secondary !text-xs !py-1.5 !px-2.5 !min-h-[36px] ${
              useSearchGrounding ? '!bg-[#DCE1EB] !border-[#CFD5E1] font-semibold' : ''
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Suggested Questions Horizontal Scroller */}
      <div className="px-3 sm:px-4 py-2 border-b border-[#E2E6EE] bg-[#F1F3F7] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-[#5F6B7C] uppercase tracking-wider font-semibold shrink-0">
          Prompt:
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="shrink-0 bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#111111] border border-[#D8DFEA] px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-2xs touch-manipulation min-h-[34px] flex items-center"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 bg-[#F8FAFC]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#DCE1EB] border border-[#CFD5E1] text-[#111111] rounded-br-sm shadow-2xs font-medium'
                  : 'bg-[#FFFFFF] border border-[#E2E6EE] text-[#111111] rounded-bl-sm shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Source verification tags */}
              {msg.role === 'assistant' && msg.id !== 'welcome' && (
                <div className="mt-3 pt-2.5 border-t border-[#E2E6EE] flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px]">
                  {msg.sourceFoundInDoc ? (
                    <span className="inline-flex items-center gap-1 text-[#111111] bg-[#F1F3F7] border border-[#D8DFEA] px-2 py-0.5 rounded-md font-medium">
                      <CheckCircle2 className="w-3 h-3 text-[#111111]" />
                      Found in document
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#5F6B7C] bg-[#F1F3F7] border border-[#D8DFEA] px-2 py-0.5 rounded-md">
                      <AlertCircle className="w-3 h-3 text-[#5F6B7C]" />
                      Not in document / AI interpretation
                    </span>
                  )}

                  {msg.usedThinking && (
                    <span className="inline-flex items-center gap-1 text-[#111111] bg-[#F1F3F7] border border-[#D8DFEA] px-2 py-0.5 rounded-md">
                      <Brain className="w-3 h-3 text-[#111111]" />
                      Thinking
                    </span>
                  )}

                  {msg.usedSearchGrounding && (
                    <span className="inline-flex items-center gap-1 text-[#111111] bg-[#F1F3F7] border border-[#D8DFEA] px-2 py-0.5 rounded-md">
                      <Search className="w-3 h-3 text-[#111111]" />
                      Search Grounded
                    </span>
                  )}
                </div>
              )}

              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-2 text-[10px] text-[#5F6B7C] space-y-1">
                  <div className="font-semibold uppercase tracking-wider text-[9px]">Sources Cited:</div>
                  {msg.groundingSources.slice(0, 3).map((src, i) => (
                    <a
                      key={i}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#111111] underline hover:text-[#5F6B7C] truncate"
                    >
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{src.title}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[10px] text-[#808E9F] mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#5F6B7C] bg-[#FFFFFF] border border-[#E2E6EE] rounded-xl p-3 w-fit shadow-2xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#111111]" />
            <span>Reading document with Gemini AI...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recording status */}
      {isRecording && (
        <div className="bg-[#FFFFFF] border-t border-[#E2E6EE] px-4 py-2 flex items-center justify-between text-xs text-[#111111]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#111111] animate-pulse"></span>
            <span>Listening to microphone... Speak your question.</span>
          </div>
          <button
            onClick={stopRecording}
            className="text-xs font-semibold text-[#111111] underline min-h-[36px] flex items-center"
          >
            Done
          </button>
        </div>
      )}

      {isTranscribing && (
        <div className="bg-[#FFFFFF] border-t border-[#E2E6EE] px-4 py-2 flex items-center gap-2 text-xs text-[#5F6B7C]">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#111111]" />
          <span>Transcribing voice with Gemini 3.5 Transcribe...</span>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-2.5 sm:p-3 border-t border-[#E2E6EE] bg-[#FFFFFF]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing || isLoading}
            title={isRecording ? 'Stop Recording' : 'Speak with microphone (Gemini 3.5 Transcribe)'}
            className={`ref-btn-secondary !p-2.5 !min-w-[44px] !min-h-[44px] ${
              isRecording ? '!bg-[#111111] !text-white' : ''
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder={
              isRecording
                ? 'Listening to microphone...'
                : 'Ask a question about this document...'
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || isRecording}
            className="flex-1 text-xs sm:text-sm border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 min-h-[44px] bg-[#FFFFFF] text-[#111111] placeholder:text-[#808E9F] focus:outline-none focus:border-[#111111]"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || isRecording}
            className="ref-btn-primary !p-2.5 !min-w-[44px] !min-h-[44px]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
