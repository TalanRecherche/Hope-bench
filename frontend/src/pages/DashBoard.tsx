import {useContext} from "react";
import {Button, Container, Stack} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {ApiContext} from "../contexts/ApiContext";
import {AuthContext} from "../contexts/AuthContext";
import {v4 as uuid} from 'uuid';
import BusinessPropositionLoadingCard from "../components/businessProposition/BusinessPropositionLoadingCard";
import usePaginatedCvs from "../hooks/usePaginatedCvs.hook.tsx";

function DashBoard() {
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()
    const {loading, businessPropositionPage, changePage, paginator} = usePaginatedCvs(true, user.id)

    const author: string = ""

    return (
        <Container>
            <h1>DashBoard</h1>
            <h2>Bienvenue {user.firstname} {user.lastname}</h2>

            <Stack gap={3}>
                {loading
                    ? <BusinessPropositionLoadingCard/>: null}
            </Stack>

        </Container>
    )
}

export default DashBoard
