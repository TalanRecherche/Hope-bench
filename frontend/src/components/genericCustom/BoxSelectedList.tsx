import { Button, Card } from 'react-bootstrap';
import styles from '../FormComponents.module.css';

interface Props {
    title: string,
    list: {
        id: string,
        name: string,
        checked: boolean
    }[]
};

const BoxSelectedList = ({ title, list }: Props) => {


    return (
        <Card className={styles.SelectedListSection}>
            <div className={styles.selectedListFieldTitle}> {title}</div>
            {list?.map((item, idx) => (
                <Button id={item.id} variant='link' key={idx} style={{ paddingLeft: 0}}
                onClick={() => {
                    const element = document.getElementById(item.id);
                    console.log(item.id);
                    element?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    }); 
                  }}
                >
                    <div className= {styles.selectedListItemLabel}> {item.name}</div>
                </Button>
            ))}

        </Card>
    )
}
export default BoxSelectedList;