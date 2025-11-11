import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { 
    NepalFlagIcon, CheckCircleIcon, HourglassIcon, FileCheckIcon, UploadCloudIcon,
    FileTextIcon, QrCodeIcon, WalletIcon, ShieldLockIcon, ZapIcon, UsersIcon, BuildingIcon, BriefcaseIcon
} from '../components/icons';

const LandingPage: React.FC = () => {
    const { dispatch } = useContext(AppContext);

    const handleGetStarted = () => {
        dispatch({ type: 'SET_VIEW', payload: 'citizen' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F7F8FC]">
             <style>{`
                @keyframes float-1 { 0%, 100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-20px) rotate(4deg); } }
                @keyframes float-2 { 0%, 100% { transform: translateY(0) rotate(-12deg); } 50% { transform: translateY(-20px) rotate(-10deg); } }
                @keyframes float-3 { 0%, 100% { transform: translateY(0) rotate(12deg); } 50% { transform: translateY(-20px) rotate(10deg); } }
                .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
                .animate-float-2 { animation: float-2 7s ease-in-out infinite; }
                .animate-float-3 { animation: float-3 5s ease-in-out infinite; }
                
                @keyframes fadeIn-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in-up { animation: fadeIn-up 0.8s ease-out forwards; }
                .fade-in-up-delay-1 { animation-delay: 0.2s; }
                .fade-in-up-delay-2 { animation-delay: 0.4s; }
                .fade-in-up-delay-3 { animation-delay: 0.6s; }
            `}</style>
            <Header showNav={true} />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-800 leading-tight fade-in-up">
                                <span className="text-[#003893]">Nagarik Card:</span> <br/>
                                <span className="text-[#C51E3A]">आफ्नो समय फिर्ता लिनुहोस्।</span>
                            </h1>
                            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 fade-in-up fade-in-up-delay-1">
                                Take back your time. The one wallet for all your government services. Secure, transparent, and seamless.
                            </p>
                            <button 
                                onClick={handleGetStarted}
                                className="mt-10 inline-block bg-[#C51E3A] text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 fade-in-up fade-in-up-delay-2"
                            >
                                Get Started / थालनी गर्नुहोस्
                            </button>
                        </div>
                        <div className="relative h-[600px] flex items-center justify-center fade-in-up fade-in-up-delay-3">
                            <div className="absolute z-10 top-10 -right-16 w-60 bg-white p-4 rounded-2xl shadow-xl animate-float-1">
                                <h3 className="font-bold text-[#003893]">Dynamic QR ID</h3>
                                <div className="mt-2 w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg">
                                   <QrCodeIcon className="w-16 h-16 text-gray-400"/>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Secure & time-sensitive for verification.</p>
                            </div>
                            <div className="absolute z-30 bottom-8 -left-20 w-64 bg-white p-4 rounded-2xl shadow-xl animate-float-2">
                                <h3 className="font-bold text-[#003893]">Auto-Filled Form</h3>
                                <FileCheckIcon className="w-8 h-8 text-green-500 my-2" />
                                <p className="text-xs text-gray-500 mt-1">Data from your wallet auto-fills forms, saving you time and effort.</p>
                            </div>
                            <div className="absolute z-10 bottom-24 -right-24 w-60 bg-white p-4 rounded-2xl shadow-xl animate-float-3">
                                 <h3 className="font-bold text-[#003893]">Application Tracker</h3>
                                 <HourglassIcon className="w-8 h-8 text-yellow-500 my-2" />
                                 <p className="text-xs text-gray-500 mt-1">Live status updates from "Submitted" to "Approved".</p>
                            </div>
                            <div className="relative z-20 w-72 h-[580px] bg-gray-800 rounded-[40px] shadow-2xl border-4 border-gray-700 p-2">
                                <div className="w-full h-full bg-[#F7F8FC] rounded-[32px] overflow-hidden p-4 flex flex-col">
                                    <div className="flex justify-between items-center"><NepalFlagIcon className="h-6" /><div className="w-16 h-3 bg-gray-300 rounded-full"></div></div>
                                    <h2 className="text-lg font-bold mt-4">My Wallet</h2>
                                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#003893] to-blue-800 text-white shadow-lg"><p className="text-sm font-medium">Maya K.</p><p className="text-xs opacity-80 mt-1">Nagarik Card</p><div className="flex items-center justify-between mt-4"><span className="text-xs font-mono">**** **** 1234</span><div className="flex items-center space-x-1 bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full"><CheckCircleIcon className="w-3 h-3"/><span>Verified</span></div></div></div>
                                    <div className="mt-4 space-y-2"><div className="bg-white p-3 rounded-lg shadow-sm"><p className="font-semibold text-sm">Citizenship</p></div><div className="bg-white p-3 rounded-lg shadow-sm"><p className="font-semibold text-sm">Driving License</p></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 lg:py-24 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800">A Simpler Way Forward</h2>
                        <p className="mt-2 text-lg text-gray-600">कसरी काम गर्छ?</p>
                        <div className="mt-12 grid md:grid-cols-3 gap-8 lg:gap-12">
                            <div className="flex flex-col items-center">
                                <div className="bg-blue-100 text-[#003893] w-20 h-20 rounded-full flex items-center justify-center"><UploadCloudIcon className="w-10 h-10" /></div>
                                <h3 className="mt-6 text-xl font-bold">1. Securely Onboard</h3>
                                <p className="mt-2 text-gray-600">Upload your citizenship once. We verify it and create your secure digital identity.</p>
                                <p className="text-sm text-gray-500 mt-1">सुरक्षित रूपमा दर्ता गर्नुहोस्</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-red-100 text-[#C51E3A] w-20 h-20 rounded-full flex items-center justify-center"><FileTextIcon className="w-10 h-10" /></div>
                                <h3 className="mt-6 text-xl font-bold">2. Access Services</h3>
                                <p className="mt-2 text-gray-600">Apply for services with auto-filled forms. No more repetitive data entry.</p>
                                <p className="text-sm text-gray-500 mt-1">सेवाहरू तुरुन्तै प्राप्त गर्नुहोस्</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-green-100 text-green-700 w-20 h-20 rounded-full flex items-center justify-center"><QrCodeIcon className="w-10 h-10" /></div>
                                <h3 className="mt-6 text-xl font-bold">3. Verify with a Tap</h3>
                                <p className="mt-2 text-gray-600">Use your dynamic QR ID at government offices for quick and secure verification.</p>
                                <p className="text-sm text-gray-500 mt-1">एक ट्यापमा प्रमाणित गर्नुहोस्</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Features Section */}
                <section className="py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800">Your Government, Simplified</h2>
                             <p className="mt-2 text-lg text-gray-600">मुख्य विशेषताहरू</p>
                        </div>
                        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"><div className="flex items-center space-x-4"><div className="bg-blue-100 text-[#003893] p-3 rounded-lg"><WalletIcon className="w-6 h-6"/></div><h3 className="text-lg font-bold">Digital Wallet</h3></div><p className="mt-4 text-gray-600">Your documents, verified and secure in one place. Access them anytime, anywhere.</p></div>
                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"><div className="flex items-center space-x-4"><div className="bg-red-100 text-[#C51E3A] p-3 rounded-lg"><ShieldLockIcon className="w-6 h-6"/></div><h3 className="text-lg font-bold">Bank-Grade Security</h3></div><p className="mt-4 text-gray-600">Your data is protected with end-to-end encryption and the highest security standards.</p></div>
                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"><div className="flex items-center space-x-4"><div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg"><ZapIcon className="w-6 h-6"/></div><h3 className="text-lg font-bold">Time Saving</h3></div><p className="mt-4 text-gray-600">Skip the queues and paperwork. Get things done from the comfort of your home.</p></div>
                        </div>
                    </div>
                </section>

                {/* For Everyone Section */}
                <section className="py-20 lg:py-24 bg-white">
                     <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800">For Everyone</h2>
                        <p className="mt-2 text-lg text-gray-600">सबैका लागि</p>
                        <div className="mt-12 grid md:grid-cols-3 gap-8 lg:gap-12 text-left">
                            <div className="border border-gray-200 p-6 rounded-lg">
                                <UsersIcon className="w-10 h-10 text-[#003893] mb-4"/>
                                <h3 className="text-xl font-bold">Citizens / नागरिक</h3>
                                <p className="mt-2 text-gray-600">Easy access to services, less waiting time, and complete control over your personal data.</p>
                            </div>
                            <div className="border border-gray-200 p-6 rounded-lg">
                                <BuildingIcon className="w-10 h-10 text-[#C51E3A] mb-4"/>
                                <h3 className="text-xl font-bold">Government / सरकार</h3>
                                <p className="mt-2 text-gray-600">Streamlined processes, reduced paperwork, and more efficient, transparent service delivery.</p>
                            </div>
                            <div className="border border-gray-200 p-6 rounded-lg">
                                <BriefcaseIcon className="w-10 h-10 text-gray-700 mb-4"/>
                                <h3 className="text-xl font-bold">Businesses / व्यवसाय</h3>
                                <p className="mt-2 text-gray-600">Faster, more reliable verification processes for Know Your Customer (KYC) and other requirements.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-gray-800 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <NepalFlagIcon className="h-6 w-auto" />
                        <span className="font-bold">Nagarik Card</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-4 sm:mt-0">
                        © {new Date().getFullYear()} Nagarik Card Initiative. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
