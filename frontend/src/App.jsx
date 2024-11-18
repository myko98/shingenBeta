import { useState, useEffect } from "react"
import CatalogPage from "./pages/CatalogPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage.jsx"
import styles from "./App.module.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from "./components/navbar/Navbar.jsx"

function App() {
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		setIsAdmin(localStorage.getItem("token"))
	}, [])

	return (
		<div className={styles.appContainer}>
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/catalog" element={<CatalogPage isAdmin={isAdmin} />} />
					<Route path="/aas821JALbdIO912LPqq" element={<LoginPage setIsAdmin={setIsAdmin} />} />
				</Routes>
			</Router>
		</div>
	)
}

export default App
