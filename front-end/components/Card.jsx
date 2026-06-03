export default function Card(props) {
    return(
        <div className={"bg-body-light rounded-lg my-4 mx-1"}>
            {props.children}
        </div>
    )
}
