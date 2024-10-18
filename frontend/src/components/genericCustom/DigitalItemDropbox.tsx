import Select from 'react-select';
import styles from '../FormComponents.module.css';

interface Props {
    setSelectedItem: any
}

function DigitalItemDropbox({ setSelectedItem }: Props) {

    //ToDo :  options to get from backend
    const options = [
        { value: 'option1', label: 'computer 1' },
        { value: 'option2', label: 'computer 2' },
        { value: 'option3', label: 'computer 3' },
        { value: 'option4', label: 'McBook' }
    ]

    return (
        <div className={styles.boxDigitalDropbox}>
            <Select
                placeholder='Description'
                isSearchable={true}
                options={options}
                onChange={value => setSelectedItem(value)}
            />
        </div>
    );
}

export default DigitalItemDropbox;

