import { useEffect, useState } from "react";
import { mapToCVData } from "../../mappers/mapToCVData.js";
import { CVPreview } from "../../components/CVPreview.jsx";
import { DownloadCVButton } from "../../components/DownloadCV.jsx";
import {fetchAPI} from "../../services/Fetch.js";
import {Link} from "react-router";

export default function CVPage() {
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

            const mapped = mapToCVData(
                data.profile,
                data.cv,
                data.cvVersion
            );

            setCvData(mapped);
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
                <div className={"flex justify-end pb-4 gap-4 items-center"}>
                    { /* Button will be Link component to /app/cv/edit page once it exists */}
                    <Link to="/app/cv/edit" className={"bg-secondary text-outline px-2 py-4 rounded-lg"}>Bewerken</Link>
                    <DownloadCVButton data={cvData}/>
                </div>
                <CVPreview data={cvData}/>
            </>
        );
    }