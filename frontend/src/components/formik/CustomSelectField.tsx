import { useField} from "formik";
import { Form, FormCheckProps } from "react-bootstrap";


export interface Props extends FormCheckProps {
	name: string
  options: string[]
	isRequired?: boolean
}

const CustomSelectField = ({ label, options, isRequired, ...props }: Props) => {
    const [field, meta] = useField<string>(props);

    return (
      <Form.Group controlId={props.name}>
        <Form.Label>
            {label}
            {isRequired && <span style={{ color: 'red' }}> *</span>} {/* Conditionally render asterisk */}
        </Form.Label>
        <Form.Control as="select" {...field} required={isRequired}>
          <option value="">Select an option</option>
          {options.map((option: string) => (
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