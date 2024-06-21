import {Field} from "formik";
import {FieldProps} from "formik/dist/Field";
import {FormikProps} from "formik/dist/types";
import {ClipboardEvent} from "react";
import {Col, Form, Row, Stack} from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import {buildName} from "../../model/form.utils";
import {Mission} from "../../model/models";
import CustomFieldArray from "./CustomFieldArray";
import CustomField from "./CustomField";
import FieldTags from "./FieldTags";

interface Props {
    namespace?: string
}

const handlePaste = (pasteIndex: number, name: string, values: string[], form: FormikProps<any>) => (e: ClipboardEvent) => {
    e.preventDefault();
    const content = e.clipboardData.getData('Text') || ''
    const newValues = content.split(/[\n\r]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s !== "")

    // replace value at pasteIndex by the newValues array
    if (newValues.length > 0 && values.length > 0) {
        newValues[0] = values[pasteIndex] + newValues[0]
        values.splice(pasteIndex, 1, ...newValues)
    }
    form.setFieldValue(name, [...values], true);
    form.setFieldTouched(name, true)
}

const InputMission = ({namespace}: Props) => {
    const names = {
        tasks: buildName<Mission>(namespace, "tasks"),
        skills: buildName<Mission>(namespace, "skills"),
        startDate: buildName<Mission>(namespace, "startDate"),
        endDate: buildName<Mission>(namespace, "endDate"),
        company: buildName<Mission>(namespace, "company"),
        poste: buildName<Mission>(namespace, "poste"),
        description: buildName<Mission>(namespace, "description"),
        location: buildName<Mission>(namespace, "location")
    }

    return (
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId={names.startDate}>
                        <Form.Label>Date de début</Form.Label>
                        <CustomField name={names.startDate} type="date" required/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId={names.endDate}>
                        <Form.Label>Date de fin</Form.Label>
                        <CustomField name={names.endDate} type="date"/>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId={names.company}>
                <Form.Label>Entreprise</Form.Label>
                <CustomField name={names.company} required/>
            </Form.Group>
            <Form.Group controlId={names.poste}>
                <Form.Label>Poste</Form.Label>
                <CustomField name={names.poste} required/>
            </Form.Group>
            <Form.Group controlId={names.description}>
                <Form.Label>Description <span style={{color: 'red'}}>*</span></Form.Label>
                <CustomField name={names.description} as={TextareaAutosize} required/>
            </Form.Group>
            <Form.Group controlId={names.location}>
                <Form.Label>Lieu</Form.Label>
                <CustomField name={names.location}/>
            </Form.Group>
            <Form.Group controlId={names.tasks}>
                <Form.Label>Tâches</Form.Label>
                <Field name={names.tasks}>
                    {({field, form}: FieldProps) => (
                        <div>
                            <CustomFieldArray<string>
                                name={names.tasks}
                                values={field.value}
                                newValueBuilder={() => ''}
                                withLabels={false}
                                render={({name, index}) => (
                                    <CustomField name={name} required
                                                 onPaste={handlePaste(index, names.tasks, field.value, form)}/>
                                )}
                            />
                        </div>
                    )}
                </Field>
            </Form.Group>
            <Form.Group controlId={names.skills}>
                <Form.Label>Compétences</Form.Label>
                <FieldTags name={names.skills}/>
            </Form.Group>
        </Stack>
    );
}

export default InputMission
