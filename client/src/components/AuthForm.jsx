import Login from "./Login"
import Register from "./Register"

const AuthForm = () => {

    //TODO: missing an option to switch between the two ("no account? register here? already have an account? log in here")
    const temp = false;
    return (
        <div>
            { temp ? <Login /> : <Register /> }
        </div>
    )
}

export default AuthForm;
