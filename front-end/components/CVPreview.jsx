export function CVPreview({ data }) {
    return (
        <div>
            <section className={"flex items-center gap-4 bg-primary text-outline p-4 rounded-t-lg"}>
                <img src={data.image} alt={""} className={"h-20 w-20"} />
                <div className={"flex flex-col"}>
                    <h2>{data.name}</h2>
                    <p>[Email]</p>
                    <p>[Nummer]</p>
                </div>
            </section>

            <section>
                <p className={"text-sm py-4"}>{data.summary}</p>
                <h2>Skills</h2>
                <div>
                    <div className={"flex gap-4 py-2"}>
                        {data.skills.map((skill) => (
                            <span key={skill} className={"bg-primary py-2 px-4 rounded-lg text-outline"}>
                              {skill}
                            </span>
                        ))}
                    </div>
                    <h2>Strengths</h2>
                    <div className={"flex flex-col py-2"}>
                        {data.strengths.map((s) => (
                            <span key={s}>{s}</span>
                        ))}
                    </div>
                    <h2>Interests</h2>
                    <div className={"flex flex-col py-2"}>
                        {data.interests.map((i) => (
                            <span key={i}>{i}</span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}