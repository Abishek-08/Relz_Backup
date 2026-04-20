import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import Table from "react-bootstrap/Table";

const Screenshot = () => {
  const elementRef = useRef(null);

  const [userList, setUserList] = useState([
    { id: 1, firstName: "Abishek", lastName: "K", empId: 12120 },
    { id: 1, firstName: "Abishek", lastName: "K", empId: 12120 },
    { id: 1, firstName: "Abishek", lastName: "K", empId: 12120 },
    { id: 1, firstName: "Abishek", lastName: "K", empId: 12120 },
    { id: 1, firstName: "Abishek", lastName: "K", empId: 12120 },
    { id: 1, firstName: "Abishek", lastName: "K", empId: 12120 },
  ]);

  const captureElement = async () => {
    if (elementRef.current) {
      // Using html2canvas
      const canvas = await html2canvas(elementRef.current);
      const image = canvas.toDataURL("image/png");

      // Or using html-to-image
      // const image = await htmlToImage.toPng(elementRef.current);

      // You can now download the image or display it
      const link = document.createElement("a");
      link.href = image;
      link.download = "screenshot.png";
      link.click();
    }
  };
  return (
    <div>
      <div
        ref={elementRef}
        style={{ border: "1px solid black", padding: "20px" }}
      >
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>EmpId</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.empId}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <button onClick={captureElement}>Capture Element</button>
    </div>
  );
};

export default Screenshot;
