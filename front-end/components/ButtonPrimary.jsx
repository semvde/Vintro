export default function ButtonPrimary({children, ...props}) {
    return (
        <button
            className={"bg-primary text-outline rounded-full cursor-pointer transition p-2.5 hover:bg-primary-hover"} {...props}>
            {children}
        </button>
    );
}