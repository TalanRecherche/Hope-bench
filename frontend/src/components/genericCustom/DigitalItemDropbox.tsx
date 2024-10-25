import Select from 'react-select';
import styles from '../FormComponents.module.scss';

interface Props {
    setSelectedItem: (item: any) => void;
    selectedItem: { value: string; label: string };
}

function DigitalItemDropbox({ setSelectedItem, selectedItem }: Props) {

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
                isClearable={true}
                options={options}
                value={selectedItem.label ? { value: selectedItem.value, label: selectedItem.label } : null} 
                onChange={value => setSelectedItem(value)}
            />
        </div>
    );
}

export default DigitalItemDropbox;

