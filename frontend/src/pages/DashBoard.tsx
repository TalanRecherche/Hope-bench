import { Navbar, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import styles from './Dashboard.module.css';
import { FormListData, FormStatus } from '../model/simulationDataModel';
import { useNavigate } from "react-router-dom";
import "./Dashboard.module.css";
import { useState } from "react";
import classNames from 'classnames';
import StartingModal from "../components/genericCustom/StartingModal";
/**
 * Renders the Dashboard page.
 */
function DashBoard() {

  //ToDo : Get the real list from Backend
  const formList: FormListData[] = [
    { name: "MM-14892", format: "PDF", numberOfPages: 20, lastUpdate: new Date(), status: FormStatus.submitted },
    { name: "MM-14892", format: "PDF", numberOfPages: 20, lastUpdate: new Date(), status: FormStatus.toStart },
    { name: "MM-14893", format: "PDF", numberOfPages: 20, lastUpdate: new Date(), status: FormStatus.toStart },
    { name: "MM-14894", format: "PDF", numberOfPages: 20, lastUpdate: new Date(), status: FormStatus.started },
    { name: "MM-14895", format: "DOCX", numberOfPages: 40, lastUpdate: new Date(), status: FormStatus.submitted },
    { name: "MM-14896", format: "PPT", numberOfPages: 30, lastUpdate: new Date(), status: FormStatus.toStart },
    { name: "MM-14897", format: "PDF", numberOfPages: 50, lastUpdate: new Date(), status: FormStatus.started },
    { name: "MM-14898", format: "DOCX", numberOfPages: 40, lastUpdate: new Date(), status: FormStatus.submitted },
    { name: "MM-14899", format: "PPT", numberOfPages: 30, lastUpdate: new Date(), status: FormStatus.started },
    { name: "MM-14900", format: "PDF", numberOfPages: 50, lastUpdate: new Date(), status: FormStatus.submitted }
  ];

  const [displayList, setDisplayList] = useState(formList.filter(x => x.status != FormStatus.submitted));
  const [currentEntry, setCurrentEntry] = useState('toBeSubmitted');

  const [selectedFormId, setSelectedFormId] = useState('');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const redirect = (link: string, e: any, status: string) => {
    setSelectedFormId(e.target.id);

    if (status == FormStatus.toStart) {
      setShowModal(true);
    }
    else {
      navigate(link, {
        state: {
          formName: selectedFormId,
          status: status
        }
      });
    }
  };

  const handleClose = () => {
    setShowModal(false)
    navigate("/form/generalTab", {
      state: {
        formName: selectedFormId,
        status: FormStatus.toStart //Modal opens only in this state
      }
    });
  }

  const showNonSubmitted = () => {
    setCurrentEntry('toBeSubmitted');

    setDisplayList(formList.filter(x => x.status != FormStatus.submitted));
  }
  
  const showSubmitted = () => {
    setCurrentEntry('submitted');
    setDisplayList(formList.filter(x => x.status == FormStatus.submitted));
  }

  return (
    <>
      <StartingModal open={showModal} onClose={handleClose} />

      <Navbar bg="#E7E7E7" className={styles.navBar} >
        <div className={styles.formNav}>
          <div>
            <Button variant="underline" className={classNames(styles.formNavLabel, (currentEntry == "toBeSubmitted") ? styles.formTabCurrentEntry : '')} onClick={showNonSubmitted}>À SOUMETTRE</Button>
            <Button variant="underline" className={classNames(styles.formNavLabel, (currentEntry == "submitted") ? styles.formTabCurrentEntry : '')} onClick={showSubmitted}>SOUMIS</Button>
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
            {displayList?.map((item, idx) => (
              <tr key={idx}>
                <td id={item.name} onClick={(e) => redirect("/form/generalTab", e, item.status)}>{item.name}</td>
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