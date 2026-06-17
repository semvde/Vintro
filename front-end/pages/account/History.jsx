import { Link } from "react-router";
import { GoArrowLeft } from "react-icons/go";
import { useState } from "react";
import HistoryVacancyComponent from "../../components/HistoryVacancyComponent.jsx";
import HistoryInterviewComponent from "../../components/HistoryInterviewComponent.jsx";

export function History() {
    const [currentPage, setCurrentPage] = useState("applications");

    return (
        <section className="max-w-100 md:max-w-4xl mx-auto h-[calc(100vh-120px)] overflow-hidden space-y-6 px-6 py-6">
            <div className="flex justify-between flex-row items-center">
                <div className="shadow-md rounded-4xl bg-gray-100 max-w-fit max-h-fit p-2">
                    <Link to="/app/account" aria-label="Terug naar account">
                        <GoArrowLeft />
                    </Link>
                </div>

                <h2>Geschiedenis</h2>
            </div>

            <div className="bg-primary flex flex-row justify-between p-4 md:p-6 rounded-lg md:justify-start md:space-x-12">
                <button
                    className={
                        currentPage === "applications"
                            ? "font-bold text-white"
                            : "font-normal text-white/80 hover:text-white transition-colors"
                    }
                    onClick={() => setCurrentPage("applications")}
                >
                    Sollicitaties
                </button>

                <button
                    className={
                        currentPage === "interviews"
                            ? "font-bold text-white"
                            : "font-normal text-white/80 hover:text-white transition-colors"
                    }
                    onClick={() => setCurrentPage("interviews")}
                >
                    Interviews
                </button>
            </div>

            <div className="rounded-2xl bg-white/70 border border-gray-100 shadow-sm p-4 overflow-y-auto h-[calc(100vh-310px)] pb-20">
                {currentPage === "applications" && (
                    <HistoryVacancyComponent category={currentPage} />
                )}

                {currentPage === "interviews" && (
                    <HistoryInterviewComponent />
                )}
            </div>
        </section>
    );
}