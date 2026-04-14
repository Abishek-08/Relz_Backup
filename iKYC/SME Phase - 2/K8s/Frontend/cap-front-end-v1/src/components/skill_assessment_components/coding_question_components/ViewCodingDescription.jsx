import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { getCodingQuestion } from "../../../services/skill_assessment_services/coding_question_services/CodingQuestionService";
import "../../../styles/skill_assessment_styles/coding_question_styles/View.css";

/**
 * @author Vinolisha V - 12126, Prem M
 * @version 2.0
 * @since 04.09.2024
 */


const ViewCodingQuestion = (props) => {
  const [data, setData] = useState({});
  console.log(data);

  useEffect(() => {
    getCodingQuestion(props.id)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        document.getElementById("description_coding_question").innerHTML =
          res.data.questionDescription;
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.id]);

  const handleClose = () => {
    props.setFlag(false);
  };


  /**
   * This component contains the view description for the user to check the Qestion description,
   * it is read only
   */
  return (
    <Dialog open={props.flag} sx={{ color: grey }} maxWidth={"lg"} fullWidth>
      <DialogContent sx={{ p: 0, display: "flex", height: "80vh" }}>
        <Box
          sx={{
            position: "relative",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              marginLeft: "10px",
              padding: 2,
              overflowY: "auto",
              height: "100%",
            }}
          >
            <DialogTitle>
              <b>View Question Details</b>
            </DialogTitle>
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <Card id="code-viewtitle">
                  <CardHeader title={"Question Description"} />
                  <CardContent>
                    <div id="description_coding_question"></div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button onClick={handleClose} id="closeCode-btn">
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCodingQuestion;
