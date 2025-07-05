import './utils/fonts.css'
import CatalogPage from "./pages/CatalogPage"
import HomePage from "./pages/HomePage"
import styles from "./App.module.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from "./components/navbar/Navbar.jsx"

function App() {
	return (
		<div className={styles.appContainer}>
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/catalog" element={<CatalogPage />} />
				</Routes>
			</Router>
		</div>
	)
}

export default App
