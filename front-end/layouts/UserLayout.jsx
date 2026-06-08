import {Link, Outlet} from "react-router";
import VintroLogo from "../src/assets/vintro_logo-03.png";
import Victoria from "../src/assets/Victoria - Job coach.png";
import {IoMdHome} from "react-icons/io";
import {IoNewspaperSharp} from "react-icons/io5";
import {FaMicrophoneAlt, FaUser} from "react-icons/fa";
import {MdEditDocument} from "react-icons/md";
import {useState} from "react";

export default function UserLayout() {
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <>
            <header>
                <div className={"bg-primary"}>
                    <img src={VintroLogo} alt="Logo" width={60} height={60}/>
                </div>
            </header>
            <main>
                <Outlet/>
            </main>
            {chatOpen &&
                <section
                    className={"fixed bottom-2.5 right-2.5 bg-body outline-body outline-5 border-primary border-3 rounded-lg h-[calc(100%-80px)] w-90 p-5 z-9999 animate-[visible_0.25s_ease-in-out]"}>
                    hoi
                </section>
            }
            <footer className={"fixed left-0 right-0 bottom-0 z-999"}>
                <div className={"flex justify-end p-2.5"}>
                    <button className={"bg-primary shadow rounded-full w-1/5 hover:bg-primary-hover sm:w-1/20"}
                            onClick={() => setChatOpen((x) => !x)}>
                        <img src={Victoria} alt="Victoria - Chat Bot" className={"aspect-square w-full translate-y-1"}/>
                    </button>
                </div>
                <nav className="grid grid-cols-5 bg-outline p-2">
                    {/* Divs will be Links when routes are available */}
                    <Link to={"/app"} className={"flex justify-center"}><IoMdHome size={40}/></Link>
                    <Link to={"/app/vacancies"} className={"flex justify-center"}><IoNewspaperSharp size={40}/></Link>
                    <div className={"flex justify-center"}><FaMicrophoneAlt size={40}/></div>
                    <div className={"flex justify-center"}><MdEditDocument size={40}/></div>
                    <Link to={"/app/account"} className={"flex justify-center"}><FaUser size={40}/></Link>
                </nav>
            </footer>
        </>
    )
}