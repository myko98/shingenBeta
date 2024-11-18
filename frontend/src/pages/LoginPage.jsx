import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

const LoginPage = ({ setIsAdmin }) => {
	const {
		register,
		handleSubmit
	} = useForm()

	// Navigate to another page
	const navigate = useNavigate()

	const onSubmit = async (data) => {
		const formData = new FormData()

		formData.append("username", data["username"])
		formData.append("password", data["password"])

		const response = await fetch("http://127.0.0.1:5000/login", {
			method: "POST",
			body: formData
		})

		const result_token = await response.json();

		if (response.ok) {
			setIsAdmin(true)
			localStorage.setItem("token", result_token.token)
			alert("Login Successful")
			navigate("/catalog")
		} else {
			alert("Invalid Credentials")
		}
	}

	return (
		<form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
			<div className="mb-3">
				<label htmlFor="username">Username</label>
				<input type="text" className="form-control" name="username" id="username" {...register("username", { required: true })} />
			</div>
			<div className="mb-3">
				<label htmlFor="password">Password</label>
				<input type="password" className="form-control" name="password" id="password"
					{...register("password", { required: true })} />
			</div>
			<button type="submit" className="btn btn-primary">Login</button>
		</form>
	)
}

export default LoginPage