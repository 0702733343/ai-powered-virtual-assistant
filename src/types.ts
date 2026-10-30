export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'streaming' | 'complete' | 'error';
  source?: 'gemini-3.8-flash' | 'offline-rules' | 'fallback' | 'system';
  isExample?: boolean;
}

export interface ContainerColorInfo {
  name: string;
  badge: string;
  frequency: 'Typical' | 'Occasional';
  colorHex: string;
  borderHex: string;
  accentBg: string;
  description: string;
  applications: string[];
}

export interface ProtocolRule {
  id: string;
  title: string;
  summary: string;
  directive: string;
  samplePrompt: string;
  sampleExpected: string;
  badge: string;
}
