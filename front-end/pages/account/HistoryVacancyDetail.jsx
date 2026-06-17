import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { fetchAPI } from "../../services/Fetch.js";
import {GoArrowLeft} from "react-icons/go";

function FeedbackList({ title, items = [] }) {
    if (!items || items.length === 0) return null;

    return (
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-gray-900">
                {title}
            </h2>

            <ul className="list-disc pl-5 space-y-2 text-gray-800 leading-relaxed">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </article>
    );
}

export default function HistoryVacancyDetail() {
    const { id } = useParams();

    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadFeedback() {
            try {
                const data = await fetchAPI(`/vacancy-feedback/${id}`);

                if (!data?.data) {
                    setError(data?.message ?? "Feedback niet gevonden.");
                    return;
                }

                setFeedback(data.data);
            } catch (e) {
                setError("Er ging iets mis bij het ophalen van de feedback.");
            } finally {
                setLoading(false);
            }
        }

        loadFeedback();
    }, [id]);

    if (loading) {
        return <p>Laden...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    
    return (
        <section className="max-w-4xl mx-auto px-6 py-8 pb-28 space-y-6">
            <div className="shadow-md rounded-4xl bg-gray-100 max-w-fit max-h-fit p-2">
                <Link to="/app/history" aria-label="Terug naar geschiedenis">
                    <GoArrowLeft />
                </Link>
            </div>

            <header className="space-y-2">
                <p className="text-sm text-gray-600">Motivatiebrief feedback</p>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {feedback.vacancy?.title ?? "Onbekende vacature"}
                </h1>

                <p className="text-lg text-gray-800">
                    {feedback.vacancy?.company ?? "Onbekend bedrijf"} · {feedback.vacancy?.location ?? "Onbekende locatie"}
                </p>

                <span
                    className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                        feedback.accepted
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-900"
                    }`}
                >
                    {feedback.accepted ? "Klaar om te versturen" : "Verbeterpunten gevonden"}
                </span>
            </header>

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-xl font-bold text-gray-900">
                    Jouw motivatiebrief
                </h2>
                <p className="whitespace-pre-line text-gray-800 leading-relaxed">
                    {feedback.motivation_letter}
                </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-xl font-bold text-gray-900">
                    Reactie van Victoria
                </h2>
                <p className="text-gray-800 leading-relaxed">
                    {feedback.ai_feedback?.reaction}
                </p>
            </article>

            <FeedbackList
                title="Wat ging goed?"
                items={feedback.ai_feedback?.good_points}
            />

            <FeedbackList
                title="Wat kan beter?"
                items={feedback.ai_feedback?.improvement_points}
            />

            <FeedbackList
                title="Suggesties vanuit profiel/CV"
                items={feedback.ai_feedback?.profile_suggestions}
            />

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-xl font-bold text-gray-900">
                    Verbeterde voorbeeldbrief
                </h2>
                <p className="whitespace-pre-line text-gray-800 leading-relaxed">
                    {feedback.ai_feedback?.improved_example}
                </p>
            </article>
        </section>
    );
}

