import {FaPhoneAlt, FaPlus, FaTrash} from "react-icons/fa"
import {IoIosMail} from "react-icons/io"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router"
import {FaUpload} from "react-icons/fa"
import {fetchAPI} from "../services/Fetch.js";

export function CVeditForm({data}) {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [errors, setErrors] = useState({
        name: "",
        phone_number: "",
        work_experience: "",
        education_level: "",
        skills: "",
        strengths: ""
    })

    const formatToArray = (field) => {
        if (!field) return [];
        if (typeof field === "string") {
            try { return JSON.parse(field); } catch (e) { return []; }
        }
        return Array.isArray(field) ? field : [];
    };

    const [formData, setFormData] = useState({
        name: data?.profile?.name || "",
        work_experience: formatToArray(data?.profile?.work_experience),
        education_level: formatToArray(data?.profile?.education_level),
        skills: formatToArray(data?.profile?.skills),
        strengths: formatToArray(data?.profile?.strengths),

        email: data?.cv?.email || "",
        phone_number: data?.cv?.phone_number || ""
    });

    useEffect(() => {
        if (data) {
            console.log("Rauwe data gesplitst:", data);

            const profile = data.profile || {};
            const cv = data.cv || {};

            const formatToArray = (field) => {
                if (!field) return [];
                if (typeof field === "string") {
                    try {
                        const parsed = JSON.parse(field);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch (e) {
                        console.error("FormatToArray parser error:", e);
                        return [];
                    }
                }
                return Array.isArray(field) ? field : [];
            };

            setFormData({
                name: profile.name || "",
                work_experience: formatToArray(profile.work_experience),
                education_level: formatToArray(profile.education_level),
                skills: formatToArray(profile.skills),
                strengths: formatToArray(profile.strengths),

                email: cv.email || "",
                phone_number: cv.phone_number || ""
            });
        }
    }, [data]);

    const [newJob, setNewJob] = useState({
        company: "",
        period: "",
        job_title: "",
        description: ""
    })

    const [newEducation, setNewEducation] = useState({
        school: "",
        degree: "",
        period: ""
    })

    const [newSkill, setNewSkill] = useState("")
    const [newStrength, setNewStrength] = useState("")

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleInputChange = (event) => {
        const {name, value} = event.target

        if (name === "name") {
            if (value.trim() === "") {
                setErrors((prev) => ({...prev, name: "Naam is verplicht"}))
            } else {
                setErrors((prev) => ({...prev, name: ""}))
            }
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }

    // WORK EXPERIENCE //
    const handleNewJobChange = (event) => {
        const {name, value} = event.target
        setNewJob((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const addWorkExperience = () => {
        if (!newJob.company || !newJob.job_title) {
            setErrors((prev) => ({...prev, work_experience: "Vul tenminste een bedrijf en een functie in"}))
            return
        }

        setErrors((prev) => ({...prev, work_experience: ""}))
        setFormData((prev) => ({
            ...prev,
            work_experience: [...prev.work_experience, newJob]
        }))

        setNewJob({company: "", period: "", job_title: "", description: ""})
    }

    const removeWorkExperience = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            work_experience: prev.work_experience.filter((_, index) => index !== indexToRemove)
        }))
    }

    // EDUCATION //
    const handleNewEducationChange = (event) => {
        const {name, value} = event.target
        setNewEducation((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const addEducation = () => {
        if (!newEducation.school || !newEducation.degree) {
            setErrors((prev) => ({...prev, education_level: "Vul tenminste een school en diploma in"}))
            return
        }

        setErrors((prev) => ({...prev, education_level: ""}))
        setFormData((prev) => ({
            ...prev,
            education_level: [...prev.education_level, newEducation]
        }))

        setNewEducation({school: "", degree: "", period: ""})
    }

    const removeEducation = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            education_level: prev.education_level.filter((_, index) => index !== indexToRemove)
        }))
    }

    // SKILLS //
    const addSkill = () => {
        if (!newSkill.trim()) {
            setErrors((prev) => ({...prev, skills: "Typ eerst een vaardigheid"}))
            return
        }

        setErrors((prev) => ({...prev, skills: ""}))
        setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, newSkill.trim()]
        }))

        setNewSkill("")
    }

    const removeSkill = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, index) => index !== indexToRemove)
        }))
    }

    // STRENGTH //
    const addStrength = () => {
        if (!newStrength.trim()) {
            setErrors((prev) => ({...prev, strengths: "Typ eerst een sterk punt"}))
            return
        }

        setErrors((prev) => ({...prev, strengths: ""}))
        setFormData((prev) => ({
            ...prev,
            strengths: [...prev.strengths, newStrength.trim()]
        }))

        setNewStrength("")
    }

    const removeStrength = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            strengths: prev.strengths.filter((_, index) => index !== indexToRemove)
        }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        console.log("clicked!")

        if (!formData.name.trim()) {
            alert("Naam is verplicht!")
            return
        }

        try {
            setLoading(true)

            const payload = {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,

                work_experience: formData.work_experience,
                education_level: formData.education_level,
                skills: formData.skills,
                strengths: formData.strengths,
            }

            console.log("Dit sturen we naar de backend:", payload);

            const resData = await fetchAPI("/profile", "PUT", payload)
            console.log("De ontvangen data is:", resData);

            if (resData && resData.items && resData.items[0]?.error) {
                alert("Upload mislukt: " + resData.items[0].error)
            } else if (resData) {
                console.log("Curriculum Vitae geüpdate!", resData)
                navigate("/app/cv")
            } else {
                alert("Upload mislukt: Er ging iets mis aan de serverkant.")
            }
        } catch (error) {
            console.error("Error met updaten:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
            <form onSubmit={handleUpdate} className="py-4 space-y-6">

                <section className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-primary text-outline p-4 sm:p-6 rounded-t-lg">
                    <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                        <img src={data?.image || null} alt="" className="h-24 w-24 rounded-full object-cover bg-gray-200 border-2 border-white shadow-sm"/>
                        <div className="flex flex-col items-center gap-2 w-full">
                            <input
                                type="file"
                                id="file-upload"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <label htmlFor="file-upload"
                                   className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 bg-white p-2.5 rounded-xl cursor-pointer transition-colors text-center group w-12 h-12">
                                <FaUpload className="text-xl text-gray-400 group-hover:text-blue-500 transition-colors"/>
                            </label>

                            {file && (
                                <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md border border-green-200 text-center max-w-[150px] truncate">
                                    <span className="font-semibold">{file.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col w-full space-y-3 text-center md:text-left">
                        <div className="w-full">
                            <label className="text-xs text-gray-300 block mb-1">Volledige naam</label>
                            <input name="name"
                                   className="w-full focus:bg-white pl-3 pr-3 py-1.5 border-white border-solid border-2 focus:text-black focus:border-black text-white bg-transparent rounded-md text-base"
                                   onChange={handleInputChange} value={formData.name}/>
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center md:justify-start pt-1 text-sm">
                            <div className="flex gap-2 items-center justify-center md:justify-start">
                                <IoIosMail className="w-5 h-5 shrink-0"/>
                                <span className="break-all">{formData.email}</span>
                            </div>
                            <div className="flex gap-2 items-center justify-center md:justify-start w-full sm:w-auto">
                                <FaPhoneAlt className="w-4 h-4 shrink-0"/>
                                <input name="phone_number"
                                       placeholder="Telefoonnummer"
                                       className="w-full sm:w-44 focus:bg-white pl-2 pr-2 py-1 border-white border-solid border-2 focus:text-black focus:border-black text-white bg-transparent rounded-md"
                                       onChange={handleInputChange} value={formData.phone_number}/>
                            </div>
                        </div>
                        {errors.phone_number && <p className="text-red-400 text-xs text-center md:text-left">{errors.phone_number}</p>}
                    </div>
                </section>

                <section className="py-2 text-sm space-y-8">
                    <p className="text-gray-600 italic px-1">{data.summary}</p>

                    <div>
                        <h2 className="text-lg font-bold border-b border-gray-200 pb-1 mb-4">Werkervaring</h2>
                        <div className="space-y-3">
                            {formData.work_experience.map((job, index) => (
                                <div key={index}
                                     className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start gap-4">
                                    <div className="space-y-0.5">
                                        <p className="font-semibold text-black text-base">{job.job_title} <span className="font-normal text-gray-500 text-sm">bij {job.company}</span></p>
                                        <p className="text-xs text-gray-400">{job.period}</p>
                                        <p className="text-gray-700 text-sm mt-1.5 leading-relaxed">{job.description}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeWorkExperience(index)}
                                        className="text-red-500 hover:text-red-700 p-2 shrink-0 rounded hover:bg-red-50 transition-colors"
                                    >
                                        <FaTrash/>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50/50 space-y-3">
                            <h3 className="font-medium text-gray-700 text-sm">Nieuwe werkervaring toevoegen</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                <input
                                    name="job_title"
                                    placeholder="Functie (bijv. Front-end developer)"
                                    className="p-2.5 border border-gray-300 rounded-md bg-white text-black text-sm w-full"
                                    onChange={handleNewJobChange}
                                    value={newJob.job_title}
                                />
                                <input
                                    name="company"
                                    placeholder="Bedrijf (bijv. DPDK)"
                                    className="p-2.5 border border-gray-300 rounded-md bg-white text-black text-sm w-full"
                                    onChange={handleNewJobChange}
                                    value={newJob.company}
                                />
                                <input
                                    name="period"
                                    placeholder="Periode (bijv. 2024 - heden)"
                                    className="p-2.5 border border-gray-300 rounded-md bg-white text-black text-sm w-full sm:col-span-2 md:col-span-1"
                                    onChange={handleNewJobChange}
                                    value={newJob.period}
                                />
                            </div>
                            <input
                                name="description"
                                placeholder="Beschrijving van je werkzaamheden..."
                                className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-black text-sm"
                                onChange={handleNewJobChange}
                                value={newJob.description}
                            />

                            {errors.work_experience && <p className="text-red-500 text-xs">{errors.work_experience}</p>}

                            <button
                                type="button"
                                onClick={addWorkExperience}
                                className="flex items-center justify-center gap-2 bg-primary text-white w-10 h-10 rounded-md hover:bg-primary/80 transition-colors cursor-pointer"
                            >
                                <FaPlus/>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold border-b border-gray-200 pb-1 mb-4">Educatie</h2>
                        <div className="space-y-3">
                            {formData.education_level.map((education, index) => (
                                <div key={index}
                                     className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center gap-4">
                                    <div className="space-y-0.5">
                                        <p className="font-semibold text-black text-base">{education.school}</p>
                                        <p className="text-xs text-gray-400">{education.period}</p>
                                        <p className="text-gray-600 text-sm">{education.degree}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeEducation(index)}
                                        className="text-red-500 hover:text-red-700 p-2 shrink-0 rounded hover:bg-red-50 transition-colors"
                                    >
                                        <FaTrash/>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50/50 space-y-3">
                            <h3 className="font-medium text-gray-700 text-sm">Nieuwe opleiding toevoegen</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                <input
                                    name="school"
                                    placeholder="School (bijv. Grafisch Lyceum)"
                                    className="p-2.5 border border-gray-300 rounded-md bg-white text-black text-sm w-full"
                                    onChange={handleNewEducationChange}
                                    value={newEducation.school}
                                />
                                <input
                                    name="degree"
                                    placeholder="Diploma (bijv. MBO)"
                                    className="p-2.5 border border-gray-300 rounded-md bg-white text-black text-sm w-full"
                                    onChange={handleNewEducationChange}
                                    value={newEducation.degree}
                                />
                                <input
                                    name="period"
                                    placeholder="Periode (bijv. 2022 - 2026)"
                                    className="p-2.5 border border-gray-300 rounded-md bg-white text-black text-sm w-full sm:col-span-2 md:col-span-1"
                                    onChange={handleNewEducationChange}
                                    value={newEducation.period}
                                />
                            </div>

                            {errors.education_level && <p className="text-red-500 text-xs">{errors.education_level}</p>}

                            <button
                                type="button"
                                onClick={addEducation}
                                className="flex items-center justify-center gap-2 bg-primary text-white w-10 h-10 rounded-md hover:bg-primary/80 transition-colors cursor-pointer"
                            >
                                <FaPlus/>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="bg-primary rounded-b-lg text-outline text-sm p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-4 md:justify-between">

                        <div className="w-full md:w-[48%] flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-base border-b border-white/20 pb-1 mb-3">Vaardigheden</h3>
                                <ul className="flex flex-col gap-2 py-2 pl-0">
                                    {formData.skills.map((skill, index) => (
                                        <li key={index} className="flex justify-between items-center bg-white p-2.5 rounded-md list-none shadow-sm">
                                            <span className="font-semibold text-black">{skill}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(index)}
                                                className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                                            >
                                                <FaTrash size={14}/>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <input
                                    type="text"
                                    name="newSkill"
                                    placeholder="Voeg een vaardigheid toe"
                                    className="p-2.5 border border-gray-300 rounded-md bg-white text-black text-sm w-full"
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    value={newSkill}
                                />
                                {errors.skills && <p className="text-red-400 text-xs">{errors.skills}</p>}
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="flex items-center justify-center gap-2 bg-white/20 text-white w-10 h-10 rounded-md hover:bg-white/30 transition-colors cursor-pointer mt-1"
                                >
                                    <FaPlus/>
                                </button>
                            </div>
                        </div>

                        <div className="w-full md:w-[48%] flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-base border-b border-white/20 pb-1 mb-3">Sterke punten</h3>
                                <ul className="flex flex-col gap-2 py-2 pl-0">
                                    {formData.strengths.map((strength, index) => (
                                        <li key={index} className="flex justify-between items-center bg-white p-2.5 rounded-md list-none shadow-sm">
                                            <span className="font-semibold text-black">{strength}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeStrength(index)}
                                                className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                                            >
                                                <FaTrash size={14}/>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <input
                                    type="text"
                                    name="newStrength"
                                    placeholder="Voeg een sterktepunt toe"
                                    className="p-2.5 border border-gray-300 rounded-md bg-white text-black text-sm w-full"
                                    onChange={(e) => setNewStrength(e.target.value)}
                                    value={newStrength}
                                />
                                {errors.strengths && <p className="text-red-400 text-xs">{errors.strengths}</p>}
                                <button
                                    type="button"
                                    onClick={addStrength}
                                    className="flex items-center justify-center gap-2 bg-white/20 text-white w-10 h-10 rounded-md hover:bg-white/30 transition-colors cursor-pointer mt-1"
                                >
                                    <FaPlus/>
                                </button>
                            </div>
                        </div>

                    </div>
                </section>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-primary text-white font-medium px-6 py-3 mb-20 rounded-md shadow hover:bg-primary/80 transition-colors cursor-pointer disabled:opacity-50 text-base"
                    >
                        {loading ? "Updaten..." : "Curriculum Vitae bijwerken"}
                    </button>
                </div>
            </form>
        </div>
    )
}