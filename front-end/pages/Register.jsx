import {Link, useNavigate} from "react-router";
import FormField from "../components/FormField.jsx";
import {useState} from "react";
import {MdOutlineMail} from "react-icons/md";
import {FaLock} from "react-icons/fa6";
import {FaUser} from "react-icons/fa";
import ButtonPrimary from "../components/ButtonPrimary.jsx";
import {fetchAPI} from "../services/Fetch.js";

export default function Register() {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirm: ""
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.password_confirm) {
            setErrorMessage(prev => ({
                ...prev,
                password: 'Password fields don\'t match'
            }));
            return;
        }

        const response = await fetchAPI('/register', 'POST', {
            name: form.name,
            email: form.email,
            password: form.password
        });

        if (!response.ok) {
            setErrorMessage(response.errors);
            return;
        }

        const token = response.token;

        localStorage.setItem("token", token);

        navigate('/app');
    };

    return (
        <>
            <section>
                <h1>Welkom!</h1>
                <span>Maak hier jouw account aan en begin direct met oefenen!</span>
            </section>
            <section className={"py-10"}>
                <form onSubmit={handleSubmit} className={"flex flex-col gap-5"}>
                    <FormField id={"name"} label={<h2>Voornaam</h2>}
                               placeholder={"Bijv. Vincent"} icon={<FaUser/>}
                               value={form.name} required
                               onChange={handleInputChange}/>
                    {errorMessage.name && <span className={"text-(--color-error)"}>{errorMessage.name}</span>}
                    <FormField id={"email"} label={<h2>E-mail</h2>} type={"email"} placeholder={"jouw@email.nl"}
                               icon={<MdOutlineMail/>}
                               value={form.email} required
                               onChange={handleInputChange}/>
                    {errorMessage.email && <span className={"text-(--color-error)"}>{errorMessage.email}</span>}
                    <FormField id={"password"} label={<h2>Wachtwoord</h2>} type={"password"} placeholder={"*********"}
                               icon={<FaLock/>}
                               value={form.password} required
                               onChange={handleInputChange}/>
                    <FormField id={"password_confirm"} label={<h2>Wachtwoord herhalen</h2>} type={"password"}
                               placeholder={"*********"}
                               icon={<FaLock/>}
                               value={form.password_confirm} required
                               onChange={handleInputChange}/>
                    {errorMessage.password && <span className={"text-(--color-error)"}>{errorMessage.password}</span>}
                    <ButtonPrimary>Registreren</ButtonPrimary>
                    <p className={"text-center"}>Al een account? <Link to={"/login"}
                                                                       className={"text-primary cursor-pointer hover:text-primary-hover"}>Login</Link>
                    </p>
                </form>
            </section>
        </>
    );
}