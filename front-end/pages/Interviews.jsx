import Card from "../components/Card.jsx";
import { Link } from "react-router";
import Victoria from "../src/assets/Victoria - verdrietig.png";
import ButtonPrimary from "../components/ButtonPrimary.jsx";
import { useEffect, useState } from "react";
import { fetchAPI } from "../services/Fetch.js";

export default function Interviews() {
    const [loading, setLoading] = useState(true);
    const [vacancies, setVacancies] = useState([]);

    //Ik schaam me als front-ender, maar back-end weigerde een endpoint aan te leveren,
    // dus geniet van een lijst van 404 errors.
    useEffect(() => {
        async function loadData() {
            setLoading(true);

            try {
                // 1. alle "applications / vacancies"
                const res = await fetchAPI("/vacancies");
                const allVacancies = res.data ?? [];

                // 2. per vacancy feedback ophalen
                const feedbackResponses = await Promise.all(
                    allVacancies.map((v) =>
                        fetchAPI(`/vacancies/${v.id}/feedback`)
                    )
                );

                // 3. combineren + filteren op accepted
                const acceptedVacancies = allVacancies
                    .map((vacancy, index) => {
                        const feedback = feedbackResponses[index]?.data;

                        return {
                            ...vacancy,
                            feedback
                        };
                    })
                    .filter((v) => v.feedback?.accepted === true);

                setVacancies(acceptedVacancies);
            } catch (error) {
                setVacancies([]);
            } finally {
                setLoading(false);
            }
        }

        loadData();
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
    if (!vacancies || vacancies.length === 0) {
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
                {vacancies.map((item) => (
                    <Link
                        key={item.id}
                        to={`/app/interview/${item.id}`}
                        className="block"
                    >
                        <Card>
                            <div className="p-5">
                                <h2 className="text-primary text-lg font-bold">
                                    {item.title}
                                </h2>

                                <div className="text-sm mt-1">
                                    <p className="font-semibold">
                                        {item.company}
                                    </p>
                                    <p>
                                        {" "}• {item.location}
                                    </p>
                                </div>

                                <p className="text-right mt-4 text-sm">
                                    {item.employment_type}
                                </p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}