import ChatMessage from "./ChatMessage.jsx";
import {useEffect, useRef, useState} from "react";
import {fetchAPI} from "../services/Fetch.js";
import {useNavigate} from "react-router";

export default function ChatWindow() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const startOnboarding = async () => {
            const response = await fetchAPI("/onboarding/start", "GET");

            setMessages([
                {
                    role: "assistant",
                    content: response.reply
                }
            ]);
        };

        startOnboarding();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim() || isFinished) return;

        const currentStep = step + 1;
        const userMsg = {role: "user", content: input};

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        const response = await fetchAPI("/onboarding/chat", "POST", {
            message: input,
            step: currentStep
        });

        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: response.reply
            }
        ]);

        setStep(currentStep);

        if (response.finished) {
            setIsFinished(true);

            const profileResponse = await fetchAPI("/profile/generate", "POST");

            console.log("Generated profile:", profileResponse);

            const vacanciesResponse = await fetchAPI("/vacancies/generate", "POST");

            console.log("Generated vacancies:", vacanciesResponse);

            navigate('/app/cv');
        }

        setLoading(false);
    };

    return (
        <div className="rounded-lg flex flex-col overflow-hidden">
            <div className="fixed top-35 left-0 right-0 flex-1 p-4 overflow-y-auto h-[calc(100%-240px)]">
                {messages.map((message, m) => (
                    <ChatMessage key={m} {...message} />
                ))}

                <div ref={messagesEndRef}/>

                {loading && (
                    <p className="text-sm">
                        Even nadenken...
                    </p>
                )}
            </div>

            <form className="flex bg-secondary/20 p-2 fixed bottom-0 left-0 right-0 py-7" onSubmit={sendMessage}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isFinished || loading}
                    className="flex-1 px-3 py-2 outline-none border rounded-lg"
                    placeholder={isFinished ? "Onboarding afgerond..." : "Typ een bericht..."}
                />

                <button
                    type="submit"
                    disabled={isFinished || loading}
                    className="ml-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-hover text-outline"
                >
                    Send
                </button>
            </form>
        </div>
    );
}