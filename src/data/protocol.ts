import { ContainerColorInfo, ProtocolRule } from '../types';

export const COMPANY_PROFILE = {
  name: 'Cymbal Manufacturing',
  primaryBusiness: 'Storage containers primarily',
  secondaryCapability: 'Custom machining based on request',
  phone: '(333) 333-3333',
  phoneClean: '3333333333',
  typicalColors: ['Blue', 'Green'],
  occasionalColors: ['Red'],
  scopeOfAnswers:
    'Container manufacturing, standard applications, durability, structural utility, and storage best practices.',
};

export const CONTAINER_COLORS: ContainerColorInfo[] = [
  {
    name: 'Industrial Blue',
    badge: 'Standard Core',
    frequency: 'Typical',
    colorHex: '#1e40af',
    borderHex: '#3b82f6',
    accentBg: 'bg-blue-900/30 text-blue-300 border-blue-500/40',
    description:
      'Our signature heavy-duty standard storage container. Engineered for general warehouse storage, industrial materials handling, and durable weather-resistant utility.',
    applications: ['Warehouse inventory', 'Bulk hardware & parts', 'Standard logistics', 'Tool & equipment storage'],
  },
  {
    name: 'Machinery Green',
    badge: 'Standard Core',
    frequency: 'Typical',
    colorHex: '#166534',
    borderHex: '#22c55e',
    accentBg: 'bg-emerald-900/30 text-emerald-300 border-emerald-500/40',
    description:
      'Engineered with reinforced ribbed walls for agricultural, environmental, and site storage. Standard production run alongside our blue containers.',
    applications: ['Field equipment', 'Agri & environmental storage', 'Jobsite materials', 'Long-term utility storage'],
  },
  {
    name: 'Hazard & Alert Red',
    badge: 'Occasional Batch',
    frequency: 'Occasional',
    colorHex: '#991b1b',
    borderHex: '#ef4444',
    accentBg: 'bg-rose-900/30 text-rose-300 border-rose-500/40',
    description:
      'Produced in periodic specialty runs for high-visibility storage, fire-safety gear, and hazard staging. Call for current batch availability.',
    applications: ['High-visibility staging', 'Emergency equipment storage', 'Hazardous material secondary storage', 'Special factory zoning'],
  },
];

export const PROTOCOL_RULES: ProtocolRule[] = [
  {
    id: 'rule-1',
    title: '1. Company Profile & Focus',
    badge: 'Core Identity',
    summary: 'Cymbal builds storage containers primarily. Custom machining is a secondary capability by request.',
    directive: 'Always maintain that storage containers are Cymbal\'s primary business. Contact is (333) 333-3333.',
    samplePrompt: 'What does Cymbal Manufacturing make?',
    sampleExpected:
      'Cymbal Manufacturing primarily builds storage containers, and is also capable of doing custom machining based on request. Call (333) 333-3333 for details.',
  },
  {
    id: 'rule-2',
    title: '2. Product Information & Colors',
    badge: 'Color Protocol',
    summary: 'Containers are typically blue or green, and occasionally red. Other colors point back to these.',
    directive: 'Containers are typically blue or green, but can occasionally be red. Answer within container scope.',
    samplePrompt: 'What colors do your containers come in?',
    sampleExpected:
      'Thank you for asking! At Cymbal Manufacturing, our storage containers are typically blue or green, but they can occasionally be red. If you\'d like to check current batch availability, please give us a call at (333) 333-3333.',
  },
  {
    id: 'rule-3',
    title: '3. Strict Custom Machining Protocol',
    badge: 'Mandatory Escalation',
    summary: 'MUST instruct callers to phone (333) 333-3333. Never quote, specify, or promise machining in chat.',
    directive: 'Do NOT attempt to configure, quote, specify, or promise custom machining jobs within chat.',
    samplePrompt: 'I need custom machining for some titanium brackets. Can you help me with that?',
    sampleExpected:
      'Thank you for reaching out! While Cymbal Manufacturing primarily builds storage containers, we are also capable of doing custom machining based on request. For custom machining work, please call our company directly at (333) 333-3333 so our machining team can review your project details.',
  },
  {
    id: 'rule-4',
    title: '4. Accuracy & Uncertainty Handling',
    badge: 'Zero Wild Guesses',
    summary: 'Admit uncertainty whenever facts are unverified. Direct to (333) 333-3333 instead of guessing.',
    directive: 'Never invent specs, dates, prices, or proprietary data. Respectfully admit not knowing and suggest calling.',
    samplePrompt: 'Can your container withstand 4,000 PSI of internal hydraulic pressure?',
    sampleExpected:
      'Thank you for your question. I must respectfully admit that I do not know the answer to that, and I don\'t want to take a guess on critical technical ratings. For verified engineering ratings and pressure specifications, please call our team directly at (333) 333-3333.',
  },
  {
    id: 'rule-5',
    title: '5. Respectful & Courteous Tone',
    badge: 'Tone Standard',
    summary: 'Always keep a respectful tone. Treat every customer with professional warmth and dignity.',
    directive: 'Be clear, honest, and humble. Never become argumentative or dismissive.',
    samplePrompt: 'Why can\'t I just get a yellow container online right now?',
    sampleExpected:
      'Respectful explanation of our typical colors (blue or green, occasionally red) with humble warmth and invitation to call (333) 333-3333.',
  },
];

export const QUICK_PROMPTS = [
  {
    label: 'Color Availability',
    prompt: 'What colors do your containers come in?',
    tag: 'Example A',
    icon: 'palette',
  },
  {
    label: 'Custom Machining',
    prompt: 'I need custom machining for some titanium brackets. Can you help me with that?',
    tag: 'Example B',
    icon: 'wrench',
  },
  {
    label: 'Technical Rating Check',
    prompt: 'Can your container withstand 4,000 PSI of internal hydraulic pressure?',
    tag: 'Example C',
    icon: 'shield-alert',
  },
  {
    label: 'Primary Applications',
    prompt: 'What are Cymbal storage containers primarily used for and how durable are they?',
    tag: 'Scope',
    icon: 'package',
  },
  {
    label: 'Non-Standard Colors',
    prompt: 'Can I order containers in yellow, orange, or purple?',
    tag: 'Scope',
    icon: 'help-circle',
  },
  {
    label: 'Machining Quote Request',
    prompt: 'Can you give me an estimate or lead time for custom CNC milled aluminum housings?',
    tag: 'Escalation',
    icon: 'phone-forwarded',
  },
];
