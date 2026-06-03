import {Link} from "react-router";


export default function Account() {
    return (
        <>
            <section className="max-w-100 max-h-200 space-y-4 flex flex-col">
                <div className=" bg-primary/20 flex flex-row space-x-3 p-6">
                    <img alt="profiel foto" src="/front-end/public"/>
                    <h1>Vincent</h1>
                </div>

                <div className="flex flex-col gap-4">
                    <Link className="text-center text-primary h2 bg-primary/20 p-6" to="/edit-account">
                        Account bewerken
                    </Link>

                    <Link className="text-center text-secondary h2 bg-secondary/20 p-6" to="/history">
                        Geschiedenis
                    </Link>

                    <Link className="text-center text-primary h2 bg-primary/20 p-6" to="/">
                        Voorkeur/ AI policy
                    </Link>

                    <Link className="text-center text-secondary h2 bg-secondary/20 p-6" to="/">
                        Instellingen
                    </Link>
                </div>
            </section>
        </>
    )
}