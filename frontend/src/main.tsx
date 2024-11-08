import * as React from "react";
import { useContext, useState, useEffect } from "react";
import * as ReactDOM from 'react-dom/client'

import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ReactNotifications } from 'react-notifications-component'

import { ApiProvider, ApiContext } from "./contexts/ApiContext";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";

import 'react-notifications-component/dist/theme.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import './styles/index.scss'
// import BusinessPropositionAnnotationForm from "././pages/BusinessPropositionAnnotationForm.tsx";

import App from "./App";
import DashBoard from "./pages/DashBoard";
import SimulationForm from "./pages/Form/SimulationForm.tsx";
import GeneralTab from "./pages/Form/GeneralTab.tsx";
import MovementTab from "./pages/Form/MovementTab.tsx";
import DigitalTab from "./pages/Form/DigitalTab.tsx";
import OfficeTab from "./pages/Form/OfficeTab.tsx";



const RouterContext = () => {
    const { user } = useContext(AuthContext)

    const { getFullNameUser } = useContext(ApiContext);

    // Initialize author with a default value
    const [, setAuthor] = useState('Loading...'); // or use null or another placeholder

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const fullName = await getFullNameUser(user.id); // Get the full name asynchronously
                setAuthor(fullName); // Set the author once the Promise resolves
            } catch (error) {
                console.error("Failed to fetch full name:", error);
                setAuthor('Error fetching author'); // Set a fallback if there's an error
            }
        };

        if (user?.id) {
            fetchAuthor(); // Call the fetch function only if user ID is defined
        }
    }, [user]);

    const managerRoutes = user.roles.includes('manager') ? [] : []


    const router = createBrowserRouter([{
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: "dashboard", element: <DashBoard /> },
            // { path: "business-proposition-annotation/:businessPropositionAnnotationId", element: <BusinessPropositionAnnotationForm /> },
            {
                path: "form", element: <SimulationForm />,
                children: [
                    { index: true, element: <Navigate to="/form/generalTab" replace /> },
                    { path: "generalTab", element: <GeneralTab /> },
                    { path: "movementTab", element: <MovementTab /> },
                    { path: "digitalTab", element: <DigitalTab /> },
                    { path: "officeTab", element: <OfficeTab /> },
                ]
            },
            ...managerRoutes
        ],
    },
    ]);
    return <RouterProvider router={router} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ReactNotifications />
        <AuthProvider>
            <ApiProvider>
                <RouterContext />
            </ApiProvider>
        </AuthProvider>
    </React.StrictMode>,

)
