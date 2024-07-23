import React, { MouseEventHandler, PropsWithChildren, SyntheticEvent, useContext, useEffect, useState } from "react";
import { Formik, FormikErrors, useField, FieldHookConfig } from "formik";
import { Button, Card, CardBody, CardHeader, Col, Form, Row, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toFormikValidationSchema } from "zod-formik-adapter";
import CustomFieldArray from "../components/formik/CustomFieldArray.tsx";
import CustomField from "../components/formik/CustomField.tsx";
import InputTransport from "../components/formik/InputTransport.tsx";
import InputComputer from "../components/formik/InputComputer.tsx";
import InputPhone from "../components/formik/InputPhone.tsx";
import Loader from "../components/Loader.tsx";
import { ApiContext } from "../contexts/ApiContext.tsx";
import { scrollToFirstError } from "../model/form.utils.ts";
import { BusinessPropositionData, BusinessPropositionDataSchema} from "../model/models.ts";
import FormErrorNotification from "./FormErrorNotification.tsx";

const emptyData: BusinessPropositionData = {
}

const CardBloc = ({label, children}: PropsWithChildren<{ label: string }>) => (
    <Card>
        <CardHeader className="fs-5"> {label}</CardHeader>
        <CardBody>{children}</CardBody>
    </Card>
)

const CardBlocWithButton = ({label, children}: PropsWithChildren<{ label: string}>) => (
    <Card>
        <Card.Header className="d-flex justify-content-between align-items-center fs-5">
            {label}
        </Card.Header>
        <CardBody>{children}</CardBody>
    </Card>
)

function BusinessPropositionAnnotationForm() {
    const [businessPropositionAnnotation, updateBusinessPropositionAnnotation] = useState<BusinessPropositionData>()
    const {businessPropositionAnnotationId} = useParams();
    const {createBusinessProposition, readBusinessProposition, updateBusinessProposition} = useContext(ApiContext)
    const navigate = useNavigate();
    const author: string = ""

    function readBusinessPropositionAnnotation(businessPropositionAnnotationId: any) {
        return readBusinessProposition(businessPropositionAnnotationId);
    }

    useEffect(() => {
        if (businessPropositionAnnotationId === 'create') {
            updateBusinessPropositionAnnotation({
                ...emptyData
            })
        } else if (businessPropositionAnnotationId) {
            readBusinessPropositionAnnotation(businessPropositionAnnotationId).then(([value]) => updateBusinessPropositionAnnotation(value))

        }
    }, [businessPropositionAnnotationId])

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
     * @param business_proposition
     */
    const onSubmit = async (business_proposition: BusinessPropositionData) => {
        if (business_proposition.id_business_proposition_annotation) {
            return updateBusinessProposition(business_proposition);
        }
        business_proposition.id_business_proposition_file = "eb75922c-48dd-40d4-a2b3-34bb083dd153"; // placeholder
        createBusinessProposition({...business_proposition});
        navigate("/dashboard/");
    }

    /**
     * En cas d'erreur lors de la soumission du formulaire,
     * on log et on scroll vers l'input en erreur si existant
     */
    const handleSubmitError = (
    errors: FormikErrors<BusinessPropositionData>, values: BusinessPropositionData, setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => Promise<void | FormikErrors<{ id_business_proposition_annotation?: string | undefined; id_business_proposition_file?: string | undefined; mission_name?: string | undefined; id_user?: string | undefined; }>>) => (e: SyntheticEvent) => {
        e.preventDefault();
        console.warn(errors);
        console.warn(values);
        scrollToFirstError(errors);
    }

    const customerList = ["placeholder"] // TODO: Find list of clients (maybe through db request)
    const storageProviderList = ["placeholder"] // TODO: Find list of providers
    const storageRegionList = ["placeholder"] // TODO: Find list of regions
    const computeProviderList = ["placeholder"] // TODO: Find list of providers
    const computeRegionList = ["placeholder"] // TODO: Find list of regions
    const computeDeviceList = ["placeholder"] // TODO: Find list of devices

    const boolList = ["true", "false"] // TODO: Make more elegant

    if (businessPropositionAnnotation === undefined) {
        return <Loader/>
    }
    return (
        <div className="container">
            <Formik<BusinessPropositionData>
                onSubmit={onSubmit}
                validationSchema={toFormikValidationSchema(BusinessPropositionDataSchema)}
                initialValues={businessPropositionAnnotation}
            >
                
                {({handleSubmit, values, isValid, errors, setFieldTouched}) => {
                    const submitIfValid = (isValid ? handleSubmit : handleSubmitError(errors, values, setFieldTouched)) as MouseEventHandler<HTMLButtonElement> 
                    return (
                        <>
                            <FormErrorNotification/>
                            <Row className="justify-content-between">
                                <Col xs="auto"><h2>Labéler sa propal</h2></Col>
                                {}
                            </Row>
                            <Form noValidate><Stack gap={4}>
                                <CardBlocWithButton label="Informations générales">
                                    <Form.Group controlId="mission_name">
                                        <Form.Label>Nom de la mission</Form.Label>
                                        <CustomField name="mission_name"/>
                                    </Form.Group>
                                    <Form.Group controlId="customer">
                                        <CustomSelectField
                                            label="Client"
                                            name="client"
                                            options={customerList}
                                            isRequired={false}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="missionStart">
                                        <Form.Label>Date de début</Form.Label>
                                        <CustomField name="start_date" type="date"/>
                                    </Form.Group>
                                    <Form.Group controlId="missionEnd">
                                        <Form.Label>Date de fin</Form.Label>
                                        <CustomField name="end_date" type="date"/>
                                    </Form.Group>
                                    <Form.Group controlId="talanLocation">
                                        <Form.Label>Localisation Talan</Form.Label>
                                        <CustomField name="localisation_talan"/>
                                    </Form.Group>
                                    <Form.Group controlId="customerLocation">
                                        <Form.Label>Localisation Client</Form.Label>
                                        <CustomField name="localisation_client"/>
                                    </Form.Group>
                                    <Form.Group controlId="numberWorkers">
                                        <Form.Label>Nombre de collaborateurs</Form.Label>
                                        <CustomField name="number_of_workers" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="missionLength">
                                        <Form.Label>Durée de la mission (en mois)</Form.Label>
                                        <CustomField name="mission_length_in_month" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="numberOfMeetings">
                                        <Form.Label>Nombre de rendez-vous en présentiel</Form.Label>
                                        <CustomField name="number_of_in_person_meetings_per_week" type="number"/>
                                    </Form.Group>
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Transport">
                                    <CustomFieldArray<Transport>
                                        name="transports"
                                        values={values.transports}
                                        newValueBuilder={() => ({name: '', year: new Date().getFullYear()})}
                                        render={({name, index}) =>
                                            <InputTransport
                                                namespace={name}
                                                displayLabel={index === 0}/>
                                        }
                                    />
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Numérique - Informations générales">
                                    <Form.Group controlId="numberOfEmailsWithAttachments">
                                        <Form.Label>Nombre de couriel avec Pièce jointe</Form.Label>
                                        <CustomField name="number_of_emails_with_attachments_per_week" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="numberOfEmailsWithoutAttachments">
                                        <Form.Label>Nombre de couriel sans Pièce jointe</Form.Label>
                                        <CustomField name="number_of_emails_without_attachments_per_week" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="hoursOfVisioconference">
                                        <Form.Label>Nombre d'heure de visioconférence</Form.Label>
                                        <CustomField name="hours_of_visioconference_per_week" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="visioWithCamera">
                                        <Form.Label>Caméra on/off</Form.Label>
                                        <CustomField name="camera_on" type="boolean"/> //TODO make proper boolean
                                    </Form.Group>
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Numérique - Machines">
                                    <CustomFieldArray<Computer>
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

                                <CardBlocWithButton label="Numérique - Téléphone">
                                    <CustomFieldArray<Phone>
                                        name="phones"
                                        values={values.phones}
                                        newValueBuilder={() => ({name: '', year: new Date().getFullYear()})}
                                        render={({name, index}) =>
                                            <InputPhone
                                                namespace={name}
                                                displayLabel={index === 0}/>
                                        }
                                    />
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Numérique - Stockage des données">
                                    <Form.Group controlId="terabytesOfDataToStore">
                                        <Form.Label>Quantité de données</Form.Label>
                                        <CustomField name="storage_amount_in_terabytes" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="storageLifetime">
                                        <Form.Label>Period de stokage (en mois)</Form.Label>
                                        <CustomField name="storage_length_in_month" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="numberOfBackups">
                                        <Form.Label>Nombre de sauvegarde redondante</Form.Label>
                                        <CustomField name="number_of_backups" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="storageProvider">
                                        <CustomSelectField
                                            label="Provider"
                                            name="storage_provider"
                                            options={storageProviderList}
                                            isRequired={false}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="storageRegion">
                                        <CustomSelectField
                                            label="Region"
                                            name="storage_location"
                                            options={storageRegionList}
                                            isRequired={false}
                                        />
                                    </Form.Group>
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Numérique - Calcul">
                                    <Form.Group controlId="hoursOfComputation">
                                        <Form.Label>Heure de calcul</Form.Label>
                                        <CustomField name="compute_time" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="computeProvider">
                                        <CustomSelectField
                                            label="Provider"
                                            name="compute_provider"
                                            options={computeProviderList}
                                            isRequired={false}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="computeRegion">
                                        <CustomSelectField
                                            label="Region"
                                            name="compute_location"
                                            options={computeRegionList}
                                            isRequired={false}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="computeDevice">
                                        <CustomSelectField
                                            label="Type de calculateur"
                                            name="compute_device"
                                            options={computeDeviceList}
                                            isRequired={false}
                                        />
                                    </Form.Group>
                                </CardBlocWithButton>

                                <CardBlocWithButton label="Bureau">
                                    <Form.Group controlId="numberOfPagePrints">
                                        <Form.Label>Nombre de pages imprimer en moyenne par mois</Form.Label>
                                        <CustomField name="pages_printed_per_month" type="number"/>
                                    </Form.Group>
                                    <Form.Group controlId="doubleSided">
                                        <CustomSelectField
                                            label="Recto - Verso"
                                            name="print_double_sided"
                                            options={boolList}
                                            isRequired={false}
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

export default BusinessPropositionAnnotationForm

