import Interviewer from "../src/assets/Interviewer.png";
import {useEffect, useState} from "react";
import {fetchAPI} from "../services/Fetch.js";
import {useParams} from "react-router";
import VoiceInput from "../components/VoiceInput.jsx";

export default function InterviewDetail() {
    const { id } = useParams();

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

            setStep(0);
            setLoading(false);
        };

        startInterview();
    }, [id]);

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

        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: res.reply,
            },
        ]);
        console.log(res.reply)
        setStep((prev) => prev + 1);
    };
    // LOADING
    if (loading) return <p>Laden...</p>;

    return(
        <>
            <div className={"flex justify-around"}>
                <div className={"flex flex-col items-center justify-center gap-8"}>
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