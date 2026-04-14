import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import defaultPicture from "../../../assets/user-module-assets/DefaultProfileImage.png";

const LeaderboardModal = ({ open, onClose, userData }) => {
  if (!userData) return null; // Render nothing if there's no user data

  const { user, codingQuestions, totalScore } = userData;
  const { userName, userImageData, userEmail } = user;

  const codingQuestion = codingQuestions[0];
  const categoryName = codingQuestion?.category?.categoryName;
  const level = codingQuestion?.level;

  // Determine if user image data exists; use default image if not
  const avatarSrc = userImageData
    ? `data:image/jpeg;base64,${userImageData}`
    : defaultPicture;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "20px",
          padding: "20px",
          width: "90%",
          maxWidth: "800px",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        Assessment Details
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* User Profile Grid */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                alt={userName}
                src={avatarSrc}
                sx={{ width: 150, height: 150, margin: "0 auto", mb: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {userName}
              </Typography>
            </Box>
          </Grid>

          {/* User Details Grid */}
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "bold" }}
                    >
                      Email
                    </TableCell>
                    <TableCell>{userEmail}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "bold" }}
                    >
                      Category
                    </TableCell>
                    <TableCell>{categoryName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "bold" }}
                    >
                      Level
                    </TableCell>
                    <TableCell>{level}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "bold" }}
                    >
                      Total Score
                    </TableCell>
                    <TableCell>{totalScore}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          sx={{
            borderRadius: "20px",
            padding: "8px 20px",
            backgroundColor: "#27235c",
            "&:hover": {
              backgroundColor: "#97247e",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaderboardModal;
