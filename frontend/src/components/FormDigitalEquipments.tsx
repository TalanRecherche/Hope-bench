import CustomCheckboxList from './genericCustom/CustomCheckboxList';

const list = [
    { name: "Ordinateur portable", checked: true },
    { name: "Smatphone", checked: false },
    { name: "Email", checked: true },
    { name: "Visioconference", checked: true },
    { name: "Stockage", checked: true },
    { name: "Machine learning", checked: false }
]

const FormDigitalEquipments = () => (    
    <CustomCheckboxList 
    title='Equipement numérique utilisé'
    subTitle='Plusieurs choix sont possibles'
    list= {list}></CustomCheckboxList>    
)
export default FormDigitalEquipments;