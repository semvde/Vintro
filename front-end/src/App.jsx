import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../layouts/Layout.jsx";
import Home from "../pages/Home.jsx";

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
        ]
    }
]);

export default function App() {
    return (
        <RouterProvider router={router}/>
    )
}