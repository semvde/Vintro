import { Link } from "react-router";
import { useEffect, useState } from "react";
import { fetchAPI } from "../services/Fetch.js";

export default function HistoryVacancyComponent({ category }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");

        if (category !== "applications") {
            setLoading(false);
            return;
        }

        async function fetchFeedbacks() {
            try {
                const data = await fetchAPI("/vacancy-feedback");

                if (data?.message) {
                    setError(data.message);
                    return;
                }

                setFeedbacks(data.data ?? []);
            } catch (e) {
                setError("Er ging iets mis bij het ophalen van de geschiedenis.");
            } finally {
                setLoading(false);
            }
        }

        fetchFeedbacks();
    }, [category]);

    if (category === "interviews") {
        return <p className="text-gray-600">Interviewgeschiedenis laden...</p>;
    }

    if (loading) {
        return <p className="text-gray-600">Geschiedenis laden...</p>;
    }

    if (error) {
        return <p className="text-red-700">{error}</p>;
    }

    if (feedbacks.length === 0) {
        return <p className="text-gray-600">Je hebt nog geen sollicitatiefeedback.</p>;
    }

    return (
        <div className="space-y-4">
            {feedbacks.map((feedback) => (
                <Link
                    key={feedback.id}
                    to={`/app/history/vacancy-feedback/${feedback.id}`}
                    className="block max-w-md rounded-lg bg-primary/10 p-4 shadow-sm transition-colors duration-300 ease-in-out hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <article className="bg-primary/10 p-4 text-gray-800">
                        <div className="flex flex-col items-start pb-6">
                            <h3 className="text-primary font-bold">
                                {feedback.vacancy?.title ?? "Onbekende vacature"}
                            </h3>
                            <p className="font-semibold">
                                {feedback.vacancy?.company ?? "Onbekend bedrijf"}
                            </p>
                            <p>
                                {feedback.vacancy?.location ?? "Onbekende locatie"}
                            </p>
                        </div>

                        <div className="flex flex-row justify-between gap-4">
                            <span
                                className={
                                    feedback.accepted
                                        ? "font-semibold text-green-800"
                                        : "font-semibold text-orange-900"
                                }
                            >
                                {feedback.accepted
                                    ? "Klaar om te versturen"
                                    : "Verbeterpunten"}
                            </span>

                            <time dateTime={feedback.created_at}>
                                {new Date(feedback.created_at).toLocaleDateString("nl-NL")}
                            </time>
                        </div>
                    </article>
                </Link>
            ))}
        </div>
    );
}