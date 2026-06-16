import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { GoArrowLeft } from "react-icons/go";
import { fetchAPI } from "../../services/Fetch.js";

export default function HistoryInterviewDetail() {
    const { id } = useParams();

    const [feedback, setFeedback] = useState(null);
    const [transcriptie, setTranscriptie] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const feedbackRes = await fetchAPI(`/interview-feedback/${id}`);

                if (!feedbackRes?.data) {
                    setError(feedbackRes?.message ?? "Interviewfeedback niet gevonden.");
                    return;
                }

                const feedbackData = feedbackRes.data;
                setFeedback(feedbackData);

                const transcriptieRes = await fetchAPI(`/interviews/${feedbackData.interview_id}`);

                setTranscriptie(transcriptieRes?.data?.chat_history ?? []);
            } catch (e) {
                setError("Er ging iets mis bij het ophalen van de interviewfeedback.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    if (loading) return <p>Interviewfeedback laden...</p>;
    if (error) return <p className="text-red-700">{error}</p>;

    const ai = feedback.ai_feedback ?? {};
    const vacancy = feedback.interview?.vacancy;

    return (
        <section className="max-w-4xl mx-auto px-6 py-8 pb-28 space-y-6">
            <div className="shadow-md rounded-4xl bg-gray-100 max-w-fit max-h-fit p-2">
                <Link to="/app/history" aria-label="Terug naar geschiedenis">
                    <GoArrowLeft />
                </Link>
            </div>

            <header className="space-y-2">
                <p className="text-sm text-gray-600">Interview feedback</p>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {vacancy?.title ?? `Interview #${feedback.interview_id}`}
                </h1>

                <p className="text-lg text-gray-800">
                    {vacancy?.company ?? "Onbekend bedrijf"} · {vacancy?.location ?? "Onbekende locatie"}
                </p>

                <span
                    className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                        feedback.accepted
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-900"
                    }`}
                >
                    {feedback.accepted ? "Sterk interview" : "Verbeterpunten gevonden"}
                </span>
            </header>

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-xl font-bold text-gray-900">Reactie van Victoria</h2>
                <p className="text-gray-800 leading-relaxed">
                    {ai.reaction ?? "Geen algemene reactie beschikbaar."}
                </p>
            </article>

            <FeedbackList title="Wat ging goed?" items={ai.good_points} />
            <FeedbackList title="Wat kan beter?" items={ai.improvement_points} />
            <FeedbackList title="Communicatie" items={ai.communication_feedback} />
            <FeedbackList title="Persoonlijke presentatie" items={ai.personal_presentation} />
            <FeedbackList title="Tips voor je volgende gesprek" items={ai.next_interview_tips} />

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Transcriptie</h2>

                {transcriptie.length === 0 ? (
                    <p className="text-gray-700">Geen transcriptie gevonden.</p>
                ) : (
                    <div className="space-y-4">
                        {transcriptie.map((message, index) => {
                            const isUser = message.role === "user";

                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                                >
                                    <span className="text-xs font-semibold text-gray-500 mb-1">
                                        {isUser ? "Kandidaat" : "Interviewer"}
                                    </span>

                                    <div
                                        className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                                            isUser
                                                ? "bg-primary text-white rounded-tr-none"
                                                : "bg-gray-100 text-gray-900 rounded-tl-none"
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </article>
        </section>
    );
}

function FeedbackList({ title, items = [] }) {
    if (!items || items.length === 0) return null;

    return (
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>

            <ul className="list-disc pl-5 space-y-2 text-gray-800 leading-relaxed">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </article>
    );
}