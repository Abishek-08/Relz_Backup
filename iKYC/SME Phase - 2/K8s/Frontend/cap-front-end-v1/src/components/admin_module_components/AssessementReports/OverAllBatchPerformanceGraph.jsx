import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, CardHeader, Typography, Box, Grid } from "@mui/material";
import { getKnowledgeAssessmentReportGraphData, getOverAllBatchReport, getSkillAssessmentReportGraphData, unMappedUserGraphReport } from "../../../services/admin_module_services/Report_Service";

/**
 * @author ranjitha.rajram
 * @version 6.0
 * @returns 
 */
const OverAllBatchPerformanceGraph = () => {
  const [SkillAssessmentReportData, setSkillAssessmentReportData] = useState([]);
  const [KnowledgeAssessmentReportData, setKnowledgeAssessmentReportData] = useState([]);

  const fetchSkillAssessmentReportData = async () => {
    const response = await getOverAllBatchReport("skill");
    setSkillAssessmentReportData(response.data);
  };

  const fetchKnowledgeAssessmentReportData = async () => {
    const response = await getOverAllBatchReport("knowledge");
    setKnowledgeAssessmentReportData(response.data);
  };

  useEffect(() => {
    fetchSkillAssessmentReportData();
    fetchKnowledgeAssessmentReportData();
  }, []);

  const allBatchNames = Array.from(
    new Set([
      ...SkillAssessmentReportData.map((item) => item.batchName),
      ...KnowledgeAssessmentReportData.map((item) => item.batchName),
    ])
  );

  const getScoreForBatch = (data, batchName) => {
    const item = data.find((d) => d.batchName === batchName);
    return item ? item.overAllScore : 0;
  };

  const skillAssessmentData = allBatchNames.map((batchName) => ({
    batchName,
    score: getScoreForBatch(SkillAssessmentReportData, batchName),
  }));

  const knowledgeAssessmentData = allBatchNames.map((batchName) => ({
    batchName,
    score: getScoreForBatch(KnowledgeAssessmentReportData, batchName),
  }));

  const skillData = skillAssessmentData.map((item) => item.score);
  const knowledgeData = knowledgeAssessmentData.map((item) => item.score);

  const [unMappedSkillData, setUnMappedSkillData] = useState([]);
  const [unMappedKnowledgeData, setUnMappedKnowledgeData] = useState([]);
  const [unMappedLabels, setUnMappedLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await unMappedUserGraphReport();
        const data = response.data;

        const skillAssessmentPercentage = data.skillAssessmentPercentage;
        const knowledgeAssessmentPercentage = data.knowledgeAssessmentPercentage;

        setUnMappedSkillData([skillAssessmentPercentage]);
        setUnMappedKnowledgeData([knowledgeAssessmentPercentage]);

        const labels = ["Unbatch User"];
        setUnMappedLabels(labels);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const batchChartColors = ["#3f51b5", "#f50057"];
  const unbatchedChartColors = ["#00acc1", "#ff9800"];
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Overall Performance Report
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Batch Details
                </Typography>
              }
              sx={{ textAlign: "center", bgcolor: "#e8eaf6" }}
            />
            <Box sx={{ p: 2, height: "400px" }}>
              <BarChart
                series={[
                  {
                    data: skillData,
                    label: "Skill",
                    color: batchChartColors[0],
                  },
                  {
                    data: knowledgeData,
                    label: "Knowledge",
                    color: batchChartColors[1],
                  },
                ]}
                xAxis={[
                  {
                    data: allBatchNames,
                    scaleType: "band",
                    tickLabelStyle: {
                      textAnchor: "start",
                    },
                  },
                ]}

                margin={{ bottom: 60, left: 40, right: 10 }}
                sx={{ width: "100%", height: "100%" }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Unbatched User Details
                </Typography>
              }
              sx={{ textAlign: "center", bgcolor: "#e8eaf6" }}
            />
            <Box sx={{ p: 2, height: "400px" }}>
              {unMappedSkillData.length && unMappedKnowledgeData.length && (
                <BarChart
                  series={[
                    {
                      data: unMappedSkillData,
                      label: "Skill",
                      color: unbatchedChartColors[0],
                    },
                    {
                      data: unMappedKnowledgeData,
                      label: "Knowledge",
                      color: unbatchedChartColors[1],
                    },
                  ]}
                  xAxis={[{ data: unMappedLabels, scaleType: "band" }]}

                  margin={{ bottom: 60, left: 40, right: 10 }}

                  sx={{ width: "100%", height: "100%" }}
                />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default OverAllBatchPerformanceGraph;