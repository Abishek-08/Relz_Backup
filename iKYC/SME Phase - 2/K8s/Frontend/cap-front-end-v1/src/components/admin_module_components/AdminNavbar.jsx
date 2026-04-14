import {
  Assignment,
  ContactsOutlined,
  Dashboard,
  Group,
  KeyRounded,
  Logout,
  People,
  QuestionAnswer,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import RelevantzLogo from "../../assets/user-module-assets/CAP LOGIN DEMO.png";
import { UserProfileAction } from "../../redux/actions/user_module_actions/UserProfileAction";
import { updatePasswordRequest } from "../../redux/actions/user_module_actions/userAction";
import "../../styles/admin_module_styles/AdminNavbarStyles.css";

function AdminNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const [logoutConfirmationModal, setLogoutConfirmationModal] = useState(false);

  const handleLogout = () => {
    console.log("logout");
    sessionStorage.removeItem("adminEmail");
    sessionStorage.removeItem("assessmentId");
    sessionStorage.removeItem("batchId");
    localStorage.removeItem("jwt");
    localStorage.removeItem("userType");
    localStorage.removeItem("loggedIn");
    sessionStorage.removeItem("assessment");
    sessionStorage.removeItem("otpExpiryTime");
    sessionStorage.removeItem("activeStep");

    dispatch(UserProfileAction({}));
    dispatch(
      updatePasswordRequest({ loading: false, error: null, success: false })
    );
    window.location.href = "/cap/login";
  };

  const isActiveRoute = (paths) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  const getActiveClass = (paths) => {
    return paths.some((path) => location.pathname === path)
      ? "active-dropdown & active"
      : "";
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
      className="position-fixed w-100"
      variant="light"
      id="admin-module-navbar-main-container"
    >
      <Navbar.Brand
        as={NavLink}
        to="/admindashboard"
        className="d-flex align-items-center"
      >
        <img
          src={RelevantzLogo}
          alt="companyLogo"
          id="admin-module-navbar-logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto admin-module-navbar-nav">
          <Nav.Link
            as={NavLink}
            to="/admindashboard"
            id="admin-dropdown"
            // className={({ isActive }) => (isActive ? "active" : "")}
            className={getActiveClass(["/admindashboard"])}
          >
            <Dashboard
              fontSize="small"
              style={{ height: "15px", marginBottom: "3px" }}
            />{" "}
            Dashboard
          </Nav.Link>

          <NavDropdown
            title={
              <>
                <People
                  fontSize="small"
                  style={{ height: "15px", marginBottom: "3px" }}
                />{" "}
                Users
              </>
            }
            id="admin-dropdown"
            className={getActiveClass([
              "/adduser",
              "/bulkuseruploadview",
              "/viewalluser",
              "/userRequest",
            ])}
          >
            <NavDropdown.Item
              as={NavLink}
              to="/adduser"
              className={({ isActive }) => (isActive ? "active" : "")}
              id="admin-module-linkcolor"
            >
              Add Individual User
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={NavLink}
              to="/bulkuseruploadview"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Add Bulk User
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={NavLink}
              to="/viewalluser"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              View User
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={NavLink}
              to="/userRequest"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Request
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title={
              <>
                <Group
                  fontSize="small"
                  style={{ height: "15px", marginBottom: "3px" }}
                />{" "}
                Batch
              </>
            }
            id="admin-dropdown"
            className={getActiveClass([
              "/viewAllBatch",
              "/adduserintobatch",
              "/batchview",
            ])}
          >
            <NavDropdown.Item
              as={NavLink}
              to="/viewAllBatch"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              View Batch
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={NavLink}
              to="/adduserintobatch"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Add user into batch
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title={
              <>
                <QuestionAnswer
                  fontSize="small"
                  style={{ height: "15px", marginBottom: "3px" }}
                />{" "}
                Questions
              </>
            }
            id="admin-dropdown"
            className={getActiveClass([
              "/addcodingquestion",
              "/allcodingquestion",
              "/addSingleQuestion",
              "/bulkQuestionUpload",
              "/allknowledgeQuestions",
              "/knowledgeReportAdminSide",
            ])}
          >
            {/* Skill Section */}
            <NavDropdown
              title="Skill"
              id="skill-dropdown"
              className="nav-dropdown-white"
            >
              <NavDropdown.Item
                as={NavLink}
                to="/addcodingquestion"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Add Coding Question
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/allcodingquestion"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Manage Skill Questions
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown.Divider />

            {/* Knowledge Section */}
            <NavDropdown
              title="Knowledge"
              id="knowledge-dropdown"
              className="nav-dropdown-white"
            >
              <NavDropdown.Item
                as={NavLink}
                to="/addSingleQuestion"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Add Single Question
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/bulkQuestionUpload"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Add Bulk Question
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/allknowledgeQuestions"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                View All Questions
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/knowledgeReportAdminSide"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Detailed Report
              </NavDropdown.Item>
            </NavDropdown>

            {/* <NavDropdown.Divider /> */}
          </NavDropdown>

          <NavDropdown
            title={
              <>
                <Assignment
                  fontSize="small"
                  style={{ height: "15px", marginBottom: "3px" }}
                />
                Assessment
              </>
            }
            id="admin-dropdown"
            className={getActiveClass([
              "/createassessmentstep",
              "/viewAllScheduling",
              "/skillassessmentschedulestep",
              "/skillquestionpickstep",
              "/proctorstep",
              "/knowledgequestionpickstep",
              "/knowledgeschedulestep",
            ])}
          >
            <NavDropdown.Item
              as={NavLink}
              to="/createassessmentstep"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Create Assessment
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={NavLink}
              to="/viewAllScheduling"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Scheduled Assessment
            </NavDropdown.Item>
          </NavDropdown>

          {/* <Nav.Link
            as={NavLink}
            to="/userRequest"
            id="admin-dropdown"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <ContactsOutlined fontSize="small" /> Requests
          </Nav.Link> */}
          <NavDropdown
            title={
              <>
                <Assignment
                  fontSize="small"
                  style={{ height: "15px", marginBottom: "3px" }}
                />{" "}
                Reports
              </>
            }
            id="admin-dropdown"
            className={getActiveClass([
              "/unmappeduserskillreport",
              "/knowledgeassessmentindividualreport",
              "/adminbatchreportview",
              "/knowledgeAssessmentreport",
              "/adminlearningdetailedreport/",
              "/codereport/",
            ])}
          >
            {/* Individual Report */}
            <NavDropdown title="Individual Report" id="individual-dropdown">
              <NavDropdown.Item
                as={NavLink}
                to="/individualreport"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Individual Report
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/unmappeduserskillreport"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Skill Report
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/knowledgeassessmentindividualreport"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Knowledge Report
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown.Divider />
            {/* </NavDropdown> */}

            {/* Batch Report */}
            <NavDropdown.Item
              as={NavLink}
              to="/adminbatchreportview"
              className={({ isActive }) => (isActive ? "active" : "")}
              // style={{ background: "#27235c", color: "white" }}
            >
              Batch Report
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link
            as={NavLink}
            to="/adminfeedback"
            id="admin-dropdown"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <ContactsOutlined fontSize="small" /> Feedback
          </Nav.Link>
        </Nav>
        <Nav className="admin-module-navbar-nav">
          <NavDropdown
            title={
              <Avatar
                src={user.profilePicture || UserProfileAction}
                // alt="Profile"
                className="admin-module-profile-avatar"
              />
            }
            id="admin-module-profile-dropdown"
            align="end"
          >
            <NavDropdown.Item as={NavLink} to="/adminupdatepasswordview">
              <KeyRounded fontSize="small" /> Update Password
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => setLogoutConfirmationModal(true)}>
              <Logout fontSize="small" /> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
      <Dialog
        open={logoutConfirmationModal}
        onClose={() => setLogoutConfirmationModal(false)}
        id="code-deletebox"
      >
        <DialogTitle id="codeDelete-confirm">Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to Logout this Application?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLogoutConfirmationModal(false)}
            id="cancelCode-deletebtn"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            id="deleteCode-deletebtn"
            autoFocus
            // endIcon={LogoutRoundedIcon}
          >
            <Logout />
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Navbar>
  );
}

export default AdminNavbar;
