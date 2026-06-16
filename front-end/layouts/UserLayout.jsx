import {Link, Outlet} from "react-router";
import VintroLogo from "../src/assets/vintro_logo-03.png";
import Victoria from "../src/assets/Victoria - Job coach.png";
import {IoMdHome} from "react-icons/io";
import {IoNewspaperSharp} from "react-icons/io5";
import {FaMicrophoneAlt, FaUser} from "react-icons/fa";
import {MdEditDocument} from "react-icons/md";
import {useEffect, useRef, useState} from "react";
import {FaXmark} from "react-icons/fa6";
import FormField from "../components/FormField.jsx";
import {MdOutlineQuestionAnswer} from "react-icons/md";
import ChatMessage from "../components/ChatMessage.jsx";
import {fetchAPI} from "../services/Fetch.js";
import {FaAngleRight} from "react-icons/fa";
import ScrollToTop from "../components/ScrollToTop.jsx";
import VoiceInput from "../components/VoiceInput.jsx";

export default function UserLayout() {
    const messagesEndRef = useRef(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatAnimation, setChatAnimation] = useState('visible');
    const [placeholderText, setPlaceholderText] = useState('Stel je vraag...');
    const [loading, setLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState([{
        role: 'assistant',
        content: 'Waar kan ik je mee helpen? Stel je vraag in een korte zin!'
    }]);

    const animationClass =
        chatAnimation === "visible"
            ? "animate-[visible_0.5s_ease-in-out]"
            : "animate-[hide_0.5s_ease-in-out]";

    function openChat() {
        setChatAnimation('visible');
        setChatOpen(true);
    }

    function closeChat() {
        setChatAnimation('hide');

        setTimeout(() => {
            setChatOpen(false);
        }, 500)
    }

    function setInput(x) {
        setForm({input: x});
    }

    const [form, setForm] = useState({
        input: ""
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setForm({input: ""});
        setPlaceholderText('Nadenken...');

        setChatMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: form.input
            }
        ])

        const response = await fetchAPI('/coach', 'POST', {
            message: form.input,
            page: location.pathname,
            history: chatMessages
        });

        setPlaceholderText('Stel je vraag...');
        setChatMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: response.reply
            }
        ]);
        setLoading(false);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [chatMessages]);

    return (
        <>
            <header>
                <ScrollToTop/>
                <div className={"bg-primary"}>
                    <Link to={"/app"}><img src={VintroLogo} alt="Logo" width={60} height={60}/></Link>
                </div>
            </header>
            <main>
                <Outlet/>
            </main>
            {chatOpen &&
                <section id={"chat"}
                         className={`fixed bottom-2.5 right-2.5 bg-[#E1F0DF] outline-[#E1F0DF] outline-5 border-primary border-3 rounded-lg h-[calc(100%-80px)] w-80 p-5 z-9999 ${animationClass}`}>
                    <button onClick={() => closeChat()} className={"absolute right-5 top-5"}><FaXmark size={25}/>
                    </button>
                    <h2>Chat met Victoria</h2>
                    <div className={"overflow-y-auto h-[calc(100%-85px)] pt-5"}>
                        {
                            chatMessages.map((message, index) => <ChatMessage key={index} role={message.role}
                                                                              content={message.content}/>)
                        }

                        <div ref={messagesEndRef}/>
                    </div>
                    <VoiceInput inputSetter={setInput} styling={"absolute bottom-20 right-5"}/>
                    <form className={"absolute bottom-0 left-0 right-0"} onSubmit={handleSubmit}>
                        <FormField icon={<MdOutlineQuestionAnswer/>} id={'input'}
                                   placeholder={placeholderText} value={form.input} onChange={handleInputChange}/>
                        <button type={"submit"} disabled={loading} className={"absolute right-1 bottom-6"}>
                            <FaAngleRight/></button>
                    </form>
                </section>
            }
            <footer className={"fixed left-0 right-0 bottom-0 z-999"}>
                <button
                    className={"absolute bottom-15 right-2 bg-primary shadow rounded-full w-1/5 hover:bg-primary-hover sm:w-1/20"}
                    onClick={() => openChat()}>
                    <img src={Victoria} alt="Victoria - Chat Bot" className={"aspect-square w-full translate-y-1"}/>
                </button>
                <nav className="grid grid-cols-5 bg-outline p-2">
                    {/* Divs will be Links when routes are available */}
                    <Link to={"/app"} className={"flex justify-center"}><IoMdHome size={40}/></Link>
                    <Link to={"/app/vacancies"} className={"flex justify-center"}><IoNewspaperSharp size={40}/></Link>
                    <div className={"flex justify-center"}><FaMicrophoneAlt size={40}/></div>
                    <Link to={"/app/cv"} className={"flex justify-center"}><MdEditDocument size={40}/></Link>
                    <Link to={"/app/account"} className={"flex justify-center"}><FaUser size={40}/></Link>
                </nav>
            </footer>
        </>
    )
}