import {Link, Outlet} from "react-router";
import VintroLogo from "../src/assets/vintro_logo-03.png";
import {IoMdHome} from "react-icons/io";
import {IoNewspaperSharp} from "react-icons/io5";
import {FaMicrophoneAlt, FaUser} from "react-icons/fa";
import {MdEditDocument} from "react-icons/md";

export default function UserLayout() {
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
            <footer className={"fixed left-0 right-0 bottom-0 z-999"}>
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