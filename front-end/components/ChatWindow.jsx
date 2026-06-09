import ChatMessage from "./ChatMessage.jsx";
import { useEffect, useState } from "react";
import { fetchAPI } from "../services/Fetch.js";

export default function ChatWindow() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);


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

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim() || isFinished) return;

        const currentStep = step + 1;
        const userMsg = { role: "user", content: input };

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
        }
        // Kan bijvoorbeeld naar een aparte generated profile pagina gaan of naar cv pagina, maar hij stata nu gewoon als log in de console voor check.

        setLoading(false);
    };

    return (
        <div className="rounded-lg flex flex-col overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message, m) => (
                    <ChatMessage key={m} {...message} />
                ))}

                {loading && (
                    <p className="text-sm">
                        Even nadenken...
                    </p>
                )}
            </div>

            <form className="flex p-2" onSubmit={sendMessage}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isFinished || loading}
                    className="flex-1 px-3 py-2 outline-none border rounded-lg"
                    placeholder={isFinished ? "Onboarding afgerond" : "Typ een bericht..."}
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