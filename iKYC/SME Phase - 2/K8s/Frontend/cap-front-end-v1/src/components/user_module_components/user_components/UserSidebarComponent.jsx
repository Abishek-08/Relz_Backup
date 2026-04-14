import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import "../../../styles/user_module_styles/user_dashboard_styles/SideBar.css";
import RelevantzLogo from "../../../assets/user-module-assets/RelevantzLogo 1.PNG.jpg";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

 /**
 
 * @author kirubakaran.b
 * @since 12-07-2024
 * @version 2.0
 */

function UserSidebarComponent() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleAssessmentTypeNavigation = (type) => {
    navigate(`/scheduled-assessments/${type}`);
  };
 

  return (
    <div id="app">
      <AppBar style={{ backgroundColor: "white" }}>
        <Toolbar>
          <img
            src={RelevantzLogo}
            alt="Logo"
            style={{ height: "35px", marginRight: "10px" }}
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{
              color: "#27235c",
              fontSize: "30px",
              marginLeft: "35%",
              fontFamily: "'Proxy Nova', sans-serif",
              fontWeight: "bold",
            }}
          >
            CAP
          </Typography>

          <div style={{ marginLeft: "auto" }}>
            <button
              className="user-module-LogoutButton"
              onClick={() => navigate("/login")}
            >
              <Logout />
            </button>
          </div>
        </Toolbar>
      </AppBar>

      <div
        style={{
          marginTop: "4rem",
          marginLeft: "-15px",
        }}
      >
        <Sidebar
          collapsible
          collapsed={collapsed}
          onToggle={toggleSidebar}
          style={{ height: "90vh" }}
        >
          <Menu>
            <MenuItem
              icon={<MenuOutlinedIcon />}
              onClick={toggleSidebar}
              style={{ textAlign: "center" }}
            >
              <h4>CAP</h4>
            </MenuItem>

            <MenuItem
              icon={<HomeOutlinedIcon />}
              onClick={() => navigate("/userdashboard")}
            >
              Home
            </MenuItem>

            <SubMenu
              icon={<EditNoteIcon />}
              label="Assessment"
              suffix={<span className="arrow" />}
            >
              <MenuItem
                icon={<ChevronRightIcon />}
                onClick={() => navigate("/quizLandingPage")}
              >
                Learning Assessment
              </MenuItem>
              <MenuItem
                icon={<ChevronRightIcon />}
                onClick={() => handleAssessmentTypeNavigation("/skill")}
              >
                Skill Assessment
              </MenuItem>
            </SubMenu>

            <SubMenu
              icon={<ReceiptOutlinedIcon />}
              label="View Scorecard"
              suffix={<span className="arrow" />}
            >
              <MenuItem icon={<ChevronRightIcon />}>Learning </MenuItem>
              <MenuItem icon={<ChevronRightIcon />}>Skill </MenuItem>
            </SubMenu>

            <MenuItem
              icon={<SwitchAccountIcon />}
              onClick={() => navigate("/updateprofile")}
            >
              UpdateProfile
            </MenuItem>

            <MenuItem icon={<LeaderboardIcon />}>ViewLeaderboard</MenuItem>
            <MenuItem
              icon={<ManageAccountsIcon />}
              onClick={() => navigate("/updatepasswordview")}
            >
              Change Password
            </MenuItem>
            <MenuItem
              icon={<ExitToAppIcon />}
              onClick={() => navigate("/login")}
            >
              Logout
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
    </div>
  );
}

export default UserSidebarComponent;
