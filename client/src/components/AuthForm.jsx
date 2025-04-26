import Login from "./Login"
import Register from "./Register"

const AuthForm = () => {
    //TODO: handle cookies
    let temp = true; //temp variable to only display one of the two forms at once
    //TODO: missing an option to switch between the two ("no account? register here? already have an account? log in here")

    return (
        <div>
            { temp ? <Login /> : <Register /> }
        </div>
    )
}

export default AuthForm;
