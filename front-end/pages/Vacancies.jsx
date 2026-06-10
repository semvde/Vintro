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
            {vacancies.length < 1 &&
                <>
                    <div className={"flex flex-col gap-3 bg-gray-200 rounded-lg shadow my-4 mx-1 p-5 animate-pulse"}>
                        <div className={"bg-gray-300 h-5"}></div>
                        <div className={"flex gap-2"}>
                            <div className={"grow bg-gray-300 h-3"}></div>
                            <div className={"grow bg-gray-300 h-3"}></div>
                        </div>
                        <div className={"bg-gray-300 h-3 mt-2 w-1/4 self-end"}></div>
                    </div>
                    <div className={"flex flex-col gap-3 bg-gray-200 rounded-lg shadow my-4 mx-1 p-5 animate-pulse"}>
                        <div className={"bg-gray-300 h-5"}></div>
                        <div className={"flex gap-2"}>
                            <div className={"grow bg-gray-300 h-3"}></div>
                            <div className={"grow bg-gray-300 h-3"}></div>
                        </div>
                        <div className={"bg-gray-300 h-3 mt-2 w-1/4 self-end"}></div>
                    </div>
                </>
            }
        </>
    );
}