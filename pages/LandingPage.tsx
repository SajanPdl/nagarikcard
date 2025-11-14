

import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
    NepalFlagIcon, CheckCircleIcon, UploadCloudIcon,
    FileTextIcon, QrCodeIcon, WalletIcon, ShieldLockIcon, ZapIcon, UsersIcon, BuildingIcon, BriefcaseIcon,
    FilePlusIcon, SparklesIcon, ArrowRightIcon, BookOpenIcon, MessageSquareIcon, HistoryIcon, SathiAiIcon, FileCheckIcon, CreditCardIcon, BellIcon
} from '../components/icons';

const WorkflowAnimation: React.FC = () => {
    return (
        <div className="relative w-full h-[450px] flex items-center justify-center">
            <style>{`
                @keyframes pop-in { 
                    0% { transform: scale(0.8); opacity: 0; }
                    80% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .pop-in { animation: pop-in 0.5s ease-out forwards; opacity: 0; }
                .delay-1 { animation-delay: 0.2s; }
                .delay-2 { animation-delay: 0.3s; }
                .delay-3 { animation-delay: 0.4s; }
                .delay-4 { animation-delay: 0.5s; }

                @keyframes move-on-path {
                    from { offset-distance: 0%; opacity: 0; }
                    5% { opacity: 1; }
                    95% { opacity: 1; }
                    to { offset-distance: 100%; opacity: 0; }
                }
                @keyframes icon-pulse-glow {
                    0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(200, 16, 46, 0.5); transform: scale(1); }
                    50% { box-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(200, 16, 46, 0.7); transform: scale(1.05); }
                }
                #request-icon {
                    offset-path: path('M 50 150 C 125 50, 175 50, 250 150 S 325 250, 350 250');
                    animation: move-on-path 6s cubic-bezier(0.4, 0, 0.2, 1) 1.5s forwards,
                               icon-pulse-glow 2s infinite 1.5s;
                    opacity: 0;
                    will-change: offset-distance;
                }
                
                @keyframes draw-progress-path { 
                    from { stroke-dashoffset: 1000; } 
                    to { stroke-dashoffset: 0; } 
                }
                .path-progress-animate { 
                    stroke-dasharray: 1000; 
                    stroke-dashoffset: 1000;
                    animation: draw-progress-path 6s cubic-bezier(0.4, 0, 0.2, 1) 1.5s forwards;
                }

                @keyframes stage-pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); border-color: rgba(255, 255, 255, 0.3); }
                    50% { transform: scale(1.1); box-shadow: 0 0 25px 5px rgba(255, 255, 255, 0.4); border-color: rgba(255, 255, 255, 0.8); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); border-color: rgba(255, 255, 255, 0.3); }
                }

                @keyframes arrival-pulse {
                    0% { transform: scale(1); box-shadow: 0 0 15px rgba(45, 212, 191, 0.7); }
                    50% { transform: scale(1.25); box-shadow: 0 0 40px rgba(45, 212, 191, 1); }
                    100% { transform: scale(1); box-shadow: 0 0 15px rgba(45, 212, 191, 0.7); }
                }

                @keyframes pulse-glow-final { 
                    0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(45, 212, 191, 0.7); } 
                    50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(45, 212, 191, 1); } 
                }

                /* Timed animations for each stage */
                .stage-1-pulse { animation: stage-pulse 0.7s ease-out 1.5s; }
                .stage-2-pulse { animation: stage-pulse 0.7s ease-out 3.5s; }
                .stage-3-pulse { animation: stage-pulse 0.7s ease-out 5.5s; }
                .final-node-glow { 
                    animation: arrival-pulse 0.8s ease-out 7.5s, 
                               pulse-glow-final 2s infinite 8.3s; 
                }
            `}</style>
            
            <svg viewBox="0 0 400 300" className="absolute w-full h-full">
                {/* Background Path */}
                <path d="M 50 150 C 125 50, 175 50, 250 150 S 325 250, 350 250" stroke="#003893" strokeWidth="3" strokeOpacity="0.5" fill="none" />
                {/* Progress Path */}
                <path d="M 50 150 C 125 50, 175 50, 250 150 S 325 250, 350 250" stroke="#FFFFFF" strokeWidth="3" fill="none" className="path-progress-animate" />
            </svg>
            
            <div id="request-icon" className="absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center rounded-full bg-[#C8102E]">
                 <FileTextIcon className="w-6 h-6 text-white" />
            </div>

            <div className="relative w-full h-full flex justify-between items-center px-4">
                <div className="absolute top-[120px] left-[20px] pop-in delay-1">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white text-center shadow-lg border border-white/30 stage-1-pulse">
                        <FilePlusIcon className="w-8 h-8"/>
                        <span className="text-xs font-semibold mt-1">Submit</span>
                        <span className="text-[10px] text-white/70">Citizen</span>
                    </div>
                </div>
                <div className="absolute top-[15px] left-[130px] pop-in delay-2">
                     <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white text-center shadow-lg border border-white/30 stage-2-pulse">
                        <SparklesIcon className="w-8 h-8"/>
                        <span className="text-xs font-semibold mt-1">Processing</span>
                         <span className="text-[10px] text-white/70">AI Triage</span>
                    </div>
                </div>
                 <div className="absolute top-[120px] right-[100px] pop-in delay-3">
                     <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white text-center shadow-lg border border-white/30 stage-3-pulse">
                        <BriefcaseIcon className="w-8 h-8"/>
                        <span className="text-xs font-semibold mt-1">Review</span>
                         <span className="text-[10px] text-white/70">GovOps</span>
                    </div>
                </div>
                <div className="absolute top-[220px] right-[20px] pop-in delay-4">
                     <div className="w-24 h-24 bg-teal-500/80 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white text-center shadow-2xl border-2 border-white/50 final-node-glow">
                        <CheckCircleIcon className="w-8 h-8"/>
                        <span className="text-xs font-semibold mt-1">Confirmed</span>
                        <span className="text-[10px] text-white/70">Citizen Notified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LandingPage: React.FC = () => {
    const { dispatch } = useContext(AppContext);

    const handleGetStarted = () => {
        dispatch({ type: 'SET_CITIZEN_PAGE', payload: 'dashboard' });
    };

    const QuickActionsStrip = () => {
        const actions = [
            { name: "Generate Token", icon: QrCodeIcon, onClick: () => dispatch({ type: 'SET_CITIZEN_PAGE', payload: 'my-applications' }) },
            { name: "Track Application", icon: HistoryIcon, onClick: () => dispatch({ type: 'SET_CITIZEN_PAGE', payload: 'my-applications' }) },
            { name: "Verify Document", icon: FileCheckIcon, onClick: () => dispatch({ type: 'SET_CITIZEN_PAGE', payload: 'nagarik-wallet' }) },
            { name: "Book Appointment", icon: FilePlusIcon, onClick: () => dispatch({ type: 'SET_CITIZEN_PAGE', payload: 'service-catalog' }) },
            { name: "Pay Fees", icon: CreditCardIcon, onClick: () => dispatch({ type: 'SET_CITIZEN_PAGE', payload: 'nagarik-wallet' }) },
            { name: "View Notifications", icon: BellIcon, onClick: () => dispatch({ type: 'SET_VIEW', payload: 'notifications' }) },
            { name: "Talk to AI", icon: SathiAiIcon, onClick: () => dispatch({ type: 'TOGGLE_AI_MODAL' }) },
        ];
        return (
            <section className="border-y border-gray-200 dark:border-gray-700">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                        {actions.map((action) => (
                            <button 
                                key={action.name} 
                                onClick={action.onClick}
                                className="bg-gray-50 dark:bg-gray-800 flex flex-col sm:flex-row items-center justify-center text-center p-4 space-y-2 sm:space-y-0 sm:space-x-3 group hover:bg-white dark:hover:bg-gray-700/80 transition-colors"
                            >
                                <action.icon className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-[#003893] dark:group-hover:text-white transition-colors" />
                                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#003893] dark:group-hover:text-white transition-colors">{action.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
             <style>{`
                @keyframes fadeIn-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in-up { animation: fadeIn-up 0.8s ease-out forwards; opacity: 0; }
                .fade-in-up-delay-1 { animation-delay: 0.2s; }
                .fade-in-up-delay-2 { animation-delay: 0.4s; }
                .fade-in-up-delay-3 { animation-delay: 0.6s; }

                .hero-bg {
                    background: linear-gradient(135deg, #003893, #2a5298, #C8102E);
                    background-size: 250% 250%;
                    animation: gradient-animation 18s ease infinite;
                }
                
                @keyframes gradient-animation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="hero-bg text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="text-center lg:text-left">
                                <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight fade-in-up">
                                    <span className="text-white/80">GovFlow:</span> <br/>
                                    <span className="text-white">सरकारी सेवा, अब तपाईंको हातमा।</span>
                                </h1>
                                <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto lg:mx-0 fade-in-up fade-in-up-delay-1">
                                    The future of citizen services is here. One seamless platform for all your government needs. Secure, transparent, and built for you.
                                </p>
                                <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 fade-in-up fade-in-up-delay-2">
                                    <button 
                                        onClick={handleGetStarted}
                                        className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                                    >
                                        <span>Explore Services</span>
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </button>
                                     <button 
                                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="inline-flex items-center bg-transparent border-2 border-white/80 text-white font-bold py-4 px-10 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Learn More
                                    </button>
                                </div>
                            </div>
                            <div className="fade-in-up fade-in-up-delay-3">
                                <WorkflowAnimation />
                            </div>
                        </div>
                    </div>
                </section>

                <QuickActionsStrip />

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 lg:py-24 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">A Simpler Way Forward</h2>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">कसरी काम गर्छ?</p>
                        <div className="mt-12 grid md:grid-cols-3 gap-8 lg:gap-12">
                            <div className="flex flex-col items-center group">
                                <div className="bg-blue-100 text-[#003893] w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"><UploadCloudIcon className="w-10 h-10" /></div>
                                <h3 className="mt-6 text-xl font-bold dark:text-gray-200">1. Build Your Profile</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Securely upload your documents once to create your verified digital identity wallet.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">आफ्नो प्रोफाइल बनाउनुहोस्</p>
                            </div>
                            <div className="flex flex-col items-center group">
                                <div className="bg-red-100 text-[#C8102E] w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"><FileTextIcon className="w-10 h-10" /></div>
                                <h3 className="mt-6 text-xl font-bold dark:text-gray-200">2. Apply in Seconds</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Select any service and apply instantly with auto-filled forms from your wallet.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">सेवाहरू तुरुन्तै प्राप्त गर्नुहोस्</p>
                            </div>
                            <div className="flex flex-col items-center group">
                                <div className="bg-green-100 text-green-700 w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"><QrCodeIcon className="w-10 h-10" /></div>
                                <h3 className="mt-6 text-xl font-bold dark:text-gray-200">3. Track & Verify</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Follow your application's progress in real-time and use your QR ID for in-person verification.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">ट्र्याक र प्रमाणित गर्नुहोस्</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Features Section */}
                <section className="py-20 lg:py-24 dark:bg-gray-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">Your Government, Simplified</h2>
                             <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">मुख्य विशेषताहरू</p>
                        </div>
                        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"><div className="flex items-center space-x-4"><div className="bg-blue-100 text-[#003893] p-3 rounded-lg"><WalletIcon className="w-6 h-6"/></div><h3 className="text-lg font-bold dark:text-gray-200">Digital Wallet</h3></div><p className="mt-4 text-gray-600 dark:text-gray-400">Your documents, verified and secure in one place. Access them anytime, anywhere.</p></div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"><div className="flex items-center space-x-4"><div className="bg-red-100 text-[#C8102E] p-3 rounded-lg"><ShieldLockIcon className="w-6 h-6"/></div><h3 className="text-lg font-bold dark:text-gray-200">Bank-Grade Security</h3></div><p className="mt-4 text-gray-600 dark:text-gray-400">Your data is protected with end-to-end encryption and the highest security standards.</p></div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"><div className="flex items-center space-x-4"><div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg"><ZapIcon className="w-6 h-6"/></div><h3 className="text-lg font-bold dark:text-gray-200">Time Saving</h3></div><p className="mt-4 text-gray-600 dark:text-gray-400">Skip the queues and paperwork. Get things done from the comfort of your home.</p></div>
                        </div>
                    </div>
                </section>

                {/* About GovFlow Section */}
                <section className="py-20 lg:py-24 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">About GovFlow</h2>
                            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">हाम्रोबारे</p>
                        </div>
                        <div className="mt-16 max-w-4xl mx-auto grid md:grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            <div>
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 text-[#003893] p-3 rounded-lg mr-4">
                                        <BookOpenIcon className="w-6 h-6"/>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Our Mission</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Our mission is to bridge the gap between citizens and government by creating a simple, transparent, and efficient digital ecosystem. We believe that by leveraging technology, we can eliminate bureaucracy, reduce wait times, and empower every citizen with direct access to the services they need and deserve.
                                </p>
                            </div>
                            <div>
                                 <div className="flex items-center mb-4">
                                    <div className="bg-red-100 text-[#C8102E] p-3 rounded-lg mr-4">
                                        <SparklesIcon className="w-6 h-6"/>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Why GovFlow?</h3>
                                </div>
                                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    GovFlow is more than just a platform; it's a commitment to progress. For citizens, it means less time spent in queues and more time for what matters. For the government, it means streamlined workflows and data-driven insights. For Nepal, it signifies a leap towards a modern, digital-first future where governance is accessible, accountable, and designed for everyone.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* For Everyone Section */}
                <section className="py-20 lg:py-24 dark:bg-gray-800">
                     <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">For Everyone</h2>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">सबैका लागि</p>
                        <div className="mt-12 grid md:grid-cols-3 gap-8 lg:gap-12 text-left">
                            <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg hover:border-blue-300 hover:shadow-sm dark:hover:border-blue-500">
                                <UsersIcon className="w-10 h-10 text-[#003893] mb-4"/>
                                <h3 className="text-xl font-bold dark:text-gray-200">Citizens / नागरिक</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Easy access to services, less waiting time, and complete control over your personal data.</p>
                            </div>
                            <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg hover:border-red-300 hover:shadow-sm dark:hover:border-red-500">
                                <BuildingIcon className="w-10 h-10 text-[#C8102E] mb-4"/>
                                <h3 className="text-xl font-bold dark:text-gray-200">Government / सरकार</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Streamlined processes, reduced paperwork, and more efficient, transparent service delivery.</p>
                            </div>
                            <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg hover:border-gray-400 hover:shadow-sm dark:hover:border-gray-500">
                                <BriefcaseIcon className="w-10 h-10 text-gray-700 dark:text-gray-300 mb-4"/>
                                <h3 className="text-xl font-bold dark:text-gray-200">Businesses / व्यवसाय</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Faster, more reliable verification processes for Know Your Customer (KYC) and other requirements.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 lg:py-24 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">Trusted by Citizens</h2>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">नागरिकहरूद्वारा विश्वास गरिएको</p>
                        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col">
                                <MessageSquareIcon className="w-8 h-8 text-blue-400 mb-4 self-start" />
                                <p className="text-gray-600 dark:text-gray-400 italic text-left flex-grow">"Renewing my license used to take a full day, running from one office to another. With GovFlow, I did it during my lunch break from my phone. Absolutely revolutionary for Nepal!"</p>
                                <div className="mt-6 flex items-center self-start pt-4 border-t border-gray-200 dark:border-gray-700 w-full">
                                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-600 text-lg">SK</div>
                                    <div className="ml-4 text-left">
                                        <p className="font-bold text-gray-800 dark:text-gray-200">Suman Karki</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">IT Professional, Kathmandu</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col">
                                 <MessageSquareIcon className="w-8 h-8 text-blue-400 mb-4 self-start" />
                                <p className="text-gray-600 dark:text-gray-400 italic text-left flex-grow">"As a small business owner, the document verification process was always a headache. Now, I can track everything in one place. GovFlow saves me time and stress."</p>
                                <div className="mt-6 flex items-center self-start pt-4 border-t border-gray-200 dark:border-gray-700 w-full">
                                    <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center font-bold text-red-600 text-lg">RG</div>
                                    <div className="ml-4 text-left">
                                        <p className="font-bold text-gray-800 dark:text-gray-200">Rita Gurung</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Shop Owner, Pokhara</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col">
                                <MessageSquareIcon className="w-8 h-8 text-blue-400 mb-4 self-start" />
                                <p className="text-gray-600 dark:text-gray-400 italic text-left flex-grow">"I helped my grandmother pay her land tax using GovFlow. She was amazed that we didn't have to travel to the city. This platform makes services accessible to everyone, young and old."</p>
                                <div className="mt-6 flex items-center self-start pt-4 border-t border-gray-200 dark:border-gray-700 w-full">
                                    <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-600 text-lg">BM</div>
                                    <div className="ml-4 text-left">
                                        <p className="font-bold text-gray-800 dark:text-gray-200">Bishal Mishra</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Student, Chitwan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-gray-800 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <NepalFlagIcon className="h-6 w-auto" />
                        <span className="font-bold">GovFlow</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-4 sm:mt-0">
                        © {new Date().getFullYear()} GovFlow Initiative. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;