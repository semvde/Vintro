import {Link} from "react-router";
import VintroLogo from "../src/assets/vintro_logo-03.png";
export default function TopNavigation() {
    return (
        <>
            <div className="bg-primary w-full h-100px flex justify-between items-center text-outline flex-row">
                <img src={VintroLogo} alt="Logo" width={60} height={60}/>
                <div className={"mr-4"}>
                    <Link to={"/register"} className={"mr-8"}>
                        Registreer
                    </Link>
                    <Link to={"/login"}>
                        Log in
                    </Link>
                </div>
            </div>
        </>
    )
}