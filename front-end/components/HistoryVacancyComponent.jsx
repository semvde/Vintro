import {Link} from "react-router";

export default function HistoryVacancyComponent({category}) {
    const vacancyData = {
        mail: {
            title: "Frontend developer",
            companyName: "Dept",
            location: "Rotterdam - Zuid-Holland",
            seen: true,
            hoursPerWeek: 32
        },
        transcriptie: {
            title: "Frontend developer",
            companyName: "Dept",
            location: "Rotterdam - Zuid-Holland",
            seen: false,
            hoursPerWeek: 32
        }
    }

    const data = vacancyData[category]

    if (!data) return <p className="text-gray-500">Geen vacature gevonden </p>

    return (
        <div
            className="rounded-lg p-4 shadow-sm bg-primary/20 hover:bg-primary/50 transition-colors duration-300 ease-in-out max-w-md">

            {/*Hier moet de link nog komen tussen de geschiedenis en de interview pagina*/}
            <Link to="/history" className="w-full h-full hover:cursor-pointer ">
                <div className="bg-primary/20 p-3 border-t border-gray-100 text-gray-700 animate-fadeIn">
                    <div className="flex flex-col items-start  pb-6">
                        <h1 className="text-primary">{data.title}</h1>
                        <h2>{data.companyName}</h2>
                        <p className="h3">{data.location}</p>
                    </div>

                    <div className="flex flex-row justify-between ">
                        <p className={data.seen ? "font-bold" : "font-light"}>{data.seen ? "Bekeken" : "Nog niet bekeken"}</p>
                        <p>{data.hoursPerWeek} uur/week</p>
                    </div>

                </div>
            </Link>
        </div>

    )
}