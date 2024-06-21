import {PropsWithChildren, useContext, useState, useEffect} from "react";
import {Container, Form, Stack, Dropdown} from "react-bootstrap";
import {ApiContext} from "../contexts/ApiContext";
import {AuthContext} from "../contexts/AuthContext";
import {CVData, Template} from "../model/models";
import {useDebounce} from "usehooks-ts";
import CvCard from "../components/cv/CvCard.tsx";
import CvLoadingCard from "../components/cv/CvLoadingCard.tsx";
import TemplatePicker from "../components/TemplatePicker.tsx";
import useTemplatesByType from "../hooks/useTemplatesByType.hook.ts";
import usePaginatedCvs from "../hooks/usePaginatedCvs.hook.tsx";
import CVDrawer from "../components/cv/CVDrawer.tsx";

function CvSearch({author} : PropsWithChildren< {author: string} >) {
    const {user} = useContext(AuthContext)
    const [search, setSearch] = useState<string>('')
    const debouncedSearch = useDebounce(search)
    
    const templatesByType = useTemplatesByType(true)
    const {generateCv} = useContext(ApiContext)
    const [selectedCvs, setSelectedCvs] = useState<CVData[]>([])
    const [limitCvToAllowedOnes, _setLimitCvToAllowedOnes] = useState<boolean>(true);
    const [selectedOptions, setSelectedOptions] = useState<{
        [key: string]: boolean;
      }>({
        brouillons: false,
        waitingCorrect: true,
        waitingReview: true,
        valid: true,
      });
    const [showMainCvOnly, setShowMainCvOnly] = useState<boolean>(false);

    const {loading, cvPage, paginator} = usePaginatedCvs(false, user.id, debouncedSearch, limitCvToAllowedOnes, selectedOptions, showMainCvOnly)
    
    const setLimitCvToAllowedOnes = () => {
        _setLimitCvToAllowedOnes(!limitCvToAllowedOnes)
        setSearch(search.toString())
    }

    const generateMultiple = (cvs: CVData[], template: Template) => {
        cvs.forEach(cv => generateCv(cv, template))
    }

    const toggleSelect = (cv: CVData) => {
        if (selectedCvs.includes(cv)) {
            setSelectedCvs(selectedCvs.filter(c => c !== cv))
        } else {
            setSelectedCvs([...selectedCvs, cv])
        }
    }
    
    const handleShowMainCvOnlyChange = () => {
        setShowMainCvOnly(!showMainCvOnly);
        setSearch(search.toString())

    };

    
    const handleOptionChange = (option: string) => {
        setSelectedOptions({
            ...selectedOptions,
            [option]: !selectedOptions[option], // Toggle the selected state
        });
        setSearch(search.toString())

    };

    const {getReviewedAndUnderlings} = useContext(ApiContext)

    // Initialize author with a default value
    const [idReviewedAndUnderlings, setidReviewedAndUnderlings] = useState<string[]>([]); // or use null or another placeholder

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const listID = await getReviewedAndUnderlings(user.id); // Get the full name asynchronously
                setidReviewedAndUnderlings(listID); // Set the author once the Promise resolves
                console.log("ID reviewer and underlings : ", idReviewedAndUnderlings)
            } catch (error) {
                console.error("Failed to fetch underlings and reviewees", error);
                setidReviewedAndUnderlings([]); // Set a fallback if there's an error
            }
        };

        if (user?.id) {
            fetchAuthor(); // Call the fetch function only if user ID is defined
        }
    }, [user]);


    return (
        <Container>
            <h2>CVs</h2>
            <Stack gap={3}>
                <Form.Control id={"search"} name={"search"} placeholder={"Search"}
                              disabled={false}
                              value={search}
                              onChange={e => setSearch(e.target.value)}/>
                {/* <Button onClick={()=>setLimitCvToAllowedOnes()}> {limitCvToAllowedOnes ? "Afficher tous les CV" : "Ne pas afficher tous les CV"}</Button> */}
                <Stack direction="horizontal" gap={3}>
                    <Form.Check
                        type="checkbox"
                        id="showAllCvs"
                        label="Afficher tous les CV"
                        checked={!limitCvToAllowedOnes}
                        onChange={setLimitCvToAllowedOnes}
                    />
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Filtrer par statut
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item
                            onClick={() => handleOptionChange("brouillons")}
                            active={selectedOptions.brouillons}
                            >
                            CV brouillons
                            </Dropdown.Item>
                            <Dropdown.Item
                            onClick={() => handleOptionChange("waitingCorrect")}
                            active={selectedOptions.waitingCorrect}
                            >
                            CV en attente de correction
                            </Dropdown.Item>
                            <Dropdown.Item
                            onClick={() => handleOptionChange("waitingReview")}
                            active={selectedOptions.waitingReview}
                            >
                            CV en attente d'évaluation
                            </Dropdown.Item>
                            <Dropdown.Item
                            onClick={() => handleOptionChange("valid")}
                            active={selectedOptions.valid}
                            >
                            CV validés
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Check
                        type="checkbox"
                        id="showMainCvOnly"
                        label="N'afficher que le CV principal"
                        checked={showMainCvOnly}
                        onChange={handleShowMainCvOnlyChange}
                    />
                </Stack>
                {loading && cvPage.elements != null
                    ? <CvLoadingCard/>
                    : cvPage.elements.map(cv =>
                        <CVDrawer cv={cv} key={cv.id} managerView={idReviewedAndUnderlings.indexOf(cv.id_user != undefined ? cv.id_user: "") != -1} ownCV={false} author={author}>
                            {({toggleDrawer}) => <CvCard
                                cv={cv}
                                canReview={idReviewedAndUnderlings.indexOf(cv.id_user != undefined ? cv.id_user: "") != -1}
                                onSelect={toggleSelect}
                                onView={toggleDrawer}
                                selected={selectedCvs.includes(cv)}/>}
                        </CVDrawer>
                    )}
                {paginator}
                {selectedCvs.length > 0 && <TemplatePicker
                    title={selectedCvs.length === 1
                        ? "Exporter le CV sélectionné"
                        : `Exporter les ${selectedCvs.length} CVs sélectionnés`}
                    templatesByType={templatesByType || {}}
                    onSelect={t => generateMultiple(selectedCvs, t)}/>}
            </Stack>
        </Container>
    )
}

export default CvSearch
