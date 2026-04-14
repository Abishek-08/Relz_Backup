import { Box, Button, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { isNull, isUndefined } from "lodash";
import React, { useEffect, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { useSelector } from "react-redux";
import { RingLoader } from "react-spinners";
import defaultPicture from "../../../assets/user-module-assets/DefaultProfileImage.png";
import Leaderboardgif from "../../../assets/user-module-assets/Leaderboardgif.gif";
import { getLeaderboard } from "../../../services/user_module_service/LeaderboardService";
import "../../../styles/user_module_styles/user_dashboard_styles/LeaderboardStyle.css";
import LeaderboardCard from "./LeaderboardCard";
import LeaderboardModal from "./LeaderboardModel";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterUserPosition, setFilterUserPosition] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const userDetails = useSelector(
    (state) => state.profileDetails.profileDetails || {}
  );

  useEffect(() => {
    setLoading(true);
    getLeaderboard()
      .then((response) => response.data)
      .then((data) => {
        setUsers(data);
        setLoading(false);
        setCurrentUser(
          data.find(
            (user) => user.user && user.user.userId === userDetails.userId
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching leaderboard data:", error);
        setLoading(false);
      });
  }, [userDetails.userId]);

  useEffect(() => {
    if (!isUndefined(currentUser) && !isNull(currentUser)) {
      setShowFireworks(true);
      setFilterUserPosition(
        users.findIndex(
          (user) => user.user && user.user.userId === userDetails.userId
        ) + 1
      );
    }
  }, [currentUser, userDetails.userId, users]);

  const sortedUsers = [...users].sort((a, b) => b.totalScore - a.totalScore);

  const topThreeUsers = sortedUsers.slice(0, 3);

  const otherUsers = sortedUsers
    .slice(3)
    .filter((user) => user.user?.userId !== userDetails.userId);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(otherUsers.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getUserRank = (user) => {
    const index = sortedUsers.findIndex(
      (u) => u.user.userId === user.user.userId
    );
    return index + 1; // Ranking is 1-based
  };

  const noUsersToDisplay =
    topThreeUsers.length === 0 && otherUsers.length === 0;

  const order = [1, 0, 2];
  const orderedTopUsers = [
    topThreeUsers[1], // Second user
    topThreeUsers[0], // First user
    topThreeUsers[2], // Third user
  ].filter(Boolean);

  const columns = [
    { field: "rank", headerName: "Rank", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "score", headerName: "Score", flex: 1 },
    { field: "technology", headerName: "Technology", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => [
        <Tooltip title="View" arrow key="view">
          <Button
            variant="contained"
            color="success"
            style={{
              size: "20px",
              width: "50px",
              height: "25px",
            }}
            onClick={() => handleView(row)}
          >
            View
          </Button>
        </Tooltip>,
      ],
    },
  ];

  const rows = users.map((user) => ({
    id: user.user?.userId || user.user?.userName,
    rank: getUserRank(user),
    // profile: user.user?.userImageData,
    name: user.user?.userName,
    score: `${user.totalScore}%`,
    technology: user.skillResults[0]?.language?.languageName || "N/A",
  }));

  const handleView = (details) => {
    const selectedUser = users.find((user) => user.user.userId === details.id);
    setSelectedUser(selectedUser);
    setModalOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setModalOpen(false);
    setSelectedUser(null); // Clear selected user data on close
  };

  return (
    <div id="leaderboard_full_page">
      {selectedUser && (
        <LeaderboardModal
          open={modalOpen}
          onClose={handleClose}
          userData={selectedUser}
        />
      )}
      <div id="leaderboard_container">
        <div id="leaderboard_main_content">
          {loading && (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center">
                <RingLoader color="#25235c" loading={true} size={100} />
                <Typography
                  variant="h5"
                  component="h2"
                  color="grey"
                  gutterBottom
                >
                  loading ...
                </Typography>
              </div>
            </div>
          )}
          {noUsersToDisplay ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <h4>No Rankings Yet</h4>
              <img src={Leaderboardgif} alt="no_record_found" />
            </div>
          ) : (
            <>
              <div id="usermodule_leaderboard_card_top-three">
                {orderedTopUsers.map((user, index) => (
                  <LeaderboardCard
                    key={user.user?.userId}
                    user={user.user}
                    rank={order[index]}
                    totalScore={user.totalScore}
                    place={index}
                  />
                ))}
              </div>

              <Box
                sx={{
                  width: "85%",
                  minHeight: "300px",
                  maxHeight: "300px",
                  display: "flex",
                  justifyContent: "center",
                  "& .MuiDataGrid-root": {
                    "--DataGrid-containerBackground": "#25235c", // Change background color
                    "--DataGrid-rowBorderColor": "rgba(224, 224, 224, 1)", // Row border color
                    "--DataGrid-cellOffsetMultiplier": "2", // Cell offset multiplier
                  },
                }}
              >
                <DataGrid
                  id="custom-header"
                  scrollbarSize={0}
                  rows={rows}
                  getRowId={(row) => row.id}
                  columns={columns}
                  pageSize={rowsPerPage}
                  rowsPerPageOptions={[5, 10]}
                  pageSizeOptions={
                    rows.length > 5 ? [5, 10, 25, 50, 100] : [5, 10]
                  }
                  onPageSizeChange={handleChangeRowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      color: "#ffffff", // Column headers text color
                      fontWeight: "bold", // Column headers font weight
                      fontSize: "1rem", // Column headers font size
                    },
                    backgroundColor: "white",
                    "& .super-app-theme--header": {
                      backgroundColor: "#27235c",
                      color: "white",
                    },
                    "& .MuiDataGrid-menuIconButton": {
                      color: "white",
                    },
                    "& .MuiDataGrid-sortIcon": {
                      color: "white",
                    },
                  }}
                />
              </Box>
            </>
          )}
        </div>
        {!noUsersToDisplay &&
          users.length > 0 &&
          !isUndefined(currentUser) &&
          !isNull(currentUser) && (
            <div id="leaderboard_right_card">
              <div>
                <h3 style={{ paddingTop: "30px" }}>Your Score</h3>
                {userDetails.userImageData ? (
                  <img
                    src={`data:image/jpeg;base64,${userDetails.userImageData}`}
                    alt={userDetails.userName}
                    className="img-fluid"
                    id="filteredUser_leaderboard_image"
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <img
                    src={defaultPicture}
                    alt={userDetails.userName}
                    className="img-fluid"
                    id="filteredUser_leaderboard_image"
                    style={{ borderRadius: "50%" }}
                  />
                )}
                <p
                  className="fw-semibold fs-5"
                  id="filteredUser_leaderboard_username"
                >
                  {userDetails.userName}
                </p>
                <p
                  className="fw-bold fs-4"
                  id="filteredUser_leaderboard_userscore"
                >
                  Score {currentUser.totalScore}%
                </p>
                <p
                  className="fw-bold fs-5"
                  id="filteredUser_leaderboard_userrank"
                >
                  Rank{" "}
                  {filterUserPosition > 0 ? filterUserPosition : "Better luck"}
                </p>
              </div>
            </div>
          )}
      </div>
      {showFireworks && <Fireworks autorun={{ speed: 2, duration: 3000 }} />}
    </div>
  );
}

export default Leaderboard;
