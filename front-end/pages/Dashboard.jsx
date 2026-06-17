import DashboardCard from "../components/DashboardCard.jsx";
import {FaMicrophoneAlt} from "react-icons/fa";
import {MdEditDocument} from "react-icons/md";
import {HiLightBulb} from "react-icons/hi";
import Thumbnail from "../src/assets/thumbnail_placeholder.jpg";
import VideoCard from "../components/VideoCard.jsx";
import {Link} from "react-router";
import {useNavigate} from "react-router";
import {IoNewspaperSharp} from "react-icons/io5";
import {fetchAPI} from "../services/Fetch.js";
import {useEffect, useState} from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

export default function Dashboard() {
    const [name, setName] = useState(null)
    const [nameLoaded, setNameLoaded] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetchAPI("/user");
                const response2 = await fetchAPI("/profile");
                const data = response;
                const data2 = response2

                if (data.onboarded === 1) {
                    if (data) {
                        setName(data2.data.profile.name);
                        setTimeout(() => setNameLoaded(true), 50);
                    }
                } else if (data.onboarded === 0) {
                    navigate("/app/onboarding")
                }
            } catch (error) {
                console.error("Fout bij ophalen dashboard data:", error);
            }
        }

        getData();
    }, []);

    return (
        <>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in-name {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                `}
            </style>

            <section className={"mb-8"}>

                <h1 className={`transition-opacity duration-300 ${nameLoaded ? '' : 'opacity-0'}`}>
                    Welkom,
                    <span className={nameLoaded ? 'fade-in-name pl-2 inline-block' : 'opacity-0'}>
                        {name || '...'}
                    </span>!
                </h1>
                <p className={"font-bold"}>Klaar om je voor te bereiden?</p>
                <p>Oefen met gesprekken of vacatures, verbeter je CV of bekijk de tips & tricks video's!</p>
            </section>

            <section className={"mb-8"}>
                <h2>Wat wil je doen?</h2>
                {/* Cards will have Links once pages exist */}
                <Link to={"/app/vacancies"}><DashboardCard
                    icon={<MdEditDocument/>}
                    title={"Vacature oefenen"}
                    description={"Reageer op vacatures & krijg AI feedback op je sollicitatie"}
                /></Link>

                <Link to={"/app/interviews"}>
                    <DashboardCard
                        icon={<FaMicrophoneAlt/>}
                        title={"Interview oefenen"}
                        description={"Oefen een sollicitatiegesprek met AI"}
                    />
                </Link>
                <Link to={"/app/cv"}><DashboardCard
                    icon={<IoNewspaperSharp/>}
                    title={"Bewerk je CV"}
                    description={"Bekijk en verbeter je CV"}
                /></Link>
            </section>

            <section className={"pb-10"}>
                <h2>Tips & Tricks</h2>
                <div className={"flex flex-col gap-2.5"}>
                    <Accordion>
                        <AccordionSummary>
                            <b>Bereid je goed voor</b>
                        </AccordionSummary>
                        <AccordionDetails>
                            Een goede voorbereiding vergroot je zelfvertrouwen en laat zien dat je serieus
                            geïnteresseerd bent in de functie. Lees de vacature aandachtig door, bekijk de website van
                            het bedrijf en verdiep je in de missie, waarden en recente ontwikkelingen. Probeer daarnaast
                            te bedenken welke vragen je kunt verwachten en oefen je antwoorden, zodat je tijdens het
                            gesprek rustig en overtuigend kunt reageren.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <b>Pas je cv en motivatiebrief aan op de vacature</b>
                        </AccordionSummary>
                        <AccordionDetails>
                            Verstuur niet voor elke sollicitatie dezelfde documenten. Zorg ervoor dat je cv en
                            motivatiebrief aansluiten op de functie-eisen en benadruk de ervaring en vaardigheden die
                            voor deze specifieke baan relevant zijn. Door voorbeelden te geven van behaalde resultaten
                            of projecten maak je jouw sollicitatie persoonlijker en vergroot je de kans dat je opvalt
                            tussen andere kandidaten.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <b>Gebruik concrete voorbeelden tijdens het gesprek</b>
                        </AccordionSummary>
                        <AccordionDetails>
                            Werkgevers willen niet alleen horen dat je bijvoorbeeld goed kunt samenwerken of problemen
                            kunt oplossen, maar ook hoe je dat in de praktijk hebt laten zien. Gebruik daarom concrete
                            situaties uit werk, studie of stages om je kwaliteiten te onderbouwen. Door te beschrijven
                            wat de situatie was, welke taak je had, welke actie je hebt ondernomen en wat het resultaat
                            was, maak je een veel sterkere indruk.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <b>Stel zelf vragen aan de werkgever</b>
                        </AccordionSummary>
                        <AccordionDetails>
                            Een sollicitatiegesprek is niet alleen bedoeld om beoordeeld te worden, maar ook om te
                            ontdekken of de organisatie bij jou past. Stel daarom vragen over de werkzaamheden, het
                            team, doorgroeimogelijkheden of de bedrijfscultuur. Dit toont betrokkenheid en interesse,
                            terwijl je tegelijkertijd waardevolle informatie krijgt om een goede keuze te maken als je
                            wordt aangenomen.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <b>Volg het sollicitatiegesprek professioneel op</b>
                        </AccordionSummary>
                        <AccordionDetails>
                            Na afloop van het gesprek kan een korte bedankmail of een vriendelijk bericht een positieve
                            indruk achterlaten. Bedank de gesprekspartner voor de tijd en het prettige gesprek en geef
                            aan dat je nog steeds enthousiast bent over de functie. Mocht je onverhoopt worden
                            afgewezen, vraag dan gerust om feedback. Deze informatie kan je helpen om jezelf bij
                            toekomstige sollicitaties verder te verbeteren.
                        </AccordionDetails>
                    </Accordion>
                </div>
            </section>
        </>
    )
}