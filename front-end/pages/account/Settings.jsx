import {Link} from "react-router";
import {GoArrowLeft} from "react-icons/go";
import {useState} from "react";

export function Settings() {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState('NL');

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <>
            <section className="max-w-100 md:max-w-4xl mx-auto max-h-200 space-y-10 md:p-6">
                <div className="flex justify-between flex-row items-center">
                    <div className="shadow-md rounded-4xl bg-gray-100 max-w-fit max-h-fit p-2">
                        <Link to="/app/account">
                            <GoArrowLeft/>
                        </Link>
                    </div>
                    <div>
                        <h2>Instellingen</h2>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:px-2">
                    <div className="flex flex-row justify-between bg-primary p-6 rounded-xl">
                        <p className="h2 text-center self-center text-white">Donker thema</p>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input type="checkbox" id="theme-toggle" className="sr-only peer"/>

                            <div
                                className="w-14 h-8 bg-gray-400 rounded-full transition-colors duration-300 ease-in-out peer-checked:bg-gray-200 peer-focus:ring-2">
                            </div>

                            <div
                                className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out peer-checked:translate-x-6 peer-checked:bg-primary">
                            </div>
                        </label>
                    </div>
                    <div className="flex flex-row justify-between bg-primary p-6 rounded-xl">
                        <p className="h2 text-center self-center text-white">Taal</p>
                        <div className="relative inline-block text-left z-50">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center space-x-2 bg-white text-black px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <span>{language === 'NL' ? 'NL' : 'EN'}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>

                            <div
                                className={`absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl transition-all duration-200 ease-in-out origin-top-right ${
                                    isOpen
                                        ? 'opacity-100 visible scale-100'
                                        : 'opacity-0 invisible scale-95 -translate-y-1'
                                }`}
                            >
                                <div className="p-1 space-y-1">
                                    <button
                                        onClick={() => handleLanguageChange('NL')}
                                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors text-left ${
                                            language === 'NL'
                                                ? 'bg-primary text-white font-bold'
                                                : 'text-black hover:bg-gray-100'
                                        }`}
                                    >
                                        <span>Nederlands</span>
                                    </button>

                                    <button
                                        onClick={() => handleLanguageChange('EN')}
                                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors text-left ${
                                            language === 'EN'
                                                ? 'bg-primary text-white font-bold'
                                                : 'text-black hover:bg-gray-100'
                                        }`}
                                    >
                                        <span>English</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}