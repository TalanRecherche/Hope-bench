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
import InputTransport from "../components/formik/InputTransport";
import InputComputer from "../components/formik/InputComputer";
import Loader from "../components/Loader";
import MissionCard from "../components/MissionCard";
import MissionFormDrawer from "../components/MissionFormDrawer";
import {ApiContext} from "../contexts/ApiContext";
import {AuthContext} from "../contexts/AuthContext";
import {scrollToFirstError} from "../model/form.utils";
import {BaseModelWithComments, propalData, propalDataSchema} from "../model/models";
import {FieldProps} from "formik/dist/Field";
import CommentDrawer from "../components/CommentDrawer.tsx";
import FormErrorNotification from "./FormErrorNotification.tsx";

const generateEmptyBaseModelWithComments = (): BaseModelWithComments => {
    return {
        comments: [], // Return an empty array for comments
    };
};

const emptyData: propalData = {
    comm_transport: generateEmptyBaseModelWithComments(),
    comm_general: generateEmptyBaseModelWithComments(),
    status: 0
}

const CardBloc = ({label, children}: PropsWithChildren<{ label: string }>) => (
    <Card>
        <CardHeader className="fs-5"> {label}</CardHeader>
        <CardBody>{children}</CardBody>
    </Card>
)

const CardBlocWithButton = ({label, cv, commModel, children, author}: PropsWithChildren<{ label: string, cv: propalData, commModel: BaseModelWithComments, author: string }>) => (
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

function createCommentDrawer(commModel:BaseModelWithComments, cv:propalData, modifyPossible: boolean, author: string) {
    return ((commModel != undefined && commModel.comments != undefined && commModel.comments.length > 0) ? <CommentDrawer originalCommentModel={commModel} isOnManagerView={false} cv={cv} modifyPossible={modifyPossible} author={author}>
        {({toggleDrawer}) =>
                    <Button variant="secondary" size="sm" onClick={toggleDrawer}>Voir tous les commentaires</Button>
                }
    </CommentDrawer> : null)
}


function CVForm() {
    const [cv, setCv] = useState<propalData>()
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
    const onSubmit = async (cvData: propalData) => {
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
        errors: FormikErrors<propalData>,
        values: propalData,
        setFieldTouched: FormikProps<propalData>['setFieldTouched']
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

    const customerList = ["placeholder"] // TODO: Find list of clients (maybe through db request)
    const storageProviderList = ["placeholder"] // TODO: Find list of providers
    const storageRegionList = ["placeholder"] // TODO: Find list of regions
    const computeProviderList = ["placeholder"] // TODO: Find list of providers
    const computeRegionList = ["placeholder"] // TODO: Find list of regions
    const computeDeviceList = ["placeholder"] // TODO: Find list of devices

    if (cv === undefined) {
        return <Loader/>
    }
    return (
        <div className="container">
            <Formik<propalData>
                onSubmit={onSubmit}
                validationSchema={toFormikValidationSchema(propalDataSchema)}
                initialValues={cv}
            >
                
                {({handleSubmit, values, isValid, errors, setFieldTouched}) => {
                    const submitIfValid = (isValid ? handleSubmit : handleSubmitError(errors, values, setFieldTouched)) as MouseEventHandler<HTMLButtonElement> 
                    return (
                        <>
                            <FormErrorNotification/>
                            <Row className="justify-content-between">
                                <Col xs="auto"><h2>Labéler sa propal</h2></Col>
                                {/* <Col xs="auto"><Stack gap={3} direction="horizontal">
                                    <ImportButton onSuccess={parsedCv => handleImport(parsedCv, values, setValues)} firstname={cv.firstname} lastname={cv.lastname}/>
                                    {previousCv ?
                                        <Button variant="secondary" size="sm" onClick={() => handleReset(setValues)}>Annuler
                                            l'import</Button> : null}
                                </Stack></Col> */}
                            </Row>
                            <Form noValidate><Stack gap={4}>
                                <CardBlocWithButton label="Informations générales" commModel={cv.comm_general} cv={cv} author={author} >
                                    <Form.Group controlId="mission_name">
                                        <Form.Label>Nom de la mission</Form.Label>
                                        <CustomField name="mission_name"/>
                                    </Form.Group>
                                    <Form.Group controlId="customer">
                                        <CustomSelectField
                                            label="Client"
                                            name="customer"
                                            options={customerList}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="missionStart">
                                        <Form.Label>Date de début</Form.Label>
                                        <CustomField name="missionStart" type="date"/>
                                    </Form.Group>
                                    <Form.Group controlId="missionEnd">
                                        <Form.Label>Date de fin</Form.Label>
                                        <CustomField name="missionEnd" type="date"/>
                                    </Form.Group>
                                    <Form.Group controlId="talanLocation">
                                        <Form.Label>Localisation Talan</Form.Label>
                                        <CustomField name="talanLocation"/>
                                    </Form.Group>
                                    <Form.Group controlId="customerLocation">
                                        <Form.Label>Localisation Client</Form.Label>
                                        <CustomField name="customerLocation"/>
                                    </Form.Group>
                                    <Form.Group controlId="numberWorkers">
                                        <Form.Label>Nombre de collaborateurs</Form.Label>
                                        <CustomField name="numberWorkers" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="missionLength">
                                        <Form.Label>Durée de la mission (en mois)</Form.Label>
                                        <CustomField name="missionLength" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="numberOfMeetings">
                                        <Form.Label>Nombre de rendez-vous en présentiel</Form.Label>
                                        <CustomField name="numberOfMeetings" type="number"/>
                                    </Form.Group>
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Transport" commModel={cv.comm_transport} cv={cv} author={author}>
                                    <CustomFieldArray<Transport>
                                        name="transport"
                                        values={values.transport}
                                        newValueBuilder={() => ({name: '', year: new Date().getFullYear()})}
                                        render={({name, index}) =>
                                            <InputTransport
                                                namespace={name}
                                                displayLabel={index === 0}/>
                                        }
                                    />
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Numérique - Informations générales" commModel={cv.comm_general} cv={cv} author={author} >
                                    <Form.Group controlId="numberOfEmailsWithAttachments">
                                        <Form.Label>Nombre de couriel avec Pièce jointe</Form.Label>
                                        <CustomField name="numberOfEmailsWithAttachments" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="numberOfEmailsWithoutAttachments">
                                        <Form.Label>Nombre de couriel sans Pièce jointe</Form.Label>
                                        <CustomField name="numberOfEmailsWithoutAttachments" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="hoursOfVisioconference">
                                        <Form.Label>Nombre d'heure de visioconférence</Form.Label>
                                        <CustomField name="hoursOfVisioconference" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="visioWithCamera">
                                        <Form.Label>Caméra on/off</Form.Label>
                                        <CustomField name="visioWithCamera" type="boolean"/> //TODO make proper boolean
                                    </Form.Group>
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Numérique - Machines" commModel={cv.comm_digital} cv={cv} author={author}>
                                    <CustomFieldArray<Computers>
                                        name="computers"
                                        values={values.computers}
                                        newValueBuilder={() => ({name: '', year: new Date().getFullYear()})}
                                        render={({name, index}) =>
                                            <InputComputer
                                                namespace={name}
                                                displayLabel={index === 0}/>
                                        }
                                    />
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Numérique - Téléphone" commModel={cv.comm_digital} cv={cv} author={author}>
                                    <CustomFieldArray<Phones>
                                        name="phones"
                                        values={values.computers}
                                        newValueBuilder={() => ({name: '', year: new Date().getFullYear()})}
                                        render={({name, index}) =>
                                            <InputPhone
                                                namespace={name}
                                                displayLabel={index === 0}/>
                                        }
                                    />
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Numérique - Stockage des données" commModel={cv.comm_general} cv={cv} author={author} >
                                    <Form.Group controlId="terabytesOfDataToStore">
                                        <Form.Label>Quantité de données</Form.Label>
                                        <CustomField name="terabytesOfDataToStore" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="storageLifetime">
                                        <Form.Label>Period de stokage (en mois)</Form.Label>
                                        <CustomField name="storageLifetime" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="numberOfBackups">
                                        <Form.Label>Nombre de sauvegarde redondante</Form.Label>
                                        <CustomField name="numberOfBackups" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="storageProvider">
                                        <CustomSelectField
                                            label="Provider"
                                            name="storageProvider"
                                            options={storageProviderList}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="storageRegion">
                                        <CustomSelectField
                                            label="Region"
                                            name="storageRegion"
                                            options={storageRegionList}
                                        />
                                    </Form.Group>
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Numérique - Calcul" commModel={cv.comm_general} cv={cv} author={author} >
                                    <Form.Group controlId="hoursOfComputation">
                                        <Form.Label>Heure de calcul</Form.Label>
                                        <CustomField name="hoursOfComputation" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="computeProvider">
                                        <CustomSelectField
                                            label="Provider"
                                            name="computeProvider"
                                            options={computeProviderList}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="computeRegion">
                                        <CustomSelectField
                                            label="Region"
                                            name="computeRegion"
                                            options={computeRegionList}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="computeDevice">
                                        <CustomSelectField
                                            label="Type de calculateur"
                                            name="computeDevice"
                                            options={computeDeviceList}
                                        />
                                    </Form.Group>
                                </CardBlocWithButton>

                                <Button variant="primary" onClick={submitIfValid}>Sauvegarder les info propal</Button>
                            </Stack></Form>
                        </>
                    );
                }}
            </Formik>

        </div>
    )
}//TODO: link regions to provider

export default CVForm
