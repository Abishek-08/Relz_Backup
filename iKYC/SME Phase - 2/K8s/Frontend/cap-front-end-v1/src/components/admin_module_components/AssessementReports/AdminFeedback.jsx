import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import nodatafound from "../../../assets/admin-module-assets/no-data-found.jpg";
import Adminnavbar from "../../../views/admin_module_views/Adminnavbar";
import {
  Container,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  IconButton,
  Grid,
  Card,
  CardHeader,
} from "@mui/material";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { getFeedback } from "../../../services/admin_module_services/BatchReportService";
import { FeedbackAction } from "../../../redux/actions/admin_module_actions/FeedbackAction";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

const AdminFeedback = () => {
  const dispatch = useDispatch();
  const feedback = useSelector((state) => state.feedback?.feedback || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchFeedback = useCallback(async () => {
    try {
      const response = await getFeedback();
      console.log("Fetched feedback:", response.data);
      dispatch(FeedbackAction(response.data));
      console.log("Dispatched action:", FeedbackAction(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to the first page when changing rows per page
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedDate("");
    fetchFeedback(); // Refresh data if needed
  };

  const filteredFeedback = feedback.filter((item) => {
    if (filterBy === "name") {
      return item.assessmentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else if (filterBy === "date") {
      if (!selectedDate) return true; // return all items if no date is selected
      const selectedDateUnix = moment(selectedDate).unix();
      const assessmentDateUnix = moment(item.assessmentDate).unix();
      return assessmentDateUnix === selectedDateUnix;
    }
    return true; // return all items if no filter is applied
  });
  const pageCount = Math.max(1, Math.ceil(feedback.length / rowsPerPage));

  return (
    <>
      <div className="container-fluid d-flex m-0 p-0">
        <Adminnavbar />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "50px" }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Card
            sx={{
              color: "white",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              height: "50px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  FEEDBACK HISTORY
                </Typography>
              }
            />
          </Card>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,
              gap: 2,
              mt: 3,
            }}
          >
            <FormControl
              variant="outlined"
              sx={{ minWidth: 100 }}
              style={{ marginTop: "6px" }}
            >
              <InputLabel>Filter By</InputLabel>
              <Select
                value={filterBy}
                size="small"
                onChange={(e) => setFilterBy(e.target.value)}
                label="Filter By"
              >
                <MenuItem value="name">Assessment Name</MenuItem>
                <MenuItem value="date">Assessment Date</MenuItem>
              </Select>
            </FormControl>

            {filterBy === "name" ? (
              <TextField
                variant="outlined"
                placeholder="Search by Assessment Name"
                value={searchTerm}
                style={{ marginTop: "6px" }}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: "300px" }}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchTerm && (
                        <IconButton onClick={handleClearSearch} edge="end">
                          <ClearIcon />
                        </IconButton>
                      )}
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <TextField
                type="date"
                label="Select Date"
                size="small"
                style={{ marginTop: "6px" }}
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                sx={{ width: "300px" }}
              />
            )}
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-simple-select">
                Rows per Page
              </InputLabel>
              <Select
                value={rowsPerPage}
                id="demo-simple-select"
                onChange={handleChangeRowsPerPage}
                label="Rows per Page"
                size="medium"
                displayEmpty
                inputProps={{ "aria-label": "rows per page" }}
                sx={{
                  minWidth: 20,
                  "& .MuiSelect-select": {
                    height: "13px", // adjust the height to your liking
                    padding: "8px", // optional, adjust the padding if needed
                  },
                }}
                startAdornment={
                  <InputAdornment position="start" style={{ marginTop: "5px" }}>
                    {/* <Typography variant="body2">Rows:</Typography> */}
                  </InputAdornment>
                }
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {feedback.length === 0 ? (
            <div align="center" variant="body1">
              <img
                src={require("../../../assets/admin-module-assets/Assessment Loading.gif")}
                alt="Loading..."
                style={{ width: "400px", height: "250px" }}
              />
              <Typography variant="body1" align="center">
                No feedback found .
              </Typography>
            </div>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1f1c59" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Assessment Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Date
                    </TableCell>

                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                {filteredFeedback.length === 0 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <div align="center" variant="body1">
                          <img
                            src={require("../../../assets/admin-module-assets/Assessment Loading.gif")}
                            alt="Loading..."
                            style={{ width: "400px", height: "250px" }}
                          />
                          <Typography variant="body1" align="center">
                            No assessment found .
                          </Typography>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {filteredFeedback
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.assessmentId}>
                          <TableCell>{item.assessmentName}</TableCell>
                          <TableCell>
                            {format(
                              new Date(item.assessmentDate),
                              "dd MMM yyyy"
                            )}
                          </TableCell>

                          <TableCell>
                            <Button
                              component={Link}
                              to={`/feedbackuserdetails/${item.assessmentId}`}
                              variant="subtitle1"
                              sx={{
                                backgroundColor: "#1f1c59",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#1f1c59",
                                },
                              }}
                            >
                              View Feedback
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                )}
              </Table>
              <Grid
                item
                xs={4}
                container
                justifyContent="center"
                alignItems="center"
                id="admin-module-feedback-arrowbtn"
              >
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Grid>
            </TableContainer>
          )}
        </Container>
      </div>
    </>
  );
};

export default AdminFeedback;
