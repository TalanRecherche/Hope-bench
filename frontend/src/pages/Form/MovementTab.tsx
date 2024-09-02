
import React, { MouseEventHandler, PropsWithChildren, SyntheticEvent, useContext, useEffect, useState } from "react";
import { Formik, FormikErrors, useField, FieldHookConfig } from "formik";
import { Button, Card, CardBody, Col, Form, Row, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toFormikValidationSchema } from "zod-formik-adapter";
import CustomField from "../../components/formik/CustomField.tsx";
import Loader from "../../components/Loader.tsx";
import { ApiContext } from "../../contexts/ApiContext.tsx";
import { scrollToFirstError } from "../../model/form.utils.ts";
import { BusinessPropositionData, BusinessPropositionDataSchema} from "../../model/models.ts";
import FormErrorNotification from "../FormErrorNotification.tsx";

const CardBlocWithButton = ({label, children}: PropsWithChildren<{ label: string}>) => (
    <Card>
        <Card.Header className="d-flex justify-content-between align-items-center fs-5">
            {label}
        </Card.Header>
        <CardBody>{children}</CardBody>
    </Card>
)

function MovementTab () {
    const [businessPropositionAnnotation, updateBusinessPropositionAnnotation] = useState<BusinessPropositionData>()
    const {businessPropositionAnnotationId} = useParams();
    const {createBusinessProposition, readBusinessProposition, updateBusinessProposition} = useContext(ApiContext)
    const navigate = useNavigate();

    function readBusinessPropositionAnnotation(businessPropositionAnnotationId: any) {
        return readBusinessProposition(businessPropositionAnnotationId);
    }

    const emptyData: BusinessPropositionData = {
    }

    useEffect(() => {
        if (businessPropositionAnnotationId === 'create') {
            updateBusinessPropositionAnnotation({
                ...emptyData
            })
        } else if (businessPropositionAnnotationId) {
            readBusinessPropositionAnnotation(businessPropositionAnnotationId).then((value) => {console.log(value);updateBusinessPropositionAnnotation({...emptyData})})

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
        //createBusinessProposition({...business_proposition});
        //navigate("/dashboard/");
    }

    /**
     * En cas d'erreur lors de la soumission du formulaire,
     * on log et on scroll vers l'input en erreur si existant
     */
    const handleSubmitError = (
    errors: FormikErrors<BusinessPropositionData>, values: BusinessPropositionData) => (e: SyntheticEvent) => {
        e.preventDefault();
        console.warn(errors);
        console.warn(values);
        scrollToFirstError(errors);
    }

    const customerList = ["placeholder"]

    // if (businessPropositionAnnotation === undefined) {
    //     return <Loader/>
    // }
    return (
        <div className="container">
            <Formik<BusinessPropositionData>
                onSubmit={onSubmit}
                validationSchema={toFormikValidationSchema(BusinessPropositionDataSchema)}
                initialValues={emptyData}
            >
                
                {({handleSubmit, values, isValid, errors}) => {
                   const submitIfValid = (isValid ? handleSubmit : handleSubmitError(errors, values)) as MouseEventHandler<HTMLButtonElement> 
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

                                <Button variant="primary" onClick={submitIfValid}>Sauvegarder les info propal</Button>
                            </Stack></Form>
                        </>
                    );
                }}
            </Formik>

        </div>
    )
}
export default MovementTab