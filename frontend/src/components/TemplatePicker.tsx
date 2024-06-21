import React from "react";
import {TemplatesByType} from "../contexts/ApiContext.tsx";
import {Template} from "../model/models.ts";
import {Button, Dropdown, DropdownButton} from "react-bootstrap";

interface Props {
    title?: string
    templatesByType: TemplatesByType
    onSelect: (t: Template) => void
}

const TemplatePicker = ({templatesByType, onSelect, title}: Props) =>
    <DropdownButton title={<><i className="bi bi-file-earmark-arrow-down"/>{title ? ' ' + title : null}</>} size="sm"
                    variant="secondary" className="d-inline dropdown-rounded">
        {Object.entries(templatesByType).map(([templateType, templates]) =>
            <React.Fragment key={templateType}>
                <Dropdown.Header>{templateType}</Dropdown.Header>
                {templates.map(t => <Dropdown.Item as={Button} key={t.id}
                                                   onClick={() => onSelect(t)}>{t.name}</Dropdown.Item>)}
            </React.Fragment>
        )}
    </DropdownButton>

export default TemplatePicker