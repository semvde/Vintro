import DashboardCard from "../components/DashboardCard.jsx";
import {FaMicrophoneAlt} from "react-icons/fa";
import {MdEditDocument} from "react-icons/md";
import {HiLightBulb} from "react-icons/hi";
import Thumbnail from "../src/assets/thumbnail_placeholder.jpg";
import VideoCard from "../components/VideoCard.jsx";
import {IoNewspaperSharp} from "react-icons/io5";
import {Link} from "react-router";
import {Link, useNavigate} from "react-router";
import {IoNewspaperSharp} from "react-icons/io5";
import {fetchAPI} from "../services/Fetch.js";
import {useEffect, useState} from "react";

export default function Dashboard() {
    const [name, setName] = useState(null)
    const [nameLoaded, setNameLoaded] = useState(false)
const navigate = useNavigate()
    useEffect(() => {
        console.log("use effect getriggerd");

        async function getData() {
            try {
                const response = await fetchAPI("/user");
                const response2 = await fetchAPI("/profile");
                const data = response;
                const data2 = response2
                console.log("Dashboard data binnen:", data2);

                if (data.onboarded === 1) {
                    if (data) {
                        setName(data2.data.profile.name);
                        setTimeout(() => setNameLoaded(true), 50);
                    }
                }else if (data.onboarded === 0) {
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
                    icon={<MdEditDocument />}
                    title={"Vacature oefenen"}
                    description={"Reageer op vacatures & krijg AI feedback op je sollicitatie"}
                /></Link>
                <Link to={"/app/interview"}><DashboardCard
                    icon={<FaMicrophoneAlt />}
                <Link to={"/app/vacancies"}>
                    <DashboardCard
                        icon={<IoNewspaperSharp/>}
                        title={"Vacature oefenen"}
                        description={"Reageer op vacatures & krijg AI feedback op je sollicitatie"}
                    />
                </Link>

                <DashboardCard
                    icon={<FaMicrophoneAlt/>}
                    title={"Interview oefenen"}
                    description={"Oefen een sollicitatiegesprek met AI"}
                /></Link>
                <Link to={"/app/cv"}><DashboardCard
                    icon={<IoNewspaperSharp />}
                    title={"Bewerk je CV"}
                    description={"Bekijk en verbeter je CV"}
                /></Link>
                />
                <Link to={"/app/cv"}>
                    <DashboardCard
                        icon={<MdEditDocument/>}
                        title={"Bewerk je CV"}
                        description={"Bekijk en verbeter je CV"}
                    />
                </Link>

                <DashboardCard
                    icon={<HiLightBulb/>}
                    title={"Tips & Tricks"}
                    description={"Ontdek tips & tricks die je helpen jezelf beter te presenteren"}
                    description={"Hoe kan jij voorbereid het sollicitatiegesprek in?"}
                />

            </section>

            <section>
                {/* Cards will have Links once videos exist */}
                <h2>Aanbevolen voor jou</h2>
                <div className={"flex overflow-x-auto"}>
                    <VideoCard
                        thumbnail={Thumbnail}
                        title={"[Video titel]"}
                        tag={"[Tag]"}
                    />
                    <VideoCard
                        thumbnail={Thumbnail}
                        title={"[Video titel]"}
                        tag={"[Tag]"}
                    />
                    <VideoCard
                        thumbnail={Thumbnail}
                        title={"[Video titel]"}
                        tag={"[Tag]"}
                    />
                </div>
            </section>
        </>
    )
}