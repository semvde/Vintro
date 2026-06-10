import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {fetchAPI} from "../services/Fetch.js";
import ButtonPrimary from "../components/ButtonPrimary.jsx";

export default function VacancyApply() {
    const { id } = useParams();
    let navigate = useNavigate();

    const [vacancy, setVacancy] = useState(null);
    const [text, setText] = useState("");

    async function getVacancy() {
        try {
            let { data } = await fetchAPI(`/vacancies/${id}`);

            if (!data) {
                throw new Error("Geen data");
            }

            setVacancy(data);
        } catch (err) {
            console.error(err);
            setVacancy({ title: "Fout bij ophalen vacature" });
        }
    }

    useEffect(() => {
        getVacancy();
    }, [id]);

    useEffect(() => {
        if (!vacancy) return;

        setText(`Beste ${vacancy.company || ""},

Met veel enthousiasme solliciteer ik naar de functie van ${vacancy.title || ""}!
                
[Schrijf hier je motivatie!]
                
Met vriendelijke groet,
[Jouw naam!]`
        );
    }, [vacancy]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            vacancy_id: vacancy.id,
            motivation_letter: text,
        };

        const data = await fetchAPI('/vacancy-feedback', "POST", payload);
        navigate(`/app/vacancies/${id}/apply/feedback`);

    };

    if (!vacancy) {
        return <p>Vacature laden...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 pb-12">
            <div className={"flex flex-col gap-2 pb-4"}>
                <h1>
                    {vacancy.title}
                </h1>
                <p className={"font-light"}>{vacancy.company}</p>
                <p className={"font-bold pt-2"}>Over de vacature: </p>
                <p className={"text-sm"}>
                   {vacancy.description}
                </p>
                <button type={"submit"}
                        className={"bg-primary text-outline rounded-full cursor-pointer transition p-2.5 hover:bg-primary-hover "}>
                    Verzenden
                </button>
            </div>

            <textarea value={text} onChange={(e) => setText(e.target.value)}
                rows={14} className="w-full p-3 border rounded-lg resize-y"/>
        </form>
    );
}