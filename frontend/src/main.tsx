import * as React from "react";
import {useContext, useState, useEffect} from "react";
import * as ReactDOM from 'react-dom/client'
import {ReactNotifications} from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import App from "./App";
import {ApiProvider} from "./contexts/ApiContext";
import {AuthContext, AuthProvider} from "./contexts/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.scss'
import CVForm from "./pages/CVForm";
import MyCvList from "./pages/MyCvList.tsx";
import TemplateDoc from "./pages/TemplateDoc";
import TemplateList from "./pages/TemplateList";
import CvSearch from "./pages/CvSearch.tsx";
import {ApiContext} from "./contexts/ApiContext.tsx";

const RouterContext = () => {
    const {user} = useContext(AuthContext)

    const { getFullNameUser } = useContext(ApiContext);

    // Initialize author with a default value
    const [author, setAuthor] = useState('Loading...'); // or use null or another placeholder

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

    const managerRoutes = user.roles.includes('manager') ? [
        {path: "cvs", element: <CvSearch author={author}/>}
    ] : []
    const templateManagerRoutes = user.roles.includes('template_manager') ? [
        {path: "templates", element: <TemplateList/>},
        {path: "templates-doc", element: <TemplateDoc/>},
    ] : []


    const router = createBrowserRouter([{
        path: "/",
        element: <App/>,
        children: [
            {index: true, element: <Navigate to="/my-cvs" replace/>},
            ...managerRoutes,
            {path: "my-cvs", element: <MyCvList />},
            {path: "cvs/:cvId", element: <CVForm/>},
            ...templateManagerRoutes,
            {path: "*", element: <Navigate to="/my-cvs" replace/>},
        ],
    },
    ]);
    return <RouterProvider router={router}/>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ReactNotifications/>
        <AuthProvider>
            <ApiProvider>
                <RouterContext/>
            </ApiProvider>
        </AuthProvider>
    </React.StrictMode>,
    
)
