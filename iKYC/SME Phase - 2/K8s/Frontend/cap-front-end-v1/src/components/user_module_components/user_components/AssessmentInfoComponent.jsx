import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AssessmentInfoComponent = ({
  title,
  icon: Icon,
  completedCount,
  scheduledCount,
  tabValue,
  handleTabChange,
}) => {
  const navigate = useNavigate();

  const handleLinkToAssessmentPage = () => {
    navigate("/scheduledAsssessments");
  };

  const handleLinkToScoreCardPage = () => {
    navigate("/scorecard");
  };

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
            <Icon />
          </Avatar>
        }
        title={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              {title}
            </Typography>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                minHeight: "unset",
                ".MuiTabs-indicator": { backgroundColor: "white" },
                ".MuiTab-root": {
                  color: "rgba(255,255,255,0.7)",
                  "&.Mui-selected": { color: "white" },
                  minHeight: "unset",
                  padding: "6px 12px",
                },
              }}
            >
              <Tab label="Completed" value="completed" />
              <Tab
                onDoubleClick={handleLinkToAssessmentPage}
                label={
                  <Box position="relative">
                    Scheduled
                    {scheduledCount > 0 && (
                      <Box
                        component="span"
                        sx={{
                          position: "absolute",
                          top: -5,
                          right: -5,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#ff4081",
                        }}
                      />
                    )}
                  </Box>
                }
                value="scheduled"
              />
            </Tabs>
          </Box>
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Box mt={2} display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h3" sx={{ color: "white", fontWeight: "bold" }}>
            {tabValue === "completed" ? completedCount : scheduledCount}
          </Typography>
          {tabValue === "completed" ? (
            <button
              onClick={handleLinkToScoreCardPage}
              style={{ border: "none", backgroundColor: "transparent" }}
            >
              <Tooltip
                title="Click Here to Redirect"
                style={{ cursor: "pointer" }}
              >
                <CheckCircleOutlineIcon
                  sx={{ color: "#4caf50", fontSize: 40, ml: 2 }}
                />
              </Tooltip>
            </button>
          ) : (
            <button
              onClick={handleLinkToAssessmentPage}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <Tooltip
                title="Click Here to Redirect"
                style={{ cursor: "pointer" }}
              >
                <ScheduleIcon sx={{ color: "#2196f3", fontSize: 40, ml: 2 }} />
              </Tooltip>
            </button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssessmentInfoComponent;
