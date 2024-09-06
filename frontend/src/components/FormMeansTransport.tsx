
import CustomCheckboxList from './genericCustom/CustomCheckboxList';

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
    <CustomCheckboxList 
    title='Moyen de transport proposés'
    subTitle='Plusieurs choix sont possibles'
    list= {list}></CustomCheckboxList>    
)
export default FormMeansTransport;