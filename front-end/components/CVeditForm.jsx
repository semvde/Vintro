import {FaPhoneAlt, FaPlus, FaTrash} from "react-icons/fa"
import {IoIosMail} from "react-icons/io"
import {useState} from "react"
import {useNavigate} from "react-router"
import {FaUpload} from "react-icons/fa"

export function CVeditForm({data}) {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [errors, setErrors] = useState({
        name: "",
        phoneNumber: "",
        workExperience: "",
        educationLevel: "",
        skills: "",
        strengths: ""
    })

    const [formData, setFormData] = useState({
        Image: file,
        userId: data?.id || "",
        name: data?.name || "",
        email: data?.email || "",
        phoneNumber: data?.phoneNumber || "",
        workExperience: data?.workExperience || [],
        educationLevel: data?.educationLevel || [],
        skills: data?.skills || [],
        strengths: data?.strengths || []
    })

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

        if (name === "phoneNumber") {
            const regex = /^[0-9\s+-]*$/
            if (!regex.test(value)) {
                setErrors((prev) => ({...prev, phoneNumber: "Telefoonnummer mag alleen cijfers en spaties/plussen bevatten"}))
            } else {
                setErrors((prev) => ({...prev, phoneNumber: ""}))
            }
        }

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
            setErrors((prev) => ({...prev, workExperience: "Vul tenminste een bedrijf en een functie in"}))
            return
        }

        setErrors((prev) => ({...prev, workExperience: ""}))
        setFormData((prev) => ({
            ...prev,
            workExperience: [...prev.workExperience, newJob]
        }))

        setNewJob({company: "", period: "", job_title: "", description: ""})
    }

    const removeWorkExperience = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            workExperience: prev.workExperience.filter((_, index) => index !== indexToRemove)
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
            setErrors((prev) => ({...prev, educationLevel: "Vul tenminste een school en diploma in"}))
            return
        }

        setErrors((prev) => ({...prev, educationLevel: ""}))
        setFormData((prev) => ({
            ...prev,
            educationLevel: [...prev.educationLevel, newEducation]
        }))

        setNewEducation({school: "", degree: "", period: ""})
    }

    const removeEducation = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            educationLevel: prev.educationLevel.filter((_, index) => index !== indexToRemove)
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

        if (!formData.name.trim()) {
            alert("Naam is verplicht!")
            return
        }

        const submitData = new FormData()
        if (file) submitData.append("image", file)

        submitData.append("userId", formData.userId)
        submitData.append("name", formData.name)
        submitData.append("email", formData.email)
        submitData.append("phoneNumber", formData.phoneNumber)

        submitData.append("workExperience", JSON.stringify(formData.workExperience))
        submitData.append("educationLevel", JSON.stringify(formData.educationLevel))
        submitData.append("skills", JSON.stringify(formData.skills))
        submitData.append("strengths", JSON.stringify(formData.strengths))

        try {
            setLoading(true)

            const response = await fetch("http://127.0.0.1:8000/api/profile", {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: submitData
            })

            const resData = await response.json()
            if (response.ok) {
                console.log("Curriculum Vitae geüpdate!", resData)
                navigate("/app/cv")
            } else {
                alert("Upload mislukt: " + resData.message)
            }
        } catch (error) {
            console.error("Error met updaten:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleUpdate} className="p-4 space-y-4">

                <section className="flex items-center gap-4 bg-primary text-outline p-4 rounded-t-lg">
                    <div className="flex flex-col ">
                        <img src={data?.image || null} alt="" className="h-20 w-20"/>
                        <div className="flex flex-col items-center gap-4 p-6 rounded-xl max-w-5px mx-auto">
                            <input
                                type="file"
                                id="file-upload"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <label htmlFor="file-upload"
                                   className="flex flex-col items-start justify-start border-2 border-dashed border-gray-300 hover:border-blue-500 bg-white p-4 rounded-xl cursor-pointer w-5px transition-colors text-center group">
                                <FaUpload className="text-3xl text-gray-400 group-hover:text-blue-500 transition-colors mb-2"/>
                            </label>

                            {file && (
                                <div className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-md border border-green-200 max-w-5px w-5px text-center truncate">
                                    Geselecteerd: <span className="font-semibold">{file.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <input name="name"
                               className="focus:bg-white pl-2 pr-2 border-white border-solid border-2 focus:text-black focus:border-black text-white rounded-md"
                               onChange={handleInputChange} value={formData.name}/>
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}

                        <div className="flex gap-2 items-center mt-2">
                            <IoIosMail className="w-7 h-8"/>
                            <p className="text-sm">{data.email}</p>
                        </div>
                        <div className="flex gap-2 items-center mt-2">
                            <FaPhoneAlt className="pl-1 w-6 h-6"/>
                            <input name="phoneNumber"
                                   className="focus:bg-white pl-2 pr-2 border-white border-solid border-2 focus:text-black focus:border-black text-white rounded-md"
                                   onChange={handleInputChange} value={formData.phoneNumber}/>
                        </div>
                        {errors.phoneNumber && <p className="text-red-400 text-xs mt-1">{errors.phoneNumber}</p>}
                    </div>
                </section>

                <section className="py-4 text-sm">
                    <p>{data.summary}</p>
                    <div className="py-8">
                        <h2>Werkervaring</h2>
                        {formData.workExperience.map((job, index) => (
                            <div key={index}
                                 className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 mb-2 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-black">{job.job_title} bij {job.company}</p>
                                    <p className="text-xs text-gray-500">{job.period}</p>
                                    <p className="text-gray-700 mt-1">{job.description}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeWorkExperience(index)}
                                    className="text-red-500 hover:text-red-700 p-2"
                                >
                                    <FaTrash/>
                                </button>
                            </div>
                        ))}

                        <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50/50 space-y-3">
                            <h3 className="font-medium text-gray-700">Nieuwe werkervaring toevoegen</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input
                                    name="job_title"
                                    placeholder="Functie (bijv. Front-end developer)"
                                    className="p-2 border border-gray-300 rounded bg-white text-black"
                                    onChange={handleNewJobChange}
                                    value={newJob.job_title}
                                />
                                <input
                                    name="company"
                                    placeholder="Bedrijf (bijv. DPDK)"
                                    className="p-2 border border-gray-300 rounded bg-white text-black"
                                    onChange={handleNewJobChange}
                                    value={newJob.company}
                                />
                                <input
                                    name="period"
                                    placeholder="Periode (bijv. okt 2026 t/m feb 2027)"
                                    className="p-2 border border-gray-300 rounded bg-white text-black"
                                    onChange={handleNewJobChange}
                                    value={newJob.period}
                                />
                            </div>
                            <input
                                name="description"
                                placeholder="Beschrijving van je werkzaamheden..."
                                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                                onChange={handleNewJobChange}
                                value={newJob.description}
                            />

                            {errors.workExperience && <p className="text-red-500 text-xs">{errors.workExperience}</p>}

                            <button
                                type="button"
                                onClick={addWorkExperience}
                                className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded text-xs hover:bg-primary/50 cursor-pointer"
                            >
                                <FaPlus/>
                            </button>
                        </div>
                    </div>

                    <div className="py-2">
                        <h2>Educatie</h2>
                        {formData.educationLevel.map((education, index) => (
                            <div key={index}
                                 className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 mb-2 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-black">{education.school}</p>
                                    <p className="text-xs text-gray-500">{education.period}</p>
                                    <p className="text-gray-700 mt-1">{education.degree}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeEducation(index)}
                                    className="text-red-500 hover:text-red-700 p-2"
                                >
                                    <FaTrash/>
                                </button>
                            </div>
                        ))}

                        <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50/50 space-y-3">
                            <h3 className="font-medium text-gray-700">Nieuwe opleiding toevoegen</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input
                                    name="school"
                                    placeholder="School (bijv. Grafisch Lyceum)"
                                    className="p-2 border border-gray-300 rounded bg-white text-black"
                                    onChange={handleNewEducationChange}
                                    value={newEducation.school}
                                />
                                <input
                                    name="degree"
                                    placeholder="Diploma (bijv. MBO)"
                                    className="p-2 border border-gray-300 rounded bg-white text-black"
                                    onChange={handleNewEducationChange}
                                    value={newEducation.degree}
                                />
                                <input
                                    name="period"
                                    placeholder="Periode (bijv. okt 2026 t/m feb 2027)"
                                    className="p-2 border border-gray-300 rounded bg-white text-black"
                                    onChange={handleNewEducationChange}
                                    value={newEducation.period}
                                />
                            </div>

                            {errors.educationLevel && <p className="text-red-500 text-xs">{errors.educationLevel}</p>}

                            <button
                                type="button"
                                onClick={addEducation}
                                className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded text-xs hover:bg-primary/50 cursor-pointer"
                            >
                                <FaPlus/>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="bg-primary rounded-b-lg text-outline text-sm p-4">
                    <div className="flex justify-between">
                        <div>
                            <h3>Vaardigheden</h3>
                            <ul className="flex flex-col gap-2 py-2">
                                {formData.skills.map((skill, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 p-2 rounded-md list-none"
                                    >
                                        <span className="font-semibold text-black">{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                        >
                                            <FaTrash/>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col gap-1">
                                <input
                                    type="text"
                                    name="newSkill"
                                    placeholder="Voeg een vaardigheid toe"
                                    className="p-2 border border-gray-300 rounded bg-white text-black"
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    value={newSkill}
                                />
                                {errors.skills && <p className="text-red-400 text-xs">{errors.skills}</p>}
                            </div>

                            <button
                                type="button"
                                onClick={addSkill}
                                className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded text-xs hover:bg-primary/50 cursor-pointer mt-2"
                            >
                                <FaPlus/>
                            </button>
                        </div>
                        <div>
                            <h3>Sterke punten</h3>
                            <ul className="flex flex-col gap-2 py-2">
                                {formData.strengths.map((strength, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 p-2 rounded-md list-none"
                                    >
                                        <span className="font-semibold text-black">{strength}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeStrength(index)}
                                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                        >
                                            <FaTrash/>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col gap-1">
                                <input
                                    type="text"
                                    name="newStrength"
                                    placeholder="Voeg een sterktepunt toe"
                                    className="p-2 border border-gray-300 rounded bg-white text-black"
                                    onChange={(e) => setNewStrength(e.target.value)}
                                    value={newStrength}
                                />
                                {errors.strengths && <p className="text-red-400 text-xs">{errors.strengths}</p>}
                            </div>
                            <button
                                type="button"
                                onClick={addStrength}
                                className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded text-xs hover:bg-primary/50 cursor-pointer mt-2"
                            >
                                <FaPlus/>
                            </button>
                        </div>
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-4 py-2 mb-20 rounded hover:cursor-pointer hover:bg-primary/50"
                >
                    {loading ? "Updaten..." : "Curriculum Vitae bijwerken"}
                </button>
            </form>
        </div>
    )
}