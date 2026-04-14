import React from "react";
import { Typography, Grid, Avatar, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";

const ViewUserDetails = ({ user }) => {
  return (
    <Grid container spacing={3}>
      {/* User Profile Grid */}
      <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Avatar
            alt={user.userName}
            src={`data:image/jpeg;base64,${user.userImageData}`}
            sx={{ width: 150, height: 150, margin: '0 auto', mb: 2 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user.userName}</Typography>
          <Typography variant="body1" color="textSecondary">{user.userEmail}</Typography>
        </Box>
      </Grid>

      {/* User Details Grid */}
      <Grid item xs={12} md={8}>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Mobile Number</TableCell>
                <TableCell>{user.userMobile}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                <TableCell>{user.userGender}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Creation Date</TableCell>
                <TableCell>{user.userCreationDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Updation Date</TableCell>
                <TableCell>{user.userUpdationDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell>{user.userStatus}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default ViewUserDetails;