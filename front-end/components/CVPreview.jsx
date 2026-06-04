import {FaPhoneAlt} from "react-icons/fa";
import {IoIosMail} from "react-icons/io";

export function CVPreview({ data }) {
    return (
        <div>
            <section className={"flex items-center gap-4 bg-primary text-outline p-4 rounded-t-lg"}>
                <img src={data.image} alt={""} className={"h-20 w-20"} />
                <div className={"flex flex-col"}>
                    <h1>{data.name}</h1>
                    <div className={"flex gap-2 items-center"}>
                        <IoIosMail />
                        <p className={"text-sm"}>{data.email}</p>
                    </div>
                    <div className={"flex gap-2 items-center"}>
                        <FaPhoneAlt />
                        <p className={"text-sm"}>{data.phoneNumber}</p>
                    </div>
                </div>
            </section>
            <section className={"py-4 text-sm"}>
                <h2></h2>
                <p>{data.summary}</p>
                <div className={"py-8"}>
                    <h2>Werkervaring</h2>
                        {data.workExperience?.map((job, index) => (
                            <div key={index} className={"py-2"}>
                                <div className={"flex justify-between items-center py-2"}>
                                    <h3>{job.company}</h3>
                                    <p className={"text-xs font-light text-nowrap"}>{job.period}</p>
                                </div>
                                <p>{job.description}</p>
                            </div>
                        ))}
                </div>
                <div className={"py-2"}>
                    <h2>Educatie</h2>
                     {data.educationLevel?.map((education, index) => (
                            <div key={index} className={"py-2"}>
                                <div className={"flex justify-between items-center py-2"}>
                                    <h3>{education.school}</h3>
                                    <p className={"text-xs font-light text-nowrap"}>{education.period}</p>
                                </div>
                                <p>{education.degree}</p>
                            </div>
                        ))}
                </div>
            </section>

            <section className={"bg-primary rounded-b-lg text-outline text-sm p-4"}>
                <div className={"flex justify-between"}>
                    <div>
                        <h3>Vaardigheden</h3>
                        <ul className={"flex flex-col list-disc list-inside gap-2 py-2"}>
                            {data.skills.map((skill) => (
                                <li key={skill}>
                              {skill}
                            </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Sterke punten</h3>
                        <ul className={"flex flex-col list-disc list-inside gap-2 py-2"}>
                            {data.strengths.map((s) => (
                                <li key={s}>{s}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}