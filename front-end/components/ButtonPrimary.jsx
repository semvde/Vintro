export default function ButtonPrimary({children, style, ...props}) {
    return (
        <button
            className={"bg-primary text-outline rounded-full cursor-pointer transition p-2.5 hover:bg-primary-hover " + style} {...props}>
            {children}
        </button>
    );
}