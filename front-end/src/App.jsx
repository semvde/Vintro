import {createBrowserRouter, RouterProvider} from "react-router";
import Layout from "../layouts/Layout.jsx";
import Register from "../pages/Register.jsx";

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/register",
                element: <Register/>,
            },
            // {
            //     path: "/login",
            //     element: <Login/>,
            // },
        ]
    }
]);

export default function App() {
    return (
        <RouterProvider router={router}/>
    )
}