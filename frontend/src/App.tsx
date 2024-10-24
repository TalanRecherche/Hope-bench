import './App.scss'
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

function App() {
	return (
		<>
			<NavBar />
			<div className="custom-bg">
				<Outlet />
			</div>
		</>
	)
}

export default App
