import Card from "./Card.jsx";

export default function VideoCard({thumbnail, title, tag}) {
    return(
        <Card>
            <div className="flex flex-col gap-4 w-48">
                <img src={thumbnail} alt={title} className={"aspect-video object-cover"}/>
                <div className={"p-2"}>
                    <h3>{title}</h3>
                    <p className={"bg-secondary p-2 my-2 rounded-lg inline-block text-xs text-outline"}>{tag}</p>
                </div>
            </div>
        </Card>
    );
}