import { Navbar, Table, Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './Dashboard.module.css';
import { FormListData, FormStatus } from '../model/simulationDataModel';
import { useNavigate } from "react-router-dom";
import "./Dashboard.module.css";
import { useState } from "react";
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

  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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

  const handleSort = (column: keyof FormListData) => {
    const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(order);

    const sortedList = [...displayList].sort((a: FormListData, b: FormListData) => {
      const aValue = a[column];
      const bValue = b[column];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        return order === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }
      return 0; // Si les types ne correspondent pas
    });

    setDisplayList(sortedList);
  };


  return (
    <>
      <StartingModal open={showModal} onClose={handleClose} />

      <Navbar bg="#E7E7E7" className={styles.navBar} >
        <div className={styles.formNav}>
          <Container>

            {/* <Button variant="underline" className={classNames(styles.formNavLabel, (currentEntry == "toBeSubmitted") ? styles.formTabCurrentEntry : '')} onClick={showNonSubmitted}>À SOUMETTRE</Button>
            <Button variant="underline" className={classNames(styles.formNavLabel, (currentEntry == "submitted") ? styles.formTabCurrentEntry : '')} onClick={showSubmitted}>SOUMIS</Button> */}
            <Button
              variant="light"
              className={`me-1 ${currentEntry === "toBeSubmitted" ? styles.selectedButton : styles.unselectedButton}`}
              onClick={showNonSubmitted}
            >
              À SOUMETTRE
            </Button>
            <Button
              variant="light"
              className={`${currentEntry === "submitted" ? styles.selectedButton : styles.unselectedButton}`}
              onClick={showSubmitted}
            >
              SOUMIS
            </Button>
          </Container>
        </div>
      </Navbar>

      <form>
        <Table className={styles.table} bordered >
        <thead>
            <tr>
              <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                <i className="bi bi-sort-alpha-down" style={{ marginRight: '5px' }}></i>
                Nom du projet
              </th>
              <th onClick={() => handleSort("format")} style={{ cursor: "pointer" }}>
                <i className="bi bi-sort-alpha-down" style={{ marginRight: '5px' }}></i>
                Format
              </th>
              <th onClick={() => handleSort("numberOfPages")} style={{ cursor: "pointer" }}>
                <i className="bi bi-sort-numeric-down" style={{ marginRight: '5px' }}></i>
                Nbr pages
              </th>
              <th onClick={() => handleSort("lastUpdate")} style={{ cursor: "pointer" }}>
                <i className="bi bi-calendar" style={{ marginRight: '5px' }}></i>
                Dernière MAJ
              </th>
              <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                <i className="bi bi-flag" style={{ marginRight: '5px' }}></i>
                Statut
              </th>
            </tr>
          </thead>
          <tbody>
            {displayList?.map((item, idx) => (
              <tr key={idx}>
                <td id={item.name} onClick={(e) => redirect("/form/generalTab", e, item.status)}>{item.name}</td>
                <td >{item.format}</td>
                <td>{item.numberOfPages}</td>
                <td>{item.lastUpdate.toLocaleDateString('fr-FR')}</td>
                <td onClick={(e) => redirect("/form/generalTab", e, item.status)}>
                  {item.status === FormStatus.started ? (
                    <Button
                      className={`${styles.customButton} ${styles.buttonRed}`}
                    >
                      <i className={`bi bi-lightning-fill ${styles.iconSpacing}`}></i>Finaliser
                    </Button> // Rouge pour "started"
                  ) : item.status === FormStatus.toStart ? (
                    <Button
                      className={`${styles.customButton} `}
                    >
                      <i className={`bi bi-lightning-fill ${styles.iconSpacing}`}></i>Commencer
                    </Button>
                  ) : item.status === FormStatus.submitted ? (
                    <Button className={`${styles.customButton} ${styles.buttonGray}`}>
                      <i className={`bi bi-check-circle ${styles.iconSpacing}`}></i>Soumis
                    </Button> // Statut pour "submitted"
                  ) : (
                    <Button className={`${styles.customButton} ${styles.buttonGray}`}>
                      Statut inconnu
                    </Button> // Autre statut
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </form>
    </>
  );
}

export default DashBoard;