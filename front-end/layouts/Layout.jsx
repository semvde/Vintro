import {Outlet} from "react-router";
import Topnavigation from "../components/topnavigation.jsx";

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