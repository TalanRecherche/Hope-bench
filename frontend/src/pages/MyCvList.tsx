import {useContext} from "react";
import {Button, Container, Stack} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import CvCard from "../components/cv/CvCard.tsx";
import CvLoadingCard from "../components/cv/CvLoadingCard.tsx";
import {ApiContext} from "../contexts/ApiContext";
import {AuthContext} from "../contexts/AuthContext";
import usePaginatedCvs from "../hooks/usePaginatedCvs.hook.tsx";
import {BaseModelWithComments, CVData} from "../model/models";
import CVDrawer from "../components/cv/CVDrawer.tsx";
import {v4 as uuid} from 'uuid';

function MyCvList() {
    const {user} = useContext(AuthContext)
    const {loading, cvPage, changePage, paginator} = usePaginatedCvs(true, user.id)
    const { deleteCv, createCv} = useContext(ApiContext)
    const navigate = useNavigate()

    const handleDelete = (cv: CVData): void => {
        const prompt = `Êtes-vous sûr de vouloir supprimer ce CV ?`;
        if (window.confirm(prompt) && cv.id) {
            deleteCv(cv.id).then(() => changePage(cvPage?.page))
        }
    };

    const generateEmptyBaseModelWithComments = (): BaseModelWithComments => {
        return {
            comments: [], // Return an empty array for comments
        };
    };

    const onDuplicate = (cv: CVData) => {
        let id = uuid()
        let cvDuplicated: CVData = {...cv,
            id: id,
            comm_languages: generateEmptyBaseModelWithComments(),
            comm_educations: generateEmptyBaseModelWithComments(),
            comm_certifications: generateEmptyBaseModelWithComments(),
            comm_skills: generateEmptyBaseModelWithComments(),
            comm_general: generateEmptyBaseModelWithComments(),
            label: (cv.label? cv.label : "") + " Copie", 
            status: 0,
            primary_cv: false}
        createCv(cvDuplicated).then(() => {
            // Navigate to the current page to refresh the list of CVs
            navigate(0); // This effectively refreshes the current page
        });
    }


    const author: string = ""

    return (
        <Container>
            <h2>Mes CVs</h2>
            <Stack gap={3}>
                {loading
                    ? <CvLoadingCard/>
                    : cvPage.elements.map(cv =>
                        <CVDrawer cv={cv} key={cv.id} ownCV={true} managerView={false} author={author}>
                            {({toggleDrawer}) => <CvCard
                                cv={cv}
                                editable={cv.status != 3}
                                canReview={false}
                                onView={toggleDrawer}
                                onDelete={handleDelete}
                                onDuplicate={onDuplicate}/>}
                        </CVDrawer>
                    )}
                <Stack gap={2} direction="horizontal">
                    {/* @ts-ignore */}
                    <Button as={Link} className="btn-sm" to={`/cvs/create`}>Nouveau</Button>
                </Stack>
            </Stack>
            {paginator}
        </Container>
    )
}

export default MyCvList
