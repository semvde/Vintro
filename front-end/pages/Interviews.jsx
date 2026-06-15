import Card from "../components/Card.jsx";
import { Link } from "react-router";
import Victoria from "../src/assets/Victoria - verdrietig.png";
import ButtonPrimary from "../components/ButtonPrimary.jsx";
import { useEffect, useState } from "react";
import { fetchAPI } from "../services/Fetch.js";

export default function Interviews() {
    const [loading, setLoading] = useState(true);
    const [feedbackItems, setFeedbackItems] = useState([]);

    useEffect(() => {
        async function loadAccepted() {
            const res = await fetchAPI("/vacancy-feedback/accepted");

            setFeedbackItems(res?.data || []);
            setLoading(false);
        }

        loadAccepted();
    }, []);

    // LOADING
    if (loading) {
        return (
            <div className="p-5">
                <p>Laden...</p>
            </div>
        );
    }

    // EMPTY STATE
    if (!feedbackItems.length) {
        return (
            <div className="p-12 text-center">
                <img src={Victoria} alt="Victoria" />
                <p className="font-bold">
                    Je hebt nog geen goedgekeurde interviews
                </p>
                <p className="py-2 text-sm">
                    Solliciteer op vacatures om uitgenodigd te worden!
                </p>
                <ButtonPrimary>
                    <Link to="/app/vacancies">Bekijk vacatures</Link>
                </ButtonPrimary>
            </div>
        );
    }

    // SUCCESS
    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-5">
                Klaar voor een gesprek?
            </h1>

            <div className="space-y-4">
                {feedbackItems.map((item) => {
                    const vacancy = item.vacancy;

                    return (
                        <Link
                            key={item.id}
                            to={`/app/interview/${item.id}`}
                            className="block"
                        >
                            <Card>
                                <div className="p-5">
                                    <h2 className="text-primary text-lg font-bold">
                                        {vacancy?.title}
                                    </h2>

                                    <div className="text-sm mt-1">
                                        <p className="font-semibold">
                                            {vacancy?.company}
                                        </p>
                                        <p> • {vacancy?.location}</p>
                                    </div>

                                    <p className="text-right mt-4 text-sm">
                                        {vacancy?.employment_type}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}