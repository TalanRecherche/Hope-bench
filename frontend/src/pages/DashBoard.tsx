import React, { useContext, useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {ApiContext} from "../contexts/ApiContext";

function DashBoard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {getBusinessPropositionFile} = useContext(ApiContext)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [businessPropositionFiles, setBusinessPropositionFiles] = useState([]);

  useEffect(() => {
    getBusinessPropositionFile(currentPage, 10)
      .then((data) => {
        setBusinessPropositionFiles(data.elements);
        setTotalPages(data.totalElements);
      })
      .catch((error) => console.error("Error:", error));
  }, [currentPage]);

  const goToNextPage = () => setCurrentPage((prev) => prev + 1);
  const goToPreviousPage = () => setCurrentPage((prev) => prev - 1);

  return (
    <Container>
      <h1>Dashboard</h1>
      <h2>Welcome {user.firstname} {user.lastname}</h2>
        <h3>Business Proposition to annotate:</h3>
      <ul>
        {businessPropositionFiles && businessPropositionFiles.map((file) => (
            <li key={file.id_business_proposition_file}>{file.file_name} {file.format}</li>
        ))}
        </ul>
      <div>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </Container>
  );
}

export default DashBoard;