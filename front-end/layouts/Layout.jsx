import {Outlet} from "react-router";
import TopNavigation from "../components/TopNavigation.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";

export default function Layout() {
    return (
        <>
            <nav>
                <ScrollToTop />
                <a
                    href="#main-content"
                    className="
                    sr-only
                    focus:not-sr-only
                    focus:absolute
                    focus:top-4
                    focus:left-4
                    focus:z-50
                    focus:px-4
                    focus:py-2
                    focus:bg-black
                    focus:text-white
                    focus:rounded-md
                  "
                >
                    Direct naar inhoud
                </a>
                <TopNavigation/>
            </nav>
            <main id={"main-content"} tabIndex={-1}>
                <Outlet/>
            </main>
            <footer>

            </footer>
        </>
    )
}