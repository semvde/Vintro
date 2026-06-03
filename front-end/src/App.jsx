import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../layouts/Layout.jsx";
import Home from "../pages/Home.jsx";
import Account from "../pages/account/Account.jsx";
import Editaccount from "../pages/account/Editaccount.jsx";
import {History} from "../pages/account/History.jsx";
import {Preferences} from "../pages/account/Preferences.jsx";
import {Settings} from "../pages/account/Settings.jsx";

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/account",
                element: <Account/>,
            },
            {
                path: "/edit-account",
                element: <Editaccount/>,
            },
            {
                path: "/history",
                element: <History/>,
            },
            {
                path: "/preferences",
                element: <Preferences/>,
            },
            {
                path: "/Settings",
                element: <Settings/>,
            },
        ]
    }
]);

export default function App() {
    return (
        <RouterProvider router={router}/>
    )
}