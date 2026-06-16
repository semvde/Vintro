import { Link } from "react-router";
import { GoArrowLeft } from "react-icons/go";
import { useState } from "react";
import HistoryVacancyComponent from "../../components/HistoryVacancyComponent.jsx";
import HistoryInterviewComponent from "../../components/HistoryInterviewComponent.jsx";

export function History() {
    const [currentPage, setCurrentPage] = useState("applications");

    return (
        <section className="max-w-100 md:max-w-4xl mx-auto max-h-200 space-y-10 md:p-6">
            <div className="flex justify-between flex-row items-center">
                <div className="shadow-md rounded-4xl bg-gray-100 max-w-fit max-h-fit p-2">
                    <Link to="/app/account" aria-label="Terug naar account">
                        <GoArrowLeft />
                    </Link>
                </div>

                <div>
                    <h2>Geschiedenis</h2>
                </div>
            </div>

            <div className="bg-primary flex flex-row justify-between p-6 md:rounded-lg md:justify-start md:space-x-12">
                <div className="space-x-3">
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
                </div>

                <div className="space-x-3">
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
            </div>

            <div className="md:px-2">
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