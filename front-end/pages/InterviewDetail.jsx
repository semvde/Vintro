import Interviewer from "../src/assets/Interviewer.png";
import {useEffect, useState} from "react";
import {fetchAPI} from "../services/Fetch.js";
import {useNavigate, useParams} from "react-router";
import VoiceInput from "../components/VoiceInput.jsx";

export default function InterviewDetail() {
    const { id } = useParams();
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState(0);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);

    const [lastVoiceInput, setLastVoiceInput] = useState(null);

    // 1. START INTERVIEW
    useEffect(() => {
        const startInterview = async () => {
            const res = await fetchAPI(`/interviews/${id}/start`);

            setMessages([
                {
                    role: "assistant",
                    content: res.reply,
                },
            ]);
            console.log(res.reply)

            setStep(0);
            setLoading(false);
        };

        startInterview();
    }, []);

    // 2. VOICE AUTO-SEND WATCHER
    useEffect(() => {
        if (!lastVoiceInput) return;

        const timeout = setTimeout(() => {
            handleSend(lastVoiceInput);
            setLastVoiceInput(null);
        }, 600);

        return () => clearTimeout(timeout);
    }, [lastVoiceInput]);

    // 3. SEND MESSAGE (TEXT + VOICE)
    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMessage = {
            role: "user",
            content: text,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        const res = await fetchAPI(`/interviews/${id}/chat`, "POST", {
            message: text,
            step: step + 1,
        });
        console.log(res.finished);
        if(res.finished) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Bedankt, ik heb genoeg informatie. Je hoort binnenkort meer van ons. Nog een fijne dag gewenst!",
                },
            ]);

            setTimeout(() => {
                navigate(`/interview/${id}/feedback`);
            }, 20000)
        } else {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: res.reply,
                },
            ]);

            speakText(res.reply);
            console.log(res.reply)
            setStep((prev) => prev + 1);
        }
    };

    const speakText = async (text) => {
        const res = await fetch(`${API_URL}/tts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text,
                voice: "af_heart",
            }),
        });

        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        audio.play();
    };

    // LOADING
    if (loading) return <p>Laden...</p>;

    return(
        <>
            <div className={"flex justify-around pb-16"}>
                <div className={"flex flex-col items-center justify-center gap-8"}>
                    <div className="flex justify-center">
                        <div className="bg-secondary text-outline text-xs px-4 py-2 rounded-lg shadow-md max-w-75">
                            {(() => {
                                const lastAssistant = [...messages]
                                    .reverse()
                                    .find(m => m.role === "assistant");
                                return lastAssistant?.content ?? "Wachten op interviewer...";
                            })()}
                        </div>
                    </div>
                    <img src={Interviewer} alt={"Interviewer"} width={250}/>
                    <VoiceInput
                        inputSetter={(text) => {
                            setInput(text);
                            setLastVoiceInput(text);
                        }}
                    />
                </div>
            </div>
        </>
    )
}