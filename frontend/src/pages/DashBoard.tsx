import { Navbar, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import styles from './Dashboard.module.css';
import { FormListData } from '../model/simulationDataModel';
import { useNavigate } from "react-router-dom";
import "./Dashboard.module.css";
/**
 * Renders the Dashboard page.
 */
function DashBoard() {

  const formList: FormListData[] = [
    { name: "MM-14894", format: "PDF", numberOfPages: 20, lastUpdate: new Date(), status: "À Commencer" },
    { name: "MM-14895", format: "DOCX", numberOfPages: 40, lastUpdate: new Date(), status: "Finalisé" },
    { name: "MM-14896", format: "PPT", numberOfPages: 30, lastUpdate: new Date(), status: "Commencé" },
    { name: "MM-14897", format: "PDF", numberOfPages: 50, lastUpdate: new Date(), status: "Commencé" }
  ];

  const navigate = useNavigate();
  const redirect = (link: string) => {
    navigate(link);
  };

  return (
    <>
      <Navbar bg="#E7E7E7" className={styles.navBar} >
        <div className={styles.formNav}>
          <div>
            <Button variant="underline" className={styles.formNavLabel}>À SOUMETTRE</Button>
          </div>
        </div>
      </Navbar>

      <form>
        <Table className={styles.table} bordered >
          <thead >
            <tr>
              <th>Nom du projet</th>
              <th>Format</th>
              <th>Nbr pages</th>
              <th>Dernière MAJ</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {formList?.map((item, idx) => (
              <tr  key={idx}>
                <td onClick={() => redirect("/form/generalTab")}>{item.name}</td>
                <td>{item.format}</td>
                <td>{item.numberOfPages}</td>
                <td>{item.lastUpdate.toDateString()}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </form>
    </>
  );
}

export default DashBoard;