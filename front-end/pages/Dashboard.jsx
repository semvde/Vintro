import DashboardCard from "../components/DashboardCard.jsx";
import {FaMicrophoneAlt} from "react-icons/fa";
import {MdEditDocument} from "react-icons/md";
import {HiLightBulb} from "react-icons/hi";
import Thumbnail from "../src/assets/thumbnail_placeholder.jpg";
import VideoCard from "../components/VideoCard.jsx";
import {Link} from "react-router";

export default function Dashboard() {
    return (
        <>
            <section className={"mb-8"}>
                {/* Placeholder name */}
                <h1>Welkom, [NAAM]!</h1>
                <p className={"font-bold"}>Klaar om je voor te bereiden?</p>
                <p>Oefen met gesprekken of vacatures, verbeter je CV of bekijk de tips & tricks video's!</p>
            </section>

            <section className={"mb-8"}>
                <h2>Wat wil je doen?</h2>
                {/* Cards will have Links once pages exist */}
                <Link to={"/app/vacancies"}>
                    <DashboardCard
                        icon={<MdEditDocument/>}
                        title={"Vacature oefenen"}
                        description={"Reageer op vacatures & krijg AI feedback op je sollicitatie"}
                    />
                </Link>

                <DashboardCard
                    icon={<FaMicrophoneAlt/>}
                    title={"Interview oefenen"}
                    description={"Oefen een sollicitatiegesprek met AI"}
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
                    description={"Bekijk en verbeter je CV"}
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