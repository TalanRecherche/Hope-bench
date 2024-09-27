import Table from 'react-bootstrap/Table';
import NumericInput from 'react-numeric-input';
import styles from '../FormComponents.module.css';
import Button from 'react-bootstrap/Button';
import { DigitalItemType } from '../../model/generalDataModel';

interface Props {
    tableItems: DigitalItemType[],
    removeItem?: any,
    updateItemCount?: any
}

const CustomTable = ({ tableItems, removeItem, updateItemCount }: Props) => {

    return (
        <Table>
            <tbody>
                {tableItems?.map((item, i) => (
                    <tr className={styles.tableItem} key={i}>
                        <td className={styles.tdNumericImput}>
                            <NumericInput className={styles.tdNumericImputContent} min={0} value={item.count} size={1} onChange={(e) => updateItemCount(e,i)} />
                        </td>
                        <td className={styles.tdItemName}>{item.name}</td>
                        <td className={styles.tdDelete}><Button className={styles.tdDeleteButton} onClick={() => removeItem(i)}>x</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
export default CustomTable;

