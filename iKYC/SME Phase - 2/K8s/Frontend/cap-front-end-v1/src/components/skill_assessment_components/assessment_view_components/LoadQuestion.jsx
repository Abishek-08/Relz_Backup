import { Box, Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "../../../styles/skill_assessment_styles/coding_question_styles/LoadQuestion.css";


const LoadQuestion = ({ isHelpActive, onNext }) => {

  // This useSelector gets the question description of the clicked or chosen question
  const description = useSelector((state) => state.code.questionDescription);

  // This useSelector gets the question title of the clicked or chosen question
  const title = useSelector((state) => state.code.questionTitle);

  //UseEffect Hook used in order to make dynamic HTML for description.
  // Which changes the coming data to HTML form
  useEffect(() => {
    document.getElementById("Coding_Question_description").innerHTML =
      description;
  }, [description]);

  if (!description) {
    // Display loading... if loading question takes time
    return <Typography variant="body1">Loading...</Typography>;
  }

  return (
    <Container
      id="loadQuestion-container"
      fixed
      sx={{
        height: "94Vh",
        marginTop: "0px",
        overflowY: "scroll",
        backgroundColor: "#ffff",
        wordWrap: "break-word",
      }}
    >
      <Grid>
        <Typography
          variant="h5"
          sx={{ fontWeight: "900", my: 2, position: "relative" }}
        >
          {title}
          {/* Conditionally render the help popup card */}
          {isHelpActive && (
            <Box sx={{ position: "relative", width: 225 }}>
              <Box
                sx={{
                  position: "absolute",
                  bottom: "100%",
                  left: "40%", 
                  transform: "translateX(-50%)", 
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderBottom: "10px solid rgba(0,0,0,0.9)",
                }}
              />
              <Card
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: 190,
                  backgroundColor: "rgba(0,0,0,0.9)",
                  fontSize: "12px",
                  color: "white",
                  boxShadow: 10,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  zIndex: 10,
                }}
              >
                <CardContent>
                  <Typography sx={{ fontSize: "17px", fontWeight: "bold", mb: 1 }}>
                    Attention: Question
                  </Typography>
                  <Typography>Read this question carefully.</Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 1,
                      color: "white",
                      borderColor: "white",
                      backgroundColor: "transparent",
                    }}
                    onClick={onNext}
                  >
                    Next
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Typography>
        <Typography id="Coding_Question_description" my={4}></Typography>
      </Grid>
    </Container>
  );
};

export default LoadQuestion;
