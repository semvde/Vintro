import {Link} from "react-router";

export default function Account() {
    return (
        <>
            <section
                className="max-w-100 md:max-w-4xl mx-auto max-h-200 space-y-4 md:space-y-0 flex flex-col md:flex-row md:gap-6 md:p-6">
                <div
                    className="bg-primary/20 flex flex-row md:flex-col items-center space-x-3 md:space-x-0 md:space-y-4 p-6 md:w-1/3 md:justify-center md:rounded-lg">
                    <img alt="profiel foto" src="/front-end/public"/>
                    <h1>Vincent</h1>
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