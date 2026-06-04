import {Outlet} from "react-router";
import TopNavigation from "../components/TopNavigation.jsx";

export default function Layout() {
    return (
        <>
            <nav>
                <TopNavigation/>
            </nav>
            <main>
                <Outlet/>
            </main>
            <footer>

            </footer>
        </>
    )
}