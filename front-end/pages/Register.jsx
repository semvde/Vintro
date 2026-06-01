import {useNavigate} from "react-router";
import FormField from "../components/FormField.jsx";
import {useState} from "react";
import {MdOutlineMail} from "react-icons/md";
import {FaLock} from "react-icons/fa6";
import ButtonPrimary from "../components/ButtonPrimary.jsx";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
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

    function handleSubmit(e) {
        e.preventDefault();

        navigate('/login');
    }

    return (
        <>
            <section>
                <h1>Welkom!</h1>
                <span>Maak hier jouw account aan en begin direct met oefenen!</span>
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
                    <FormField id={"password_confirm"} label={<h2>Wachtwoord herhalen</h2>} type={"password"}
                               placeholder={"*********"}
                               icon={<FaLock/>}
                               value={form.password_confirm}
                               required
                               onChange={handleInputChange}/>
                    <ButtonPrimary>Registreren</ButtonPrimary>
                    <p className={"text-center"}>Al een account? <span
                        className={"text-primary cursor-pointer hover:text-primary-hover"}>Login</span></p>
                </form>
            </section>
        </>
    );
}