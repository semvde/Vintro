import {Link, Outlet} from "react-router";
import ScrollToTop from "../components/ScrollToTop.jsx";
import VintroLogo from "../src/assets/vintro_logo-03.png";

export default function OnboardLayout() {
    return (
        <>
            <nav>
                <ScrollToTop/>
                <div className="bg-primary w-full h-100px flex justify-between items-center text-outline flex-row">
                    <Link to={"/"}><img src={VintroLogo} alt="Logo" width={60} height={60}/></Link>
                </div>
            </nav>
            <main>
                <Outlet/>
            </main>
            <footer>

            </footer>
        </>
    )
}