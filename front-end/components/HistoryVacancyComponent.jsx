import { Link } from "react-router";
import { useEffect, useState } from "react";
import {fetchAPI} from "../services/Fetch.js";

export default function HistoryVacancyComponent({ category }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (category !== "mail") {
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

    if (category === "transcriptie") {
        return <p className="text-gray-500">Interviewgeschiedenis komt later.</p>;
    }

    if (loading) {
        return <p className="text-gray-500">Geschiedenis laden...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (feedbacks.length === 0) {
        return <p className="text-gray-500">Je hebt nog geen motivatiebrief-feedback.</p>;
    }

    return (
        <div className="space-y-4">
            {feedbacks.map((feedback) => (
                <div
                    key={feedback.id}
                    className="rounded-lg p-4 shadow-sm bg-primary/20 hover:bg-primary/50 transition-colors duration-300 ease-in-out max-w-md"
                >
                    <Link
                        to={`/app/history/vacancy-feedback/${feedback.id}`}
                        className="w-full h-full hover:cursor-pointer"
                    >
                        <div className="bg-primary/20 p-3 border-t border-gray-100 text-gray-700 animate-fadeIn">
                            <div className="flex flex-col items-start pb-6">
                                <h1 className="text-primary">
                                    {feedback.vacancy?.title ?? "Onbekende vacature"}
                                </h1>
                                <h2>{feedback.vacancy?.company ?? "Onbekend bedrijf"}</h2>
                                <p className="h3">{feedback.vacancy?.location ?? "Onbekende locatie"}</p>
                            </div>

                            <div className="flex flex-row justify-between">
                                <p className={feedback.accepted ? "font-bold" : "font-light"}>
                                    {feedback.accepted ? "Goedgekeurd" : "Verbeterpunten"}
                                </p>
                                <p>{new Date(feedback.created_at).toLocaleDateString("nl-NL")}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}