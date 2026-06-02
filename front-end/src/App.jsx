import {createBrowserRouter, RouterProvider} from "react-router";
import Layout from "../layouts/Layout.jsx";
import Home from "../pages/Home.jsx";
import UserLayout from "../layouts/UserLayout.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Onboarding from "../pages/Onboarding.jsx";

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
        element: <UserLayout/>,
        children: [
            {
                path: "/app/",
                element: <Dashboard/>,
            },
            {
                path: "/app/onboarding",
                element: <Onboarding />,
            },
        ]
    }
]);

export default function App() {
    return (
        <RouterProvider router={router}/>
    )
}