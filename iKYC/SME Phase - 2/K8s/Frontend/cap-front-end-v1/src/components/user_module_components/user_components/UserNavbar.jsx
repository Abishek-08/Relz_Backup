import { AccountCircle, Logout, Password } from "@mui/icons-material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import RelevantzLogo from "../../../assets/user-module-assets/CAP LOGIN DEMO.png";
import defaultPicture from "../../../assets/user-module-assets/DefaultProfileImage.png";
import { UserProfileAction } from "../../../redux/actions/user_module_actions/UserProfileAction";
import { updatePasswordRequest } from "../../../redux/actions/user_module_actions/userAction";
import "../../../styles/user_module_styles/user_dashboard_styles/UserNavbarStyles.css";

function CollapsibleExample() {
  const [openModalLogout, setOpenModalLogout] = useState(false);
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const dispatch = useDispatch();
  const location = useLocation();
  const hasUserImage = user?.userImageData;

  useEffect(() => {
    sessionStorage.setItem("userId", user.userId);
  }, [user.userId]);

  const openLogoutModal = () => {
    setOpenModalLogout(true);
  };

  const closeLogoutModal = () => {
    setOpenModalLogout(false);
  };

  const handleConfirmLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("jwt");
    localStorage.removeItem("userType");
    localStorage.removeItem("loggedIn");
    setOpenModalLogout(false);
    dispatch(UserProfileAction({}));
    dispatch(
      updatePasswordRequest({
        loading: false,
        error: null,
        success: false,
      })
    );

    window.location.href = "/cap/login";
  };

  const isScoreCardActive = () => {
    return (
      location.pathname === "/scorecard" ||
      location.pathname.startsWith("/codereport/") ||
      location.pathname.startsWith("/knowledgeDetailReport/")
    );
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="position-fixed"
      variant="dark"
      id="user_navbar_main_container"
    >
      <Navbar.Brand as={NavLink} to="/userdashboard">
        <img src={RelevantzLogo} alt="companyLogo" id="user_navbar_logo" />
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        style={{ backgroundColor: "whitesmoke" }}
      />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link
            as={NavLink}
            to="/userdashboard"
            className="text-light"
            id="nav_links"
          >
            <DashboardIcon style={{ marginBottom: "5px" }} /> Dashboard
          </Nav.Link>
          <Nav.Link
            id="nav_links"
            as={NavLink}
            to="/scheduledAsssessments"
            className="text-light"
          >
            <AssessmentIcon style={{ marginBottom: "5px" }} /> Assessment
          </Nav.Link>
          <Nav.Link
            id="nav_links"
            as={NavLink}
            to="/scorecard"
            className={`text-light ${isScoreCardActive() ? "active" : ""}`}
          >
            <ScoreboardIcon style={{ marginBottom: "5px" }} /> Scorecard
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/leaderboard"
            className="text-light"
            id="nav_links"
          >
            <LeaderboardIcon style={{ marginBottom: "8px" }} /> Leaderboard
          </Nav.Link>
        </Nav>
        <Nav className="me-3">
          <NavDropdown
            title={
              <img
                src={
                  hasUserImage
                    ? `data:image/jpeg;base64,${user.userImageData}`
                    : defaultPicture
                }
                alt="User Profile"
                id="user_profile_image_navbar"
              />
            }
            id="collapsible-nav-dropdown"
            align="end"
          >
            <NavDropdown.Item
              as={NavLink}
              to="/updateprofile"
              id="NavDropdown_Profile_button"
            >
              <AccountCircle /> Profile
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={NavLink}
              to="/updatepasswordview"
              id="NavDropdown_Profile_button"
            >
              <Password /> Update Password
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              onClick={openLogoutModal}
              id="NavDropdown_Profile_button"
            >
              <Logout /> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>

      <Dialog
        open={openModalLogout}
        onClose={closeLogoutModal}
        id="code-deletebox"
      >
        <DialogTitle id="codeDelete-confirm">Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to Logout this Application?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutModal} id="cancelCode-deletebtn">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            id="deleteCode-deletebtn"
            autoFocus
          >
            Logout
            <Logout />
          </Button>
        </DialogActions>
      </Dialog>
    </Navbar>
  );
}

export default CollapsibleExample;
