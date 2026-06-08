import {Outlet} from "react-router";
import TopNavigation from "../components/TopNavigation.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";

export default function Layout() {
    return (
        <>
            <nav>
                <ScrollToTop />
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