import { Card } from 'react-bootstrap';
import styles from '../FormComponents.module.scss';
import Form from 'react-bootstrap/Form';
import classNames from 'classnames';

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
                newList.splice(index, 1);
            }
            value.checked = checked;
            newList.push(name);
        }

        return newList;
    }
    return (
        <Card className={styles.checkboxListSection}>
            <div className={styles.checkboxListFieldTitleSection} >
                <div className={classNames(styles.checkboxListFieldTitle, styles.required)}> {title}</div>
                <div className={styles.checkboxListFieldSubTitle}> {subTitle}</div>
            </div>
            <div className={classNames(styles.labelSemiBold, styles.checkboxListItemSection)} >
                {list?.map((item, idx) => (
                    <Form.Check
                        className={styles.checkboxListItem}
                        key={idx}
                        inline
                        label={item.name}
                        type="checkbox"
                        id={item.id}
                        onChange={handleChange}
                    />
                ))}
            </div>

        </Card>
    )
}
export default CustomCheckboxList;