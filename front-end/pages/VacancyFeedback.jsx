import {useEffect, useState} from "react";
import {fetchAPI} from "../services/Fetch.js";
import Victoria from "../src/assets/Victoria - Job coach.png";
import {useParams} from "react-router";

export default function VacancyFeedback() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        const loadFeedback = async () => {
            try {
                const res = await fetchAPI(`/vacancies/${params.id}/feedback`, "GET");
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
        <div className="p-4 max-w-2xl mx-auto pb-12 gap-13">
            <div className={"flex justify-center"}>
                <img src={Victoria} alt={"Victoria"} width={200}/>
            </div>
            <div className="shadow-md bg-gray-300/20 mb-13  p-2">
            <p className={"font-bold italic "}>"{feedback.reaction}"</p>
        </div>
            <div className="bg-secondary/20 p-3 shadow-md gap-20">
                <div className="p-2">
                    <h2>Wat gaat al goed?</h2>
                    <ul className={"list-disc list-inside"}>
                        {feedback.good_points.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>

                </div>
                <div className="bg-white p-2 shadow-md mt-3">
                    <h2 className="font-semibold">Verbeterpunten</h2>
                    <ul className={"list-disc list-inside"}>
                        {feedback.improvement_points.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="p-4">
                <h2 className="font-semibold mt-4 pt-6">Suggesties voor je CV</h2>
                <ul className={"list-disc list-inside"}>
                    {feedback.profile_suggestions.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </div>

            <div className="p-3 bg-primary/20 mt-4 shadow-md">
                <h2 className="font-semibold pt-6">Voorbeeld</h2>
                <p className="whitespace-pre-line">
                    {feedback.improved_example}
                </p>
            </div>
        </div>
    );
}