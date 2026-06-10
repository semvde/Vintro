import { useEffect, useState } from "react";
import { fetchAPI } from "../services/Fetch.js";
import Card from "../components/Card.jsx";
import {Link} from "react-router";
import Victoria from "../src/assets/Victoria - verdrietig.png";
import ButtonPrimary from "../components/ButtonPrimary.jsx";

export default function Interviews() {
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAPI("/vacancy-feedback").then((response) => {
            const accepted = response.data.filter(
                (feedback) => feedback.accepted
            );

            setVacancies(accepted);
            setLoading(false);
        });
    }, []);

    // 1. LOADING STATE
    if (loading) {
        return (
            <div className="p-5">
                <p>Laden...</p>
            </div>
        );
    }

    // 2. EMPTY STATE
    if (!vacancies.length) {
        return (
            <div className="p-12 text-center">
                <img src={Victoria} alt={"Victoria"} />
                <p className={"font-bold"}>Je hebt nog geen uitnodiging voor een interview</p>
                <p className={"py-2 text-sm"}>Solliciteer op vacatures om uitgenodigd te worden voor een interview!</p>
                <ButtonPrimary>
                    <Link to={"/app/vacancies"}>Bekijk vacatures</Link>
                </ButtonPrimary>
            </div>
        );
    }

    // 3. SUCCESS STATE
    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-5">Klaar voor een gesprek?</h1>
            <div className="space-y-4">
                {vacancies.map((item) => (
                    <Link key={item.id} to={`/app/interview/${item.id}`} className="block">
                        <Card>
                            <div className="p-5">
                                <h2 className="text-primary text-lg font-bold">{item.vacancy.title}</h2>
                                <div className="text-sm mt-1">
                                    <p className="font-semibold">{item.vacancy.company}</p>
                                    <p>{" "}• {item.vacancy.location}</p>
                                </div>
                                <p className="text-right mt-4 text-sm">{item.vacancy.employment_type}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}