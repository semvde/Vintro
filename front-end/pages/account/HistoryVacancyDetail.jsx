import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { fetchAPI } from "../../services/Fetch.js";

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
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Link to="/app/history">
                ← Terug naar geschiedenis
            </Link>

            <div>
                <h1>{feedback.vacancy?.title}</h1>
                <p>{feedback.vacancy?.company}</p>
                <p>{feedback.vacancy?.location}</p>
            </div>

            <div>
                <h2>Status</h2>
                <p>
                    {feedback.accepted
                        ? "Goedgekeurd"
                        : "Verbeterpunten gevonden"}
                </p>
            </div>

            <div>
                <h2>Jouw motivatiebrief</h2>
                <p>{feedback.motivation_letter}</p>
            </div>

            <div>
                <h2>Reactie van Victoria</h2>
                <p>{feedback.ai_feedback?.reaction}</p>
            </div>

            <div>
                <h2>Wat ging goed?</h2>

                <ul>
                    {feedback.ai_feedback?.good_points?.map((point, index) => (
                        <li key={index}>• {point}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Wat kan beter?</h2>

                <ul>
                    {feedback.ai_feedback?.improvement_points?.map((point, index) => (
                        <li key={index}>• {point}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Suggesties vanuit profiel/CV</h2>

                <ul>
                    {feedback.ai_feedback?.profile_suggestions?.map((point, index) => (
                        <li key={index}>• {point}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Verbeterde voorbeeldbrief</h2>

                <p>{feedback.ai_feedback?.improved_example}</p>
            </div>
        </div>
    );
}