import {Outlet} from "react-router";
import Topnavigation from "../components/Topnavigation.jsx";

export default function Layout() {
    return(
        <>
            <nav>
                <Topnavigation/>
            </nav>
            <main>
                <Outlet />
            </main>
            <footer>

            </footer>
        </>
    )
}