import { Card } from 'react-bootstrap';
import styles from '../InformationSource.module.css';

interface Props {
    title: string, 
    subTitle:string,
    list: {
        name: string,
        checked: boolean
    }[]
};

const CustomCheckboxList  = ({title, subTitle, list}: Props) => (
    <Card className={styles.marginTopLeft20} >
    <div style={{ margin: '0px 0px 0px 10px' }}>
        <div className={styles.required}> {title}</div>
        <div className={styles.SubText}> {subTitle}</div>
        {list?.map((item) => (
            <div>
                <input className={styles.marginRight10}
                    style={{ fontStyle: "normal" }}
                    type="checkbox"
                    id={item.name}
                    value={item.name}
                    checked={item.checked}
                    color='red'
                />
                <label>
                    {item.name}
                </label>
            </div>
        ))}
    </div>
</Card>
)
export default CustomCheckboxList;