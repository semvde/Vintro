export default function ButtonPrimary({children, style, ...props}) {
    return (
        <button
            className={"bg-primary text-outline rounded-full cursor-pointer transition p-2.5 hover:bg-primary-hover" +
                "focus-visible:outline-none" +
                "focus-visible:ring-8" +
                "focus-visible:ring-secondary" +
                "focus-visible:ring-offset-2"
                + style} {...props}
        >
            {children}
        </button>
    );
}