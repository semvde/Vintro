import Victoria from "../src/assets/Victoria - Job coach.png";
export default function ChatMessage({ role, content }) {
    const isUser = role === "user";

    return(
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
            {/* AI avatar */}
            {!isUser && (
                <img src={Victoria} width={"80px"} alt="Job coach Victoria" className="rounded-full mr-2 mt-1 shrink-0 w-20 h-20 object-cover"/>
            )}

            <div className={`max-w-[60%] px-4 py-2 rounded-lg text-sm text-outline ${isUser ? "bg-primary" : "bg-secondary"}`}>
                {content}
            </div>
        </div>
    )
}