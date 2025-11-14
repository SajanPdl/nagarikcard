import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Service } from '../types';
import { NepalFlagIcon, XIcon, MicIcon } from './icons';
import { AppContext } from '../context/AppContext';

interface SathiAiModalProps {
    services: Service[];
    onClose: () => void;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

// Add types for the Web Speech API to resolve TypeScript errors.
interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onstart: () => void;
    onend: () => void;
    onerror: (event: any) => void;
    onresult: (event: any) => void;
}

const SathiAiModal: React.FC<SathiAiModalProps> = ({ services, onClose }) => {
    const { dispatch } = useContext(AppContext);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Namaste! I am Sathi AI, your personal assistant for GovFlow services. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isLoading]);
    
    // Effect for cleaning up speech recognition on component unmount
    useEffect(() => {
        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    const handleMicClick = () => {
        if (isLoading) return;

        // Cast window to `any` to access non-standard SpeechRecognition API.
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Voice input is not supported on this device.', type: 'info' } });
            return;
        }

        if (isRecording) {
            recognitionRef.current?.stop();
            return;
        }
        
        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => {
            setIsRecording(false);
            recognitionRef.current = null;
        };
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            let errorMessage = `An error occurred with voice input: ${event.error}.`;
            if (event.error === 'network') {
                errorMessage = 'Voice recognition service is unavailable. Please check your internet connection and try again.';
            } else if (event.error === 'no-speech') {
                errorMessage = 'No speech was detected. Please try again.';
            } else if (event.error === 'audio-capture') {
                errorMessage = 'Could not access the microphone. Please check browser permissions.';
            } else if (event.error === 'not-allowed') {
                errorMessage = 'Microphone access was denied. Please enable it in browser settings.';
            }
            
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { message: errorMessage, type: 'info' }
            });
            
            setIsRecording(false);
            recognitionRef.current = null;
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            setInput(finalTranscript || interimTranscript);
        };

        setInput('');
        recognition.start();
    };


    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            const systemInstruction = `You are Sathi AI, a friendly and helpful assistant for the GovFlow e-governance PWA from Nepal. Your goal is to help users understand and navigate government services. You must answer questions based ONLY on the following service data. Do not invent services or details. Be concise, clear, and format your answers for readability (e.g., use lists, bold text). If asked about something outside of this data, politely state that you can only provide information about the available services.

Here is the available service data in JSON format:
${JSON.stringify(services, null, 2)}
`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: input,
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Sathi AI Error:", error);
            const errorMessage: Message = { sender: 'ai', text: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <NepalFlagIcon className="h-6 w-auto" />
                        <h2 className="font-bold text-lg text-gray-800">Sathi AI Assistant</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><NepalFlagIcon className="w-5 h-auto"/></div>}
                            <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-[#003893] text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2">
                             <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><NepalFlagIcon className="w-5 h-auto"/></div>
                             <div className="max-w-md p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                                 <div className="flex space-x-1">
                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                 </div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="p-4 border-t">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isRecording ? "Listening..." : "Ask about services..."}
                            className="flex-1 w-full border-gray-300 rounded-full shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#003893] focus:border-transparent"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={handleMicClick}
                            disabled={isLoading}
                            className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                isRecording 
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                        >
                            <MicIcon className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-[#C8102E] text-white font-bold p-2 rounded-full shadow-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            aria-label="Send message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SathiAiModal;