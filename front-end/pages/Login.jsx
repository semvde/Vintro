import {Link, useNavigate} from "react-router";
import FormField from "../components/FormField.jsx";
import {useState} from "react";
import {MdOutlineMail} from "react-icons/md";
import {FaLock} from "react-icons/fa6";
import ButtonPrimary from "../components/ButtonPrimary.jsx";
import {fetchAPI} from "../services/Fetch.js";

export default function Login() {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const [form, setForm] = useState({
        email: "",
        password: ""
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

        const response = await fetchAPI('/login', 'POST', {
            email: form.email,
            password: form.password
        });

        if (response.message === "Invalid credentials") {
            setErrorMessage(response.message);
            return;
        }

        const token = response.token;

        localStorage.setItem("token", token);

        navigate('/app');
    };

    return (
        <>
            <section>
                <h1>Welkom <span className={"text-primary"}>terug!</span></h1>
                <span>Log in om (verder) te oefenen met het solliciteerproces!</span>
            </section>
            <section className={"py-10"}>
                <form onSubmit={handleSubmit} className={"flex flex-col gap-5"}>
                    <FormField id={"email"} label={<h2>E-mail</h2>} type={"email"} placeholder={"jouw@email.nl"}
                               icon={<MdOutlineMail/>}
                               value={form.email}
                               required
                               onChange={handleInputChange}/>
                    <FormField id={"password"} label={<h2>Wachtwoord</h2>} type={"password"} placeholder={"*********"}
                               icon={<FaLock/>}
                               value={form.password}
                               required
                               onChange={handleInputChange}/>
                    <ButtonPrimary>Inloggen</ButtonPrimary>
                    {errorMessage && <span className={"text-(--color-error)"}>{errorMessage}</span>}
                    <p className={"text-center"}>Nog geen account? <Link to={"/register"}
                                                                         className={"text-primary cursor-pointer hover:text-primary-hover"}>Maak
                        er eentje!</Link>
                    </p>
                </form>
            </section>
        </>
    );
}