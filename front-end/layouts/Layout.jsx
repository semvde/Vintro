import {Outlet} from "react-router";

export default function Layout() {
    return(
        <>
            <nav>

            </nav>
            <main>
                <Outlet />
            </main>
            <footer>

            </footer>
        </>
    )
}