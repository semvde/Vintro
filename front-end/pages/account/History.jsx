import {Link} from "react-router";
import {GoArrowLeft} from "react-icons/go";
import {useState} from "react";
import HistoryVacancyComponent from "../../components/HistoryVacancyComponent.jsx";

export function History() {
    const [currentPage, setCurrentPage] = useState("mail")


    return (
        <>
            <section className="max-w-100 max-h-200 space-y-10">
                <div className="flex justify-between flex-row">
                    <div className="shadow-md rounded-4xl bg-gray-100 max-w-fit max-h-fit p-2">
                        <Link to="/account">
                            <GoArrowLeft />
                        </Link>
                    </div>
                    <div>
                        <h2>Geschiedenis</h2>
                    </div>
                </div>

                <div className="bg-primary flex flex-row justify-between p-6">
                    <div className="space-x-3">
                        <button
                            className={currentPage === "mail" ? "font-bold" : "font-normal"}
                            onClick={() => setCurrentPage("mail")}
                        >
                            Mail inbox
                        </button>
                    </div>
                    <div className="space-x-3">
                        <button
                            className={currentPage === "transcriptie" ? "font-bold" : "font-normal"}
                            onClick={() => setCurrentPage("transcriptie")}
                        >
                            Transcriptie interviews
                        </button>
                    </div>
                </div>


                <div className="">
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