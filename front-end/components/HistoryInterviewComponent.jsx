import { Link } from "react-router";
import { useEffect, useState } from "react";
import { fetchAPI } from "../services/Fetch.js";

export default function HistoryInterviewComponent() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchInterviews() {
            try {
                const data = await fetchAPI("/interview-feedback");

                if (!data?.data) {
                    setError(data?.message ?? "Interviewfeedback kon niet worden opgehaald.");
                    return;
                }

                setInterviews(data.data);
            } catch (e) {
                setError("Er ging iets mis bij het ophalen van de interviewgeschiedenis.");
            } finally {
                setLoading(false);
            }
        }

        fetchInterviews();
    }, []);

    if (loading) {
        return <p className="text-gray-600">Interviewgeschiedenis laden...</p>;
    }

    if (error) {
        return <p className="text-red-700">{error}</p>;
    }

    if (interviews.length === 0) {
        return <p className="text-gray-600">Je hebt nog geen interviewfeedback.</p>;
    }

    return (
        <div className="space-y-4">
            {interviews.map((feedback) => {
                const vacancy = feedback.interview?.vacancy;

                return (
                    <Link
                        key={feedback.id}
                        to={`/app/history/interview-feedback/${feedback.id}`}
                        className="block rounded-xl bg-primary/10 p-4 shadow-sm transition-colors duration-300 ease-in-out hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <article className="rounded-lg bg-primary/10 p-4 text-gray-900">
                            <div className="pb-6">
                                <h3 className="text-primary font-bold leading-tight">
                                    {vacancy?.title ?? "Onbekende vacature"}
                                </h3>

                                <p className="font-semibold">
                                    {vacancy?.company ?? "Onbekend bedrijf"}
                                </p>

                                <p>{vacancy?.location ?? "Onbekende locatie"}</p>
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
                                        ? "Sterk interview"
                                        : "Verbeterpunten"}
                                </span>

                                <time dateTime={feedback.created_at}>
                                    {new Date(feedback.created_at).toLocaleDateString("nl-NL")}
                                </time>
                            </div>
                        </article>
                    </Link>
                );
            })}
        </div>
    );
}