import {Link} from "react-router";
import {fetchAPI} from "../../services/Fetch.js";
import {useEffect, useState} from "react";

export default function Account() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone_number: ""
    });

    useEffect(() => {
        async function getAccountData() {
            try {
                const response = await fetchAPI("/profile");

                if (response && response.data) {
                    const profile = response.data.profile || {};
                    const cv = response.data.cv || {};

                    setUserData({
                        name: profile.name || "",
                        email: cv.email || "",
                        phone_number: cv.phone_number || ""
                    });
                }
            } catch (error) {
                console.error("Account data laden mislukt:", error);
            } finally {
                setLoading(false);
            }
        }

        getAccountData();
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <p className="animate-pulse">Je profielgegevens worden geladen...</p>
            </div>
        );
    }
    return (
        <>
            <section
                className="max-w-100 md:max-w-4xl mx-auto max-h-200 space-y-4 md:space-y-0 flex flex-col md:flex-row md:gap-6 md:p-6">
                <div
                    className="bg-primary/20 flex flex-row md:flex-col items-center space-x-3 md:space-x-0 md:space-y-4 p-6 md:w-1/3 md:justify-center md:rounded-lg">
                    <img alt="profiel foto" src="/front-end/public"/>
                    <h1>{userData.name}</h1>
                </div>

                <div className="flex flex-col gap-4 md:w-2/3">
                    <Link className="text-center text-primary h2 bg-primary/20 p-6 md:rounded-lg"
                          to="/app/edit-account">
                        Account bewerken
                    </Link>

                    <Link className="text-center text-secondary h2 bg-secondary/20 p-6 md:rounded-lg" to="/app/history">
                        Geschiedenis
                    </Link>

                    <Link className="text-center text-primary h2 bg-primary/20 p-6 md:rounded-lg" to="/app/preferences">
                        Voorkeur/ AI policy
                    </Link>

                    <Link className="text-center text-secondary h2 bg-secondary/20 p-6 md:rounded-lg"
                          to="/app/settings">
                        Instellingen
                    </Link>
                </div>
            </section>
        </>
    )
}