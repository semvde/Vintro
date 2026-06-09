import {useContext, useEffect, useState} from "react";
import {Navigate, useLocation} from "react-router";
import {fetchAPI} from "../services/Fetch.js";
import {AppContext} from "../src/Contexts.jsx";
import Layout from "../layouts/Layout.jsx";
import UserLayout from "../layouts/UserLayout.jsx";

export default function ProtectedRoute({children}) {
    const [loading, setLoading] = useState(true);
    const {user, setUser} = useContext(AppContext);
    const location = useLocation();

    useEffect(() => {
        const checkLogin = async () => {
            setLoading(true);

            const res = await fetchAPI("/user");

            if (res?.id) {
                setUser(res);
            } else {
                setUser(null);
            }

            setLoading(false);
        };

        checkLogin();
    }, [location.pathname]);

    if (loading) return <UserLayout/>;

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    if (user.onboarded === 0 && location.pathname !== "/app/onboarding") {
        return <Navigate to="/app/onboarding" replace/>;
    }

    if (user.onboarded === 1 && location.pathname === "/app/onboarding") {
        return <Navigate to="/app" replace/>;
    }

    return children;
}