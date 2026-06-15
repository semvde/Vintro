import Interviewer from "../src/assets/Interviewer.png";
import {FaMicrophone} from "react-icons/fa6";

export default function InterviewDetail() {
    return(
        <>
            <div className={"flex justify-around"}>
                <div className={"flex flex-col items-center justify-center gap-8"}>
                    <img src={Interviewer} alt={"Interviewer"} width={250}/>
                    <FaMicrophone size={80}/>
                </div>
            </div>
        </>
    )
}