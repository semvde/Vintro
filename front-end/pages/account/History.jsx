import {Link} from "react-router";
import {GoArrowLeft} from "react-icons/go";
import {useState} from "react";
import HistoryVacancyComponent from "../../components/HistoryVacancyComponent.jsx";

export function History() {
    const [currentPage, setCurrentPage] = useState("mail")

    return (
        <>
            <section className="max-w-100 md:max-w-4xl mx-auto max-h-200 space-y-10 md:p-6">
                <div className="flex justify-between flex-row items-center">
                    <div className="shadow-md rounded-4xl bg-gray-100 max-w-fit max-h-fit p-2">
                        <Link to="/account">
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
                            className={currentPage === "mail" ? "font-bold text-white" : "font-normal text-white/80 hover:text-white transition-colors"}
                            onClick={() => setCurrentPage("mail")}
                        >
                            Mail inbox
                        </button>
                    </div>
                    <div className="space-x-3">
                        <button
                            className={currentPage === "transcriptie" ? "font-bold text-white" : "font-normal text-white/80 hover:text-white transition-colors"}
                            onClick={() => setCurrentPage("transcriptie")}
                        >
                            Transcriptie interviews
                        </button>
                    </div>
                </div>

                <div className="md:px-2">
                    {currentPage === "mail" && (
                        <HistoryVacancyComponent category={currentPage} />
                    )}

                    {currentPage === "transcriptie" && (
                        <HistoryVacancyComponent category={currentPage}/>
                    )}
                </div>
            </section>
        </>
    )
}