import { useEffect, useState } from "react";
import { mapToCVData } from "../mappers/mapToCVData";
import { CVPreview } from "../components/CVPreview";
import { DownloadCVButton } from "../components/DownloadCV";
import {fetchAPI} from "../services/Fetch.js";

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

    console.log(cvData);
        return (
            <div className="space-y-8 p-8">
                <DownloadCVButton data={cvData}/>
                <CVPreview data={cvData}/>
            </div>
        );
    }