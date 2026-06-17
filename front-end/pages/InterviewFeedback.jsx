import Victoria from "../src/assets/Victoria - Job coach.png";
import {fetchAPI} from "../services/Fetch.js";
import {useParams} from "react-router";
import {useEffect, useState, useRef} from "react";

export default function InterviewFeedback() {
    const [data, setData] = useState(null)
    const [transcriptie, setTranscriptie] = useState(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()

    const feedbackRef = useRef(null)

    useEffect(() => {
        const loadAllData = async () => {
            let tempData;
            try {
                const feedbackRes = await fetchAPI(`/interview-feedback/${params.id}`, "GET");

                tempData = feedbackRes;
                setData(feedbackRes)
            } catch (err) {
                console.error("Er is iets misgegaan bij het ophalen van de data:", err)
            } finally {
                let interviewId = tempData.data.interview_id;

                const transcriptieRes = await fetchAPI(`/interviews/${interviewId}`)
                setTranscriptie(transcriptieRes);

                setLoading(false)
            }
        }

        if (params.id) {
            loadAllData()
        }
    }, [params.id])

    const scrollToFeedback = () => {
        feedbackRef.current?.scrollIntoView({behavior: 'smooth'})
    }

    if (loading) {
        return <p>Loading feedback...</p>
    }

    if (!data || !transcriptie) {
        return <p>Geen feedback of transcriptie gevonden</p>
    }

    const feedback = data.data?.ai_feedback;
    const transcription = transcriptie.data.chat_history

    return (
        <>
            <div className="max-w-4xl mx-auto md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1>Transcriptie</h1>
                    <button
                        onClick={scrollToFeedback}
                        className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                    >
                        Bekijk Feedback ↓
                    </button>
                </div>

                <div className="flex flex-col">
                    <div className="p-4 md:p-6 space-y-4 bg-white min-h-[400px]">
                        {transcription?.map((message, index) => {
                            const isUser = message.role === 'user';

                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className="flex items-center space-x-2 mb-1 px-1 text-xs text-gray-400 font-medium">
                                        <span>{isUser ? 'Kandidaat' : 'Interviewer'}</span>
                                    </div>

                                    <div
                                        className={`max-w-[85%] md:max-w-[70%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                                            isUser
                                                ? 'text-black rounded-tr-none '
                                                : 'text-slate-800 rounded-tl-none '
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div ref={feedbackRef} className="p-4 max-w-2xl mx-auto mt-12 pb-12 bg-secondary/20 rounded-xl">
                    <div className={"flex justify-center"}>
                        <img src={Victoria} alt={"Victoria"} width={200}/>
                    </div>
                    <p className={"bg-white shadow-md font-bold italic p-2 text-center mb-8"}>~{feedback?.reaction}~</p>

                    <div className="p-2">
                        <h2>Wat gaat al goed?</h2>
                        <ul className={"list-disc list-inside"}>
                            {feedback?.good_points?.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white shadow-md mt-4 p-2">
                        <h2 className="font-semibold ">Verbeterpunten</h2>
                        <ul className={"list-disc list-inside"}>
                            {feedback?.improvement_points?.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}