import ChatMessage from "./ChatMessage.jsx";
import {useState} from "react";
import {fetchAPI} from "../services/Fetch.js";

export default function ChatWindow() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // BACK-END CONNECTIE
        const response = await fetchAPI("/ai/chat", "POST", {
            message: input
        })
        console.log(response);

        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: response.reply
            }
        ]);
        setLoading(false);
    };

    return(
        <div className="rounded-lg flex flex-col overflow-hidden">

            {/* messages */}
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

            {/* input */}
            <form className="flex p-2" onSubmit={sendMessage}>
                <input value={input} onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-3 py-2 outline-none border rounded-lg"
                    placeholder="Typ een bericht..."
                />

                <button type={"submit"} className="ml-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-hover text-outline">
                    Send
                </button>
            </form>
        </div>
    )
}