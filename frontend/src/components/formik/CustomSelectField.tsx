import { Field , useField} from "formik";
import { FieldProps } from "formik/dist/Field";
import { Form, FormControlProps } from "react-bootstrap";


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

export default CustomSelectField