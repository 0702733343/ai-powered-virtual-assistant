/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, RotateCcw, Box, Wrench, Shield, Phone, Sparkles, AlertCircle, Info, ChevronRight, Check } from 'lucide-react';
import { Header } from './components/Header';
import { MessageItem } from './components/MessageItem';
import { QuickPrompts } from './components/QuickPrompts';
import { ProtocolDrawer } from './components/ProtocolDrawer';
import { ColorModal } from './components/ColorModal';
import { MachiningCallout } from './components/MachiningCallout';
import { ContainerGraphic } from './components/ContainerGraphic';
import { ChatMessage } from './types';
import { COMPANY_PROFILE, CONTAINER_COLORS } from './data/protocol';
import { playMessageSound, playSendSound } from './utils/audio';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'cymbal-welcome',
  role: 'assistant',
  content:
    'Hello and welcome to Cymbal Manufacturing! I am your official Virtual Assistant. At Cymbal Manufacturing, our primary business is building durable storage containers, typically available in blue or green, and occasionally in red. We are also capable of doing custom machining based on request.\n\nHow may I assist you today? You can ask about our container applications, durability, or storage best practices. If you have inquiries about custom machining or need immediate assistance, please feel free to call our company directly at **(333) 333-3333**.',
  timestamp: new Date(),
  status: 'complete',
  source: 'system',
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);

  // Modals state
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  // Active color preview in sidebar
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Speech Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
        };

        recognition.onerror = (e: any) => {
          console.error('Speech recognition error:', e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        speechRecognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition', err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    if (soundEnabled) {
      playSendSound();
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
      status: 'complete',
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'streaming',
      source: 'gemini-3.8-flash',
    };

    setMessages((prev) => [...prev, initialAssistantMsg]);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: accumulatedText, status: 'streaming' }
                      : m
                  )
                );
              }
            } catch {
              // Ignore partial JSON chunks
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: accumulatedText || 'Thank you for your inquiry. Please call (333) 333-3333 for assistance.', status: 'complete' }
            : m
        )
      );

      if (soundEnabled) {
        playMessageSound();
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback direct request
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: data.text || 'Thank you for contacting Cymbal Manufacturing. Please call (333) 333-3333.',
                  status: 'complete',
                  source: data.source || 'fallback',
                }
              : m
          )
        );
      } catch (fallbackErr) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content:
                    'Thank you for reaching out to Cymbal Manufacturing. If you need any assistance with our storage containers or custom machining, please contact our team directly at (333) 333-3333.',
                  status: 'complete',
                  source: 'fallback',
                }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to reset this conversation?')) {
      setMessages([
        {
          ...INITIAL_WELCOME_MESSAGE,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleExportTranscript = () => {
    const formatted = messages
      .map(
        (m) =>
          `[${m.timestamp.toLocaleString()}] ${
            m.role === 'assistant' ? 'CYMBAL ASSISTANT' : 'USER'
          }:\n${m.content}\n`
      )
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cymbal-manufacturing-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentSideColor = CONTAINER_COLORS[activeColorIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenProtocol={() => setIsProtocolOpen(true)}
        onOpenColorDrawer={() => setIsColorModalOpen(true)}
        onExportTranscript={handleExportTranscript}
        messageCount={messages.length}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Information & Verification Sidebar (Desktop & Tablet) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Company Core Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white">Storage Containers</h2>
              </div>
              <button
                onClick={() => setIsColorModalOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Full Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive container color visual */}
            <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 text-center relative overflow-hidden group">
              <ContainerGraphic colorHex={currentSideColor.colorHex} className="w-full h-32" />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 px-1 text-xs">
                <span className="font-semibold text-slate-200">{currentSideColor.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentSideColor.frequency === 'Typical'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                      : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                  }`}
                >
                  {currentSideColor.frequency}
                </span>
              </div>
            </div>

            {/* Color switcher dots */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {CONTAINER_COLORS.map((col, idx) => {
                const isActive = activeColorIndex === idx;
                return (
                  <button
                    key={col.name}
                    onClick={() => setActiveColorIndex(idx)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      isActive
                        ? 'bg-slate-850 border-blue-500 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/20"
                        style={{ backgroundColor: col.colorHex }}
                      />
                      <span className="text-[11px] font-bold text-white truncate">
                        {col.name.split(' ')[1] || col.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {col.frequency}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Colors Rule note */}
            <div className="mt-3 p-2 bg-slate-950/50 rounded-lg border border-slate-800 text-[11px] text-slate-400 leading-snug">
              <strong className="text-slate-300">Standard Rule:</strong> Containers are typically{' '}
              <span className="text-blue-400 font-medium">blue</span> or{' '}
              <span className="text-emerald-400 font-medium">green</span>, and occasionally{' '}
              <span className="text-rose-400 font-medium">red</span>.
            </div>
          </div>

          {/* Machining Protocol Banner */}
          <MachiningCallout
            onInquireMachining={() =>
              handleSendMessage(
                'I need custom machining for some titanium brackets. Can you help me with that?'
              )
            }
          />

          {/* Official Verification Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Assistant Compliance Directives
                </h3>
              </div>
              <button
                onClick={() => setIsProtocolOpen(true)}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-medium underline"
              >
                Inspect
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Primary Business:</strong> Storage containers; Custom machining by request.
                </span>
              </div>
              <div className="flex items-start gap-2 text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Machining Rule:</strong> Mandatory escalation to (333) 333-3333; no chat quoting.
                </span>
              </div>
              <div className="flex items-start gap-2 text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Wild Guesses:</strong> Always admit uncertainty on unverified specs &amp; suggest calling.
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Direct Hotline:</span>
              <a
                href={`tel:${COMPANY_PROFILE.phoneClean}`}
                className="font-bold text-amber-400 hover:underline"
              >
                {COMPANY_PROFILE.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Central Chat Interface */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[550px] lg:h-[calc(100vh-140px)]">
          {/* Chat Header Bar */}
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute inset-0 opacity-75" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Cymbal Virtual Assistant Live Session
                </span>
                <span className="text-[10px] text-slate-400">
                  Model: Gemini 3.8 Flash &bull; Prompt Policy Enforced
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClearChat}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 border-b border-slate-800/80 bg-slate-950/30">
            <QuickPrompts onSelectPrompt={handleSendMessage} disabled={isLoading} />
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                onCallCompany={() => window.open(`tel:${COMPANY_PROFILE.phoneClean}`)}
              />
            ))}

            {/* Loading / Typing indicator */}
            {isLoading && messages[messages.length - 1]?.status !== 'streaming' && (
              <div className="flex gap-3 justify-start my-4">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 text-xs text-slate-400 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>Cymbal Assistant is formulating verified response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/70">
            <div className="relative bg-slate-900 border border-slate-700/80 focus-within:border-blue-500 rounded-xl transition-all shadow-inner">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about storage container applications, colors, durability, or custom machining..."
                rows={2}
                disabled={isLoading}
                className="w-full bg-transparent p-3 pr-24 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
              />

              {/* Action buttons inside textarea bar */}
              <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
                {/* Voice Input button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak your inquiry'}
                  aria-label={isListening ? 'Stop listening' : 'Speak your inquiry'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Send button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom helper micro-text */}
            <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500">
              <span className="hidden sm:inline">
                Press <kbd className="px-1 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">Shift+Enter</kbd> for new line
              </span>
              <span className="ml-auto flex items-center gap-1">
                <span>Questions requiring escalation:</span>
                <a href={`tel:${COMPANY_PROFILE.phoneClean}`} className="text-amber-400 hover:underline font-semibold">
                  {COMPANY_PROFILE.phone}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Modal */}
      <ProtocolDrawer
        isOpen={isProtocolOpen}
        onClose={() => setIsProtocolOpen(false)}
        onSelectPrompt={(prompt) => handleSendMessage(prompt)}
      />

      {/* Color Catalog Modal */}
      <ColorModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onAskAboutColor={(prompt) => handleSendMessage(prompt)}
      />
    </div>
  );
}
