import { Card } from 'react-bootstrap';
import styles from '../InformationSource.module.css';
import Form from 'react-bootstrap/Form';

interface Props {
    title: string,
    subTitle: string,
    list: {
        id: string,
        name: string,
        checked: boolean
    }[],
    onDataSend: any
};

const CustomCheckboxList = ({ title, subTitle, list, onDataSend }: Props) => {
    let newList: string[] = [];

    function handleChange(e: any) {        
        newList = handleAdd(e.target.id, e.target.checked);
        onDataSend(newList);
    }

    function handleAdd(name: string, checked: boolean) {
        let value = list.find(l => l.id == name);

        if (value) {
            var index = newList.indexOf(name);
            
            if (index !== -1) {
                newList.splice(index,1);
            }
            value.checked = checked;
            newList.push(name);            
        }

        return newList;
    }
    return (
        <Card className={styles.marginTopLeft20} >
            <div style={{ margin: '0px 0px 0px 10px' }}>
                <div className={styles.required}> {title}</div>
                <div className={styles.SubText}> {subTitle}</div>
                {list?.map((item) => (
                    <div>
                        <div>
                            <Form.Check
                                inline
                                label={item.name}
                                type="checkbox"
                                id={item.id}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
export default CustomCheckboxList;