import { useEffect, useState } from "react";
import {fetchAPI} from "../../services/Fetch.js";
import {CVeditForm} from "../../components/CVeditForm.jsx";


export default function EditCV() {
    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCV() {
            const response = await fetchAPI("/profile");
            const data = response.data;

            // safety check
            if (!data || data.items?.[0]?.error) {
                console.error("API error:", data);
                setLoading(false);
                return;
            }

            setCvData(data);
            setLoading(false);
        }

        loadCV();
    }, []);

    if (loading) {
        return <p className="p-8">CV laden...</p>;
    }

    if (!cvData) {
        return (
            <p className="p-8 text-red-500">
                Geen CV data gevonden
            </p>
        );
    }

    return (
        <>
            <CVeditForm data={cvData}/>
        </>
    );
}