import Card from "../components/Card.jsx";
import {useEffect, useState} from "react";
import {fetchAPI} from "../services/Fetch.js";
import {Link} from "react-router";

export default function Vacancies() {
    const [vacancies, setVacancies] = useState([]);

    async function getVacancies() {
        let {data} = await fetchAPI('/vacancies');

        if (data === undefined) data = [{"title": "Fout met ophalen van vacatures"}];

        setVacancies(data);
    }

    useEffect(() => {
        getVacancies();
    }, []);

    return (
        <>
            {
                vacancies.map((vacancy) => {
                    return (
                        <Link to={`/app/vacancies/${vacancy.id}`} key={vacancy.id}>
                            <Card>
                                <div className={"p-5"}>
                                    <h2 className={"text-primary"}>{vacancy.title}</h2>
                                    <span className={"text-xl font-bold"}>{vacancy.company}</span>
                                    <span className={"text-xl"}> • {vacancy.location}</span>
                                    <p className={"text-right mt-5"}>{vacancy.employment_type}</p>
                                </div>
                            </Card>
                        </Link>
                    );
                })
            }
        </>
    );
}