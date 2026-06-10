import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import {GoArrowLeft} from "react-icons/go";
import {fetchAPI} from "../../services/Fetch.js";

export default function EditAccount() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        naam: "",
        email: "",

    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));

        if (errors[name]) {
            setErrors((prev) => ({...prev, [name]: ""}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.naam) {
            newErrors.naam = "Naam is verplicht.";
        }
        if (!formData.email) {
            newErrors.email = "E-mailadres is verplicht.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            try {
                setLoading(true)

                const payload = {
                    name: formData.name,
                    email: formData.email,
                }

                console.log("Dit sturen we naar de backend:", payload);

                const resData = await fetchAPI("/profile", "PUT", payload)
                console.log("De ontvangen data is:", resData);

                if (resData && resData.items && resData.items[0]?.error) {
                    alert("Upload mislukt: " + resData.items[0].error)
                } else if (resData) {
                    console.log("Account geupdate!", resData)
                    navigate("/app/account")
                } else {
                    alert("Upload mislukt: Er ging iets mis aan de serverkant.")
                }
            } catch
                (error) {
                console.error("Error met updaten:", error)
            } finally {
                setLoading(false)
            }

        }
    };

    useEffect(() => {
        async function getAccountData() {
            try {
                const response = await fetchAPI("/profile");

                if (response && response.data) {
                    const profile = response.data.profile || {};
                    const cv = response.data.cv || {};

                    setFormData({
                        name: profile.name || "",
                        email: cv.email || "",
                        phone_number: cv.phone_number || ""
                    });
                }
            } catch (error) {
                console.error("Account data laden mislukt:", error);
            } finally {
                setLoading(false);
            }
        }

        getAccountData();
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-100 md:max-w-4xl mx-auto max-h-200 space-y-10 md:p-6">
                <div className="shadow-md rounded-4xl bg-gray-100 max-w-fit max-h-fit p-2">
                    <Link to="/app/account">
                        <GoArrowLeft/>
                    </Link>
                </div>
                <div className="bg-primary/20 pb-10 md:rounded-lg md:flex md:flex-row md:pb-0 md:items-stretch">
                    <div
                        className="bg-primary/20 flex flex-row md:flex-col items-center space-x-3 md:space-x-0 md:space-y-4 p-6 md:w-1/3 md:justify-center md:rounded-l-lg">
                        <img alt="profiel foto" src="/front-end/public"/>
                        <h2>{formData.name || "Gebruiker"}</h2>
                    </div>

                    <div className="flex flex-col gap-4 md:w-2/3 md:p-6">

                        <div className="bg-primary/20 p-6 flex flex-col gap-2 md:rounded-lg">
                            <div className="flex justify-between flex-row items-center">
                                <label className="h2 text-primary">Naam</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`pl-2 w-3/5 bg-white md:max-w-md h-10 rounded ${errors.naam ? 'border-2 border-red-500' : ''}`}
                                />
                            </div>
                            {errors.naam &&
                                <span className="text-red-600 text-sm font-medium text-right pr-2">{errors.naam}</span>}
                        </div>

                        <div className="bg-secondary/20 p-6 flex flex-col gap-2 md:rounded-lg">
                            <div className="flex justify-between flex-row items-center">
                                <label className="h2 text-secondary">E-mail</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`pl-2 w-3/5 bg-white md:max-w-md h-10 rounded ${errors.email ? 'border-2 border-red-500' : ''}`}
                                />
                            </div>
                            {errors.email &&
                                <span
                                    className="text-red-600 text-sm font-medium text-right pr-2">{errors.email}</span>}
                        </div>


                        <div className="bg-primary/20 hover:bg-primary/50 p-6 flex flex-col gap-2 md:rounded-lg">
                            <div className="flex justify-between flex-row items-center">
                                <button className="hover:cursor-pointer">Wijzig wachtwoord</button>
                            </div>
                            {/*    <label className="h2 text-primary">Wachtwoord</label>*/}
                            {/*    <input*/}
                            {/*        name="wachtwoord"*/}
                            {/*        type="password"*/}
                            {/*        value={formData.wachtwoord}*/}
                            {/*        onChange={handleChange}*/}
                            {/*        className={`pl-2 w-3/5 bg-white md:max-w-md h-10 rounded ${errors.wachtwoord ? 'border-2 border-red-500' : ''}`}*/}
                            {/*    />*/}
                            {/*</div>*/}
                            {/*{errors.wachtwoord && <span*/}
                            {/*    className="text-red-600 text-sm font-medium text-right pr-2">{errors.wachtwoord}</span>}*/}
                        </div>


                        <div className="flex justify-center rounded-3xl pt-7 items-center md:justify-end md:pt-4">
                            <button
                                onClick={handleSubmit}
                                type="submit"
                                className="text-white bg-primary h2 w-fit h-fit p-4 md:rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                Aanpassen
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}