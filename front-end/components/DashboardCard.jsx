import Card from "./Card.jsx";
import React from "react";

export default function DashboardCard({icon, title, description}) {
    return(
        <Card>
            <div className={"flex justify-start gap-8 items-center p-2"}>
                <div>{icon && React.cloneElement(icon, {
                    size: 60
                })}</div>
                <div>
                    <h2 className={"text-primary"}>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
        </Card>
    )
}