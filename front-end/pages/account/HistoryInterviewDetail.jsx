import { Link, useParams } from "react-router";

export default function HistoryInterviewDetail() {
    const { id } = useParams();

    return (
        <section className="max-w-4xl mx-auto px-6 py-8 pb-28 space-y-6">
            <Link
                to="/app/history"
                className="inline-flex items-center gap-2 text-primary font-semibold underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
                <span aria-hidden="true">←</span>
                Terug naar geschiedenis
            </Link>

            <header className="space-y-2">
                <p className="text-sm text-gray-600">Interview feedback</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Interview #{id}
                </h1>
                <p className="text-lg text-gray-800">
                    Oefengesprek
                </p>

                <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-900">
                    Feedback beschikbaar
                </span>
            </header>

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-xl font-bold text-gray-900">
                    Transcriptie
                </h2>
                <p className="text-gray-800 leading-relaxed">
                    Hier komt later het gesprek tussen de gebruiker en Victoria.
                </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-xl font-bold text-gray-900">
                    Feedback van Victoria
                </h2>
                <p className="text-gray-800 leading-relaxed">
                    Hier komt later de AI-feedback op het interview.
                </p>
            </article>

            <FeedbackList
                title="Wat ging goed?"
                items={[
                    "Hier komen later sterke punten uit het gesprek.",
                ]}
            />

            <FeedbackList
                title="Wat kan beter?"
                items={[
                    "Hier komen later verbeterpunten uit het gesprek.",
                ]}
            />

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-xl font-bold text-gray-900">
                    Advies voor je volgende gesprek
                </h2>
                <p className="text-gray-800 leading-relaxed">
                    Hier komt later persoonlijk advies om het volgende sollicitatiegesprek beter te doen.
                </p>
            </article>
        </section>
    );
}

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