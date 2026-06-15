import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router";
import {fetchAPI} from "../services/Fetch.js";
import ButtonPrimary from "../components/ButtonPrimary.jsx";

export default function VacationDetail() {
    const [vacancy, setVacancy] = useState({});
    const params = useParams();
    const navigate = useNavigate();

    async function getVacancy() {
        let {data} = await fetchAPI(`/vacancies/${params.id}`);

        if (data === undefined) data = [{"title": "Fout met ophalen van vacature"}];

        setVacancy(data);
    }

    useEffect(() => {
        getVacancy()
    }, [params.id]);

    return (
        <>
            <section>
                <h1 className={"text-primary"}>{vacancy.title}</h1>
                <span className={"text-2xl font-bold"}>{vacancy.company}</span>
                <span className={"text-2xl"}> • {vacancy.location}</span>
            </section>
            <section className={"py-7.5"}>
                <p>{vacancy.description}</p>
            </section>
            <section className={"flex flex-col gap-2.5"}>
                <p>Klinkt dit goed? Solliciteer dan nu!</p>
                <Link to={`/app/vacancies/${params.id}/apply`} className={"flex items-center gap-2.5"}>
                    <ButtonPrimary style={"rounded-lg w-fit px-4"}>Solliciteren</ButtonPrimary>
                    <p className={"text-right font-bold w-full"}>{vacancy.employment_type}</p>
                </Link>
            </section>
            <section className={"pt-5"}>
                <p className={"text-sm text-balance italic"}>Deze vacature is slechts een simulatie. Door te
                    solliciteren krijg je feedback van je AI job coach over wat goed ging en wat wellicht beter kan om
                    je volgende sollicitatie nog sterker te maken!</p>
            </section>
        </>
    );
}