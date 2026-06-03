export function CVPreview({ data }) {
    return (
        <div>
            <h1 className="font-bold">{data.name}</h1>

            <section className="mt-8">
                <h2 className="font-bold">Profiel</h2>
                <p>{data.summary}</p>
            </section>

            <section className="mt-8">
                <h2 className="font-bold">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill) => (
                        <span key={skill} className="rounded-lg">
                          {skill}
                        </span>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.strengths.map((s) => (
                        <span key={s}>{s}</span>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.interests.map((i) => (
                        <li key={i}>{i}</li>
                    ))}
                </div>
            </section>
        </div>
    );
}