import {createBrowserRouter, RouterProvider} from "react-router";
import Layout from "../layouts/Layout.jsx";
import Home from "../pages/Home.jsx";
import Account from "../pages/account/Account.jsx";
import EditAccount from "../pages/account/EditAccount.jsx";
import {History} from "../pages/account/History.jsx";
import {Preferences} from "../pages/account/Preferences.jsx";
import {Settings} from "../pages/account/Settings.jsx";
import UserLayout from "../layouts/UserLayout.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import {AppContext} from "./Contexts.jsx";
import {useState} from "react";
import Onboarding from "../pages/Onboarding.jsx";
import CV from "../pages/cv/CV.jsx";
import EditCV from "../pages/cv/EditCV.jsx";
import Vacancies from "../pages/Vacancies.jsx";
import VacationDetail from "../pages/VacancyDetail.jsx";
import OnboardLayout from "../layouts/OnboardLayout.jsx";

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/login",
                element: <Login/>,
            },
            {
                path: "/register",
                element: <Register/>,
            },
        ]
    },
    {
        element: (<ProtectedRoute><OnboardLayout/></ProtectedRoute>),
        children: [
            {
                path: "/app/onboarding",
                element: <Onboarding/>,
            }
        ]
    },
    {
        element: (
            <ProtectedRoute>
                <UserLayout/>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/app/",
                element: <Dashboard/>,
            },
            {
                path: "/app/onboarding",
                element: <Onboarding/>,
            },
            {
                path: "/app/vacancies",
                element: <Vacancies/>,
            },
            {
                path: "/app/vacancies/:id",
                element: <VacationDetail/>
            },
            {
                path: "/app/account",
                element: <Account/>,
            },
            {
                path: "/app/edit-account",
                element: <EditAccount/>,
            },
            {
                path: "/app/history",
                element: <History/>,
            },
            {
                path: "/app/preferences",
                element: <Preferences/>,
            },
            {
                path: "/app/settings",
                element: <Settings/>
            },
            {
                path: "/app/cv",
                element: <CV/>,
            },
            {
                path: "/app/cv/edit",
                element: <EditCV/>,
            },
        ]
    }
]);

export default function App() {
    const [user, setUser] = useState(null);

    return (
        <AppContext value={{user, setUser}}>
            <RouterProvider router={router}/>
        </AppContext>
    )
}