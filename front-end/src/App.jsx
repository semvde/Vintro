import { createBrowserRouter, RouterProvider } from "react-router";
import UserLayout from "../layouts/UserLayout.jsx";
import Dashboard from "../pages/Dashboard.jsx";

const router = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            {
                path: "/app/",
                element: <Dashboard />,
            },
        ]
    }
]);

export default function App() {
    return (
        <RouterProvider router={router}/>
    )
}