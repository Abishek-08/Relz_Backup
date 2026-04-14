import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import  "../../styles/admin_module_styles/viewassessment.css";

const columns = [
  // { field: 'assessmentId', headerName: 'Si. No.', width: 150 },
  { field: 'assessmentName', headerName: 'Assessment Name', width: 200 },
  { field: 'instruction', headerName: 'Assessment Instruction', width: 300 },
];

export default function ViewAllAssessment() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get('http://localhost:8090/cap/admin/assessment');
        const assessments = response.data;

        // Map the assessments data to rows for DataGrid
        const rowsData = assessments.map((assessment) => ({
          id: assessment.assessmentId, // Use assessmentId as the id
          assessmentId: assessment.assessmentId, // Include assessmentId in the row data
          assessmentName: assessment.assessmentName,
          instruction: assessment.instruction,
        }));

        // Set the state with fetched rows
        setRows(rowsData);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        // Handle error if needed
      }
    };

    fetchAssessments();
  }, []);

  return (
    <div className="container-fluid" id='admin_viewallassessment_base'>
            <AdminNavbar />    
            <div className="container-fluid" id='admin_viewallassessment_body'>
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        // checkboxSelection
      />
    </div>
    </div>
    </div>
  );
}
