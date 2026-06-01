import React from "react";

export default function FormField({id, label, placeholder = "", icon, type = "text", ...props}) {
    return (
        <div className={"flex flex-col gap-2.5"}>
            <label htmlFor={id}>
                {label}
            </label>

            <div className={"flex"}>
                {icon && React.cloneElement(icon, {
                    className: "bg-body-light rounded-l-lg p-5",
                    size: 70,
                    color: "#408DD4"
                })}
                <input className={"grow bg-body-light placeholder-primary rounded-r-lg py-5"} type={type} id={id}
                       name={id}
                       placeholder={placeholder} {...props}/>
            </div>
        </div>
    );
}