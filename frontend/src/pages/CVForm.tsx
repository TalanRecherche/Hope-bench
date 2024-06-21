import React, {MouseEventHandler, PropsWithChildren, SyntheticEvent, useContext, useEffect, useState} from "react";
import {Field, FieldArray, Formik, FormikErrors, useField, FieldHookConfig} from "formik";
import {FormikProps} from "formik/dist/types";
import {Button, Card, CardBody, CardHeader, Col, Form, Row, Stack} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import {v4 as uuid} from 'uuid';
import {toFormikValidationSchema} from "zod-formik-adapter";
import CustomFieldArray from "../components/formik/CustomFieldArray";
import CustomField from "../components/formik/CustomField";
import FieldArrayError from "../components/formik/FieldArrayError";
import InputCertification from "../components/formik/InputCertification";
import InputEducation from "../components/formik/InputEducation";
import InputLanguage from "../components/formik/InputLanguage";
import InputSkillsByDomain from "../components/formik/InputSkillsByDomain";
import Loader from "../components/Loader";
import MissionCard from "../components/MissionCard";
import MissionFormDrawer from "../components/MissionFormDrawer";
import {ApiContext} from "../contexts/ApiContext";
import {AuthContext} from "../contexts/AuthContext";
import {scrollToFirstError} from "../model/form.utils";
import {BaseModelWithComments, Certification, CVData, cvDataSchema, Education, Language, Skill} from "../model/models";
import {FieldProps} from "formik/dist/Field";
import CommentDrawer from "../components/CommentDrawer.tsx";
import FormErrorNotification from "./FormErrorNotification.tsx";

const generateEmptyBaseModelWithComments = (): BaseModelWithComments => {
    return {
        comments: [], // Return an empty array for comments
    };
};

const emptyData: CVData = {
    firstname: '',
    lastname: '',
    poste: '',
    introduction: '',
    missions: [],
    languages: [],
    educations: [],
    certifications: [],
    skills: [],
    comm_languages: generateEmptyBaseModelWithComments(),
    comm_educations: generateEmptyBaseModelWithComments(),
    comm_certifications: generateEmptyBaseModelWithComments(),
    comm_skills: generateEmptyBaseModelWithComments(),
    comm_general: generateEmptyBaseModelWithComments(), 
    label: "",
    status: 0,
    primary_cv: false, 
    labelsAnnotation: {
        bulletForLanguageLevels: false,
        noSkillDomains: false,
        noCertifications: false,
        anonymized: false,
        noIntroduction: false,
        englishCV: false
    },
    originalFormat: ""
}

const CardBloc = ({label, children}: PropsWithChildren<{ label: string }>) => (
    <Card>
        <CardHeader className="fs-5"> {label}</CardHeader>
        <CardBody>{children}</CardBody>
    </Card>
)

const CardBlocWithButton = ({label, cv, commModel, children, author}: PropsWithChildren<{ label: string, cv: CVData, commModel: BaseModelWithComments, author: string }>) => (
    <Card>
        <Card.Header className="d-flex justify-content-between align-items-center fs-5">
            {label}
            {commModel && commModel.comments && commModel.comments.length > 0 ? (
                createCommentDrawer(commModel, cv, true, author)
            ) : null}
        </Card.Header>
        <CardBody>{children}</CardBody>
    </Card>
)

function createCommentDrawer(commModel:BaseModelWithComments, cv:CVData, modifyPossible: boolean, author: string) {
    return ((commModel != undefined && commModel.comments != undefined && commModel.comments.length > 0) ? <CommentDrawer originalCommentModel={commModel} isOnManagerView={false} cv={cv} modifyPossible={modifyPossible} author={author}>
        {({toggleDrawer}) =>
                    <Button variant="secondary" size="sm" onClick={toggleDrawer}>Voir tous les commentaires</Button>
                }
    </CommentDrawer> : null)
}


function CVForm() {
    const [cv, setCv] = useState<CVData>()
    const {cvId} = useParams();
    const {user} = useContext(AuthContext)
    const {updateCv, createCv, getCv} = useContext(ApiContext)
    const navigate = useNavigate();
    const author: string = ""

    useEffect(() => {
        if (cvId === 'create') {
            setCv({
                ...emptyData,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
            })
        } else if (cvId) {
            getCv(cvId).then(setCv)

        }
    }, [cvId])

    interface CustomSelectFieldProps {
        label: string;
        options: string[];
        name: string;
        isRequired: boolean;
      }
      
      const CustomSelectField: React.FC<CustomSelectFieldProps & FieldHookConfig<string>> = ({ label, options, isRequired, ...props }) => {
        const [field, meta] = useField<string>(props);
      
        return (
          <Form.Group controlId={props.name}>
            <Form.Label>
                {label}
                {isRequired && <span style={{ color: 'red' }}> *</span>} {/* Conditionally render asterisk */}
            </Form.Label>
            <Form.Control as="select" {...field} required={isRequired}>
              <option value="">Select an option</option>
              {options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
            {meta.touched && meta.error ? (
              <div className="error">{meta.error}</div>
            ) : null}
          </Form.Group>
        );
      };



    /**
     * Fonction d'envoi du formulaire à l'api
     * À ce moment, les données ont été validées par Formik
     *
     * @param cvData
     */
    const onSubmit = async (cvData: CVData) => {
        // console.warn(cvData)
        if (cvData.id) {
            return updateCv(cvData)
        }
        let id = uuid()
        return createCv({...cvData, id: id}).then(() => {
            navigate("/cvs/" + id);
            navigate("/my-cvs/")
        })/*.catch(error => {
            // Handle error if createCv fails
            console.error("Error occurred while creating CV in CVForm.onSubmit : ", error);
        });*/
    }

    /**
     * En cas d'erreur lors de la soumission du formulaire,
     * on log et on scroll vers l'input en erreur si existant
     */
    const handleSubmitError = (
        errors: FormikErrors<CVData>,
        values: CVData,
        setFieldTouched: FormikProps<CVData>['setFieldTouched']
    ) => (e: SyntheticEvent) => {
        e.preventDefault();
        console.warn(errors);
        console.warn(values);
        scrollToFirstError(errors);
        // fix react-inputtags, set to touched (not working only here, TODO: investigate more)
        for (let i = 0; i < values.skills?.length || 0; i++) {
            setFieldTouched(`skills.${i}.skills`, true, true);
        }
    }

    



    const originalFormatOptions = ["docx", "pptx", "pdf diapo", "pdf text"]

    if (cv === undefined) {
        return <Loader/>
    }
    return (
        <div className="container">
            <Formik<CVData>
                onSubmit={onSubmit}
                validationSchema={toFormikValidationSchema(cvDataSchema)}
                initialValues={cv}
            >
                
                {({handleSubmit, values, isValid, errors, setFieldTouched}) => {
                    const submitIfValid = (isValid ? handleSubmit : handleSubmitError(errors, values, setFieldTouched)) as MouseEventHandler<HTMLButtonElement> 
                    return (
                        <>
                            <FormErrorNotification/>
                            <Row className="justify-content-between">
                                <Col xs="auto"><h2>Créer son CV</h2></Col>
                                {/* <Col xs="auto"><Stack gap={3} direction="horizontal">
                                    <ImportButton onSuccess={parsedCv => handleImport(parsedCv, values, setValues)} firstname={cv.firstname} lastname={cv.lastname}/>
                                    {previousCv ?
                                        <Button variant="secondary" size="sm" onClick={() => handleReset(setValues)}>Annuler
                                            l'import</Button> : null}
                                </Stack></Col> */}
                            </Row>
                            <Form noValidate><Stack gap={4}>
                                <CardBlocWithButton label="Informations générales" commModel={cv.comm_general} cv={cv} author={author} >
                                    <Form.Group controlId="firstname">
                                        <Form.Label>Prénom</Form.Label>
                                        <CustomField name="firstname" required/>
                                    </Form.Group>
                                    <Form.Group controlId="lastname">
                                        <Form.Label>Nom</Form.Label>
                                        <CustomField name="lastname" required/>
                                    </Form.Group>
                                    <Form.Group controlId="poste">
                                        <Form.Label>Poste</Form.Label>
                                        <CustomField name="poste" required/>
                                    </Form.Group>
                                    <Form.Group controlId="introduction">
                                        <Form.Label>Description <span style={{color: 'red'}}>*</span></Form.Label>
                                        <CustomField name="introduction" as={TextareaAutosize} required/>
                                    </Form.Group>
                                    <Form.Group controlId="label">
                                        <Form.Label>Etiquette pour ce CV</Form.Label>
                                        <CustomField name="label" required/>
                                    </Form.Group>
                                        <Form.Group controlId="labelsAnnotation">
                                    <Form.Label>Labels Annotation</Form.Label>
                                    <div>
                                        {Object.keys(cv.labelsAnnotation).map((key) => (
                                            <div key={key} className="mb-3">
                                                <Field type="checkbox" name={`labelsAnnotation.${key}`}>
                                                    {({ field }: {field : any}) => (
                                                        <Form.Check 
                                                            type="checkbox"
                                                            label={key}
                                                            {...field}
                                                            checked={field.value}
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                        ))}
                                    </div>
                                    </Form.Group>
                                    <CustomSelectField
                                        label="Format du fichier original"
                                        name="originalFormat"
                                        options={originalFormatOptions}
                                        isRequired={true}
                                    />
                                </CardBlocWithButton>
                                <CardBlocWithButton label="Diplômes" commModel={cv.comm_educations} cv={cv} author={author}>
                                    <CustomFieldArray<Education>
                                        name="educations"
                                        values={values.educations}
                                        newValueBuilder={() => ({name: '', year: new Date().getFullYear()})}
                                        render={({name, index}) =>
                                            <InputEducation
                                                namespace={name}
                                                displayLabel={index === 0}/>
                                        }
                                    />
                                </CardBlocWithButton>
                                <CardBlocWithButton label="Certifications/Formations" commModel={cv.comm_certifications} cv={cv} author={author}>
                                    <CustomFieldArray<Certification>
                                        name="certifications"
                                        values={values.certifications}
                                        newValueBuilder={() => ({name: '', date: ''})}
                                        render={({name, index}) =>
                                            <InputCertification
                                                namespace={name}
                                                displayLabel={index === 0}/>
                                        }
                                    />
                                </CardBlocWithButton>
                                <CardBlocWithButton label="Langues" commModel={cv.comm_languages} cv={cv} author={author}>
                                    <CustomFieldArray<Language>
                                        name="languages"
                                        values={values.languages}
                                        newValueBuilder={() => ({name: '', level: ''})}
                                        render={({name, index}) =>
                                            <InputLanguage
                                                namespace={name}
                                                displayLabel={index === 0}/>
                                        }
                                    />
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Compétences" commModel={cv.comm_skills} cv={cv} author={author}>
                                    <CustomFieldArray<Skill>
                                        name="skills"
                                        values={values.skills}
                                        newValueBuilder={() => ({domain: '', skills: []})}
                                        render={({name, index}) =>
                                            <InputSkillsByDomain
                                                namespace={name}
                                                displayLabel={index === 0}/>
                                        }
                                    />
                                </CardBlocWithButton>

                                <CardBloc label="Missions">
                                    <FieldArray
                                        name="missions"
                                        render={arrayHelpers => (<Stack gap={3}>
                                            {values.missions != undefined ? values.missions.map((mission, index) => (
                                                <React.Fragment key={index}>
                                                    <MissionFormDrawer
                                                        onSave={m => arrayHelpers.replace(index, m)}
                                                        initialValues={mission}>
                                                        {({toggleDrawer}) =>
                                                            <MissionCard mission={mission}
                                                                         onEdit={toggleDrawer}
                                                                         onDelete={() => arrayHelpers.remove(index)}
                                                                         cv={cv}
                                                                         author={author}
                                                                        //  commentDrawer={createCommentDrawer(mission, cv, true)
                                                            >
                                                                <Field name={"missions." + index}>
                                                                    {({meta}: FieldProps) => meta.error != null ? (
                                                                        typeof meta.error === 'string'
                                                                            // meta.error can be an object
                                                                            // display error on array, not subfields
                                                                            // d-block to force display
                                                                            ? <div
                                                                                className="d-block invalid-feedback">{meta.error}</div>
                                                                            : <div
                                                                                className="d-block invalid-feedback">Erreur
                                                                                : mission non valide, veuillez vérifier le
                                                                                contenu</div>
                                                                    ) : null}
                                                                </Field>
                                                            </MissionCard>
                                                        }
                                                    </MissionFormDrawer>
                                                </React.Fragment>
                                            )) : null}
                                            <FieldArrayError name="missions"/>
                                            <div>
                                                <MissionFormDrawer onSave={m => arrayHelpers.push(m)}>
                                                    {({toggleDrawer}) =>
                                                        <Button variant="secondary" size="sm" onClick={toggleDrawer}>Ajouter
                                                            une mission</Button>
                                                    }
                                                </MissionFormDrawer>
                                            </div>
                                        </Stack>)}
                                    />
                                </CardBloc>
                                <Button variant="primary" onClick={submitIfValid}>Sauvegarder le CV</Button>
                            </Stack></Form>
                        </>
                    );
                }}
            </Formik>

        </div>
    )
}

export default CVForm
