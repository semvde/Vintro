import {createBrowserRouter, RouterProvider} from "react-router";
import Layout from "../layouts/Layout.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/register",
                element: <Register/>,
            },
            {
                path: "/login",
                element: <Login/>,
            },
        ]
    }
]);

export default function App() {
    return (
        <RouterProvider router={router}/>
    )
}