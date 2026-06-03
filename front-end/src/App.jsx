import {createBrowserRouter, RouterProvider} from "react-router";
import Layout from "../layouts/Layout.jsx";
import Home from "../pages/Home.jsx";
import UserLayout from "../layouts/UserLayout.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import {AppContext} from "./Contexts.jsx";
import {useState} from "react";
import Onboarding from "../pages/Onboarding.jsx";
import Vacancies from "../pages/Vacancies.jsx";

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
        element: (
            // <ProtectedRoute>
            <UserLayout/>
            // </ProtectedRoute>
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