import {Link} from "react-router";
import {GoArrowLeft} from "react-icons/go";

export function Preferences() {
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
                        <h2>Voorkeuren</h2>
                    </div>
                </div>
                <p className="md:px-2">Er moet hier iets komen?</p>
            </section>
        </>
    )
}