import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Grid,
  InputLabel,
  InputAdornment,
  FormControl,
  Card,
  CardHeader,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Adminnavbar from "../../../views/admin_module_views/Adminnavbar";
import debounce from "lodash/debounce";
import { getFeedbackUser } from "../../../services/admin_module_services/BatchReportService";
import "../../../styles/admin_module_styles/feedbackUserDetails.css";
import ReplyIcon from "@mui/icons-material/Reply";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { X } from "@mui/icons-material";

const FeedbackUserDetails = () => {
  const { assessmentId } = useParams();
  const [feedbackDetails, setFeedbackDetails] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const fetchFeedbackDetails = async () => {
    try {
      const response = await getFeedbackUser(assessmentId);
      setFeedbackDetails(response.data);
      console.log(response);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(selectedFeedback);
  useEffect(() => {
    fetchFeedbackDetails();
  }, [assessmentId]);

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const filterFeedbacks = useCallback(
    debounce((searchTerm, filter, ratingFilter) => {
      let filtered = feedbackDetails;

      if (ratingFilter !== "All") {
        const ratingRange = {
          Poor: { min: 1, max: 2 },
          Average: { min: 2, max: 4 },
          Good: { min: 4, max: 5 },
        }[ratingFilter];

        filtered = filtered.filter((feedback) => {
          const rating = feedback.rating;
          return rating >= ratingRange.min && rating <= ratingRange.max;
        });
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (feedback) =>
            feedback.userName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            feedback.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredFeedback(filtered);
    }, 300),
    [feedbackDetails]
  );

  useEffect(() => {
    filterFeedbacks(searchTerm, filter, ratingFilter);
  }, [searchTerm, filter, ratingFilter, filterFeedbacks]);

  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearFilters = () => {
    setFilter("All");
    setRatingFilter("All");
    setSearchTerm("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewMore = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleBackButton = () => {
    navigate("/adminfeedback");
  };

  const pageCount = Math.max(
    1,
    Math.ceil(filteredFeedback.length / rowsPerPage)
  );

  const renderStars = (rating) => {
    if (rating === null || rating === undefined || isNaN(rating)) {
      return <Typography variant="body2">No rating found</Typography>;
    }

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 > 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <StarIcon key={`full-${index}`} sx={{ color: "gold" }} />
        ))}
        {halfStar > 0 && <StarIcon sx={{ color: "gold", opacity: 0.5 }} />}
        {[...Array(emptyStars)].map((_, index) => (
          <StarBorderIcon key={`empty-${index}`} sx={{ color: "gold" }} />
        ))}
      </>
    );
  };

  return (
    <>
      <div className="container-fluid d-flex m-0 p-0">
        <Adminnavbar />
      </div>
      <div style={{ padding: "20px", marginTop: "60px" }}>
        <Card
          sx={{
            color: "white",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            height: "50px",
            width: "90%",
            marginLeft: "45px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <CardHeader
            title={
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center" }}>
                ASSESSMENT NAME : {""}
                {feedbackDetails.length > 0
                  ? feedbackDetails[0].assessmentName.toUpperCase()
                  : "Not Found"}
              </Typography>
            }
          />
        </Card>

        <Box
          id="admin_module_userfeedback_02"
          sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2, mb: 2 }}>
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by username & email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: "action.active", fontSize: "small" }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearFilters}>
                    <ClearIcon
                      sx={{ color: "action.active", fontSize: "small" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="medium"
            sx={{
              width: "221px",
              "& .MuiOutlinedInput-root": {
                height: "38px",
                padding: "0 8px",
              },
            }}
          />
          <Select
            value={ratingFilter}
            onChange={handleRatingFilterChange}
            displayEmpty
            inputProps={{ "aria-label": "Rating Filter" }}
            variant="outlined"
            size="medium"
            sx={{
              width: "150px",
              height: "39px",
              "& .MuiSelect-select": {
                padding: "4px 8px",
              },
            }}>
            <MenuItem value="All">All Ratings</MenuItem>
            <MenuItem value="Poor">Poor (Less than 2)</MenuItem>
            <MenuItem value="Average">Average (2 to 4)</MenuItem>
            <MenuItem value="Good">Good (4 to 5)</MenuItem>
          </Select>

          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="rows-per-page">Rows per Page</InputLabel>
            <Select
              value={rowsPerPage}
              id="rows-per-page"
              onChange={handleChangeRowsPerPage}
              label="Rows per Page"
              size="small"
              displayEmpty
              inputProps={{ "aria-label": "rows per page" }}
              sx={{
                minWidth: 20,
                "& .MuiSelect-select": {
                  height: "31px",
                  padding: "8px",
                },
              }}
              startAdornment={
                <InputAdornment
                  position="start"
                  style={{ marginTop: "5px" }}></InputAdornment>
              }>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            size="small"
            onClick={handleBackButton}
            style={{ width: "107px", height: "38px" }}>
            Back
            <ReplyIcon sx={{ fontSize: "small", ml: 1 }} />
          </Button>
        </Box>

        {loading ? (
          <div id="admin_module_userfeedback_04">
            <CircularProgress />
          </div>
        ) : (
          <>
            {filteredFeedback.length === 0 ? (
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
              <TableContainer
                component={Paper}
                id="admin_module_userfeedback_05">
                <Table>
                  <TableHead style={{ backgroundColor: "#27235c" }}>
                    <TableRow>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          id="admin_module_userfeedback_06">
                          Username
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          id="admin_module_userfeedback_06">
                          Email
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          id="admin_module_userfeedback_06">
                          Rating
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          id="admin_module_userfeedback_06">
                          Feedback
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          id="admin_module_userfeedback_06"
                          sx={{
                            backgroundColor: "#1f1c59",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#1f1c59",
                            },
                          }}>
                          View More
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFeedback
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((feedback) => (
                        <TableRow key={feedback.id}>
                          <TableCell>{feedback.userName}</TableCell>
                          <TableCell>{feedback.userEmail}</TableCell>
                          <TableCell>{renderStars(feedback.rating)}</TableCell>
                          <TableCell>
                            {stripHtmlTags(feedback.feedback)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              sx={{ backgroundColor: "#1f1c59" }}
                              onClick={() => handleViewMore(feedback)}>
                              View More
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <Grid
                  item
                  xs={4}
                  container
                  justifyContent="center"
                  alignItems="center"
                  id="admin-module-feedback-viewdetails">
                  <Pagination
                    count={pageCount}
                    page={page + 1}
                    onChange={handleChangePage}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Grid>
              </TableContainer>
            )}
          </>
        )}

        {selectedFeedback && (
          <Modal open={isModalOpen} onClose={closeModal}>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  width: "100%",
                  maxWidth: "32rem",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  position: "relative",
                  border: "2px solid #e2e8f0",
                }}>
                <div
                  style={{
                    padding: "1.5rem",
                    background:
                      "linear-gradient(to right, #27235c, #4299e1, #27235c)",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                    position: "relative",
                  }}>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "center",
                    }}>
                    Feedback Details
                  </h2>
                  <button
                    onClick={closeModal}
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      color: "white",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}>
                    <CloseIcon />
                  </button>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  {selectedFeedback?.attributes?.length > 0 ? (
                    selectedFeedback.attributes.map((attr, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: "1.5rem",
                          padding: "1rem",
                          backgroundColor: "#f7fafc",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0",
                        }}>
                        <h3
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            color: "#434190",
                            marginBottom: "0.5rem",
                          }}>
                          {attr.attributeName}
                        </h3>
                        <p style={{ marginBottom: "0.5rem", color: "#2d3748" }}>
                          <span style={{ fontWeight: 500, color: "#1a202c" }}>
                            Options:
                          </span>{" "}
                          {attr.attributeType}
                        </p>
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "0.75rem",
                            borderRadius: "0.375rem",
                            border: "1px solid #7f9cf5",
                          }}>
                          <p style={{ color: "#4a5568" }}>
                            <span style={{ fontWeight: 500, color: "#5a67d8" }}>
                              Answers:
                            </span>{" "}
                            {stripHtmlTags(attr.attributeValue)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: "center", color: "#718096" }}>
                      No attributes available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default FeedbackUserDetails;
