import {Link} from "react-router";
import {GoArrowLeft} from "react-icons/go";

export default function Editaccount() {
    return (
        <>
            <section className="max-w-100 max-h-200 space-y-10">
                <div className="shadow-md rounded-4xl bg-gray-100 max-w-fit max-h-fit p-2">
                    <Link to="/account">
                        <GoArrowLeft/>
                    </Link>
                </div>
                <div className="bg-primary/20 pb-10 ">
                    <div className=" bg-primary/20 flex flex-row space-x-3 p-6">
                        <img alt="profiel foto" src="/front-end/public"/>
                        <h2>Vincent</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-primary/20 p-6 flex justify-between flex-row">
                            <label className="h2 text-primary">
                                Naam
                            </label>
                            <input className="pl-2 w-3/5 bg-white"/>
                        </div>

                        <div className="bg-secondary/20 p-6 flex justify-between flex-row">
                            <label className="h2 text-secondary">
                                E-mail
                            </label>
                            <input className="pl-2 w-3/5 bg-white"/>
                        </div>

                        <div className="bg-primary/20 p-6 flex justify-between flex-row">
                            <label className="h2 text-primary">
                                Wachtwoord
                            </label>
                            <input className="pl-2 w-3/5 bg-white"/>
                        </div>
                        <div className="flex justify-center rounded-3xl pt-7 items-center">
                            <Link className="text-white bg-primary h2 w-fit h-fit p-4" to="/account">
                                Aanpassen
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}