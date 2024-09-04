import { Card } from 'react-bootstrap';
import styles from './InformationSource.module.css';

const list = [
    { name: "Avion", checked: true },
    { name: "TGV", checked: false },
    { name: "Train intercités", checked: false },
    { name: "Voiture électrique", checked: true },
    { name: "Voiture thermique", checked: false },
    { name: "RER", checked: true },
    { name: "Metro", checked: false },
    { name: "Bus Thermique", checked: false },
    { name: "Vélo ou trot. électrique", checked: false },
    { name: "Vélo ou marche", checked: false },
]

const FormMeansTransport = () => (
    <Card className={styles.marginTopLeft20} >
        <div style={{ margin: '0px 0px 0px 10px' }}>
            <div className={styles.required}> Moyen de transport proposés</div>
            <div className={styles.SubText}> Plusieurs choix sont possibles</div>
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
export default FormMeansTransport;