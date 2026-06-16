import { Link } from "react-router";

export default function HistoryInterviewComponent() {
    const interviews = [];

    if (interviews.length === 0) {
        return (
            <p className="text-gray-600">
                Je hebt nog geen interviewfeedback.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {interviews.map((interview) => (
                <Link
                    key={interview.id}
                    to={`/app/history/interview-feedback/${interview.id}`}
                    className="block max-w-md rounded-lg bg-primary/10 p-4 shadow-sm transition-colors duration-300 ease-in-out hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <article className="bg-primary/10 p-4 text-gray-800">
                        <div className="flex flex-col items-start pb-6">
                            <h3 className="text-primary font-bold">
                                {interview.title ?? "Interview"}
                            </h3>
                            <p className="font-semibold">
                                {interview.company ?? "Onbekend bedrijf"}
                            </p>
                            <p>
                                {interview.type ?? "Oefengesprek"}
                            </p>
                        </div>

                        <div className="flex flex-row justify-between gap-4">
                            <span className="font-semibold text-orange-900">
                                Feedback beschikbaar
                            </span>

                            <time dateTime={interview.created_at}>
                                {interview.created_at
                                    ? new Date(interview.created_at).toLocaleDateString("nl-NL")
                                    : "Nog geen datum"}
                            </time>
                        </div>
                    </article>
                </Link>
            ))}
        </div>
    );
}