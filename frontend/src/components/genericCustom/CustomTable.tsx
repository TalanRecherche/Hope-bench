import Table from 'react-bootstrap/Table';
import NumericInput from 'react-numeric-input';
import styles from '../InformationSource.module.css';
import Button from 'react-bootstrap/Button';

const itemlist = [
    { number: 3, name: "ChromeBook 310 " },
    { number: 2, name: "ChromeBook " },
    { number: 1, name: "ChromeBook 310 " }
];

const CustomTable = () => (

    <Table className={styles.table}>
        <tbody >
            {itemlist?.map((item) => (
                <tr>
                    <td ><NumericInput className={styles.numericInput} min={0} value={item.number} size={1} /></td>
                    <td >{item.name}</td>
                    <td ><Button variant="outline-primary" size="sm">x</Button></td>
                </tr>
            ))}
        </tbody>
    </Table>

);
export default CustomTable;
