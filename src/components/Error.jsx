import { useRouteError } from "react-router-dom"


const Error = () => {
    const err = useRouteError()
    return(
        <div>
            <h2>Oops!!!</h2>
            <h2>Something went wrong!!</h2>
            <h3>{err.status}</h3>
            <h3>{err.statusText}</h3>
        </div>
    )
}

export default Error