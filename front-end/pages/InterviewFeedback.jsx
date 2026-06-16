
import Victoria from "../src/assets/Victoria - Job coach.png";


export default function InterviewFeedback() {
    const feedback = {
        reaction: "happy",
        good_points: ["Je bent formeel geweest", "super leuk enthousiast"],
        improvement_points: ["Noem concretere voorbeelden van je vaardigheden", "Reageer meer inhoudelijk op vragen"],
        improved_example: "Sinds de vorige keer ben je veel enthousiaster geworden! Ga zo door!!!"
    };
    // const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const params = useParams();

    // useEffect(() => {
    //     const loadFeedback = async () => {
    //         try {
    //             const res = await fetchAPI(`/interview-feedback/${params.id}`, "GET");
    //             setData(res);
    //         } catch (err) {
    //             console.error(err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //
    //     loadFeedback();
    // }, []);
    //
    // if (loading) {
    //     return <p>Loading feedback...</p>;
    // }
    //
    // if (!data) {
    //     return <p>Geen feedback gevonden</p>;
    // }
    //
    // const feedback = data.data.ai_feedback;

    return (
        <>
            <div>
            <h1>Transcriptie</h1>
                <div className="flex flex-col">
                    <div className="flex justify-start">
                        <p className=" w-fit h-fit p-3">ai - text</p>
                    </div>
                    <div className="flex justify-end">
                        <p className=" w-fit h-fit p-3">text - you</p>
                    </div>
                </div>
            </div>

        <div className="p-4 max-w-2xl mx-auto pb-12 bg-secondary/20">
            <div className={"flex justify-center"}>
                <img src={Victoria} alt={"Victoria"} width={200}/>
            </div>
            <p className={"font-bold italic pb-6"}>~{feedback.reaction}~</p>

            <h2>Wat gaat al goed?</h2>
            <ul className={"list-disc list-inside"}>
                {feedback.good_points.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>

            <h2 className="font-semibold mt-4 pt-6">Verbeterpunten</h2>
            <ul className={"list-disc list-inside"}>
                {feedback.improvement_points.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>

            <h2 className="font-semibold mt-4 pt-6">Voorbeeld</h2>
            <p className="whitespace-pre-line">
                {feedback.improved_example}
            </p>
        </div>
        </>
    );
}