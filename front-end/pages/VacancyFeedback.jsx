import { useEffect, useState } from "react";
import { fetchAPI } from "../services/Fetch.js";
import Victoria from "../src/assets/Victoria - Job coach.png";

export default function VacancyFeedback() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeedback = async () => {
            try {
                const res = await fetchAPI("/vacancies/1/feedback", "GET");
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadFeedback();
    }, []);

    if (loading) {
        return <p>Loading feedback...</p>;
    }

    if (!data) {
        return <p>Geen feedback gevonden</p>;
    }

    const feedback = data.data.ai_feedback;

    return (
        <div className="p-4 max-w-2xl mx-auto pb-12">
            <div className={"flex justify-center"}>
                <img src={Victoria} alt={"Victoria"} width={200}/>
            </div>
            <p className={"font-bold italic pb-6"}>{feedback.reaction}</p>

            <h2>Wat gaat al goed?</h2>
            <ul className={"list-disc list-inside"}>
                {feedback.good_points.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>

            <h2 className="font-semibold mt-4 pt-6">Verbeterpunten</h2>
            <ul className={"list-disc list-inside"}>
                {feedback.improvement_points.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>

            <h2 className="font-semibold mt-4 pt-6">Suggesties voor je CV</h2>
            <ul className={"list-disc list-inside"}>
                {feedback.profile_suggestions.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>

            <h2 className="font-semibold mt-4 pt-6">Voorbeeld</h2>
            <p className="whitespace-pre-line">
                {feedback.improved_example}
            </p>
        </div>
    );
}