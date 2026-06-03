import {Link} from "react-router";
import {GoArrowLeft} from "react-icons/go";

export default function Editaccount() {
    return (
        <>
            <section className="max-w-100 md:max-w-4xl mx-auto max-h-200 space-y-10 md:p-6">
                <div className="shadow-md rounded-4xl bg-gray-100 max-w-fit max-h-fit p-2">
                    <Link to="/account">
                        <GoArrowLeft/>
                    </Link>
                </div>
                <div className="bg-primary/20 pb-10 md:rounded-lg md:flex md:flex-row md:pb-0 md:items-stretch">
                    <div className="bg-primary/20 flex flex-row md:flex-col items-center space-x-3 md:space-x-0 md:space-y-4 p-6 md:w-1/3 md:justify-center md:rounded-l-lg">
                        <img alt="profiel foto" src="/front-end/public"/>
                        <h2>Vincent</h2>
                    </div>

                    <div className="flex flex-col gap-4 md:w-2/3 md:p-6">
                        <div className="bg-primary/20 p-6 flex justify-between flex-row md:rounded-lg">
                            <label className="h2 text-primary">
                                Naam
                            </label>
                            <input className="pl-2 w-3/5 bg-white md:max-w-md"/>
                        </div>

                        <div className="bg-secondary/20 p-6 flex justify-between flex-row md:rounded-lg">
                            <label className="h2 text-secondary">
                                E-mail
                            </label>
                            <input className="pl-2 w-3/5 bg-white md:max-w-md"/>
                        </div>

                        <div className="bg-primary/20 p-6 flex justify-between flex-row md:rounded-lg">
                            <label className="h2 text-primary">
                                Wachtwoord
                            </label>
                            <input className="pl-2 w-3/5 bg-white md:max-w-md"/>
                        </div>
                        <div className="flex justify-center rounded-3xl pt-7 items-center md:justify-end md:pt-4">
                            <Link className="text-white bg-primary h2 w-fit h-fit p-4 md:rounded-lg" to="/account">
                                Aanpassen
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}