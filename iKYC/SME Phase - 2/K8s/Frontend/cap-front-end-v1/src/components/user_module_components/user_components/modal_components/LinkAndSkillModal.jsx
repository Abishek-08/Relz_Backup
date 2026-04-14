import React, { useState } from "react";
import { Button, Modal, TextField, Chip, Box, Typography, IconButton, Paper, Fade } from "@mui/material";
import { Autocomplete, createFilterOptions } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ValidateLinks } from "../../../../utils/user_module_utils/ValidateLinks";
import CloseIcon from "@mui/icons-material/Close";
import { Close, Code, GitHub, LinkedIn, Language } from "@mui/icons-material";
import { addUserSkillsAndLinks } from "../../../../services/user_module_service/ProfileService";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  outline: 'none',
  borderRadius: '15px',
  maxWidth: 600,
  width: '100%',
  margin: 'auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #25235C, #2196F3, #26298C)',
  },
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: 'linear-gradient(45deg, #25235C 30%, #2196F3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #2196F3 30%, #25235C 90%)',
  },
}));

const LinkAndSkillModal = ({ open, onClose, updateSkill }) => {
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const userId = user.userId;

  const initialFormData = {
    skills: [],
    gitHubLink: "",
    linkedIn: "",
    portfolio: "",
    user: { userId: userId },
  };

  const [skillAndLinkData, setSkillAndLinkData] = useState(initialFormData);

  const [allSkills, setAllSkills] = useState([
    "React", "Node.js", "JavaScript", "Python", "Java", "SQL",
  ]);

  const handleAddSkillAndLink = () => {
    if (skillAndLinkData.skills.length === 0) {
      toast.error("Skills field cannot be empty");
      return;
    }

    const errors = ValidateLinks(skillAndLinkData);
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    const skillsAsString = skillAndLinkData.skills.join(", ");
    const dataToSubmit = {
      ...skillAndLinkData,
      skills: skillsAsString,
    };

    addUserSkillsAndLinks(dataToSubmit)
      .then((response) => {
        updateSkill(response);
        toast.success("Skills and links added successfully");
        setSkillAndLinkData(initialFormData);
        onClose();
      })
      .catch((error) => {
        toast.error("Error adding skills and links");
      });
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillAndLinkData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option,
  });

  return (
    <StyledModal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <StyledPaper elevation={24}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <HeaderTypography variant="h5" style={{color:"#25235c"}}>
              <Code style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Add Skills and Links
            </HeaderTypography>
            <IconButton onClick={onClose} size="small">
              <Close style={{color:"#25235C"}}/>
            </IconButton>
          </Box>

          <Autocomplete
            multiple
            freeSolo
            options={allSkills}
            value={skillAndLinkData.skills}
            onChange={(event, newValue) => {
            setSkillAndLinkData((prevData) => ({
              ...prevData,
              skills: newValue,
            }));
            newValue.forEach((skill) => {
            if (!allSkills.includes(skill)) {
              setAllSkills((prevSkills) => [...prevSkills, skill]);
            }
            });
            }}
            filterOptions={filterOptions}
            renderInput={(params) => (
              <TextField {...params} label="Skills" variant="outlined" />
            )}
            renderTags={(value, getTagProps) =>
            value.map((option, index) => (
          <Chip
            label={option}
            {...getTagProps({ index })}
            onDelete={() => handleRemoveSkill(option)}
            deleteIcon={<CloseIcon />}
            sx={{ backgroundColor: "#e0f2f1", color: "#00695c" }}
          />
          ))
          }
        />

          <TextField
            label="GitHub Link"
            name="gitHubLink"
            value={skillAndLinkData.gitHubLink}
            onChange={(e) => setSkillAndLinkData({
              ...skillAndLinkData,
              gitHubLink: e.target.value,
            })}
            fullWidth
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: <GitHub color="action" style={{ marginRight: 8 }} />,
            }}
          />
          <TextField
            label="LinkedIn"
            name="linkedIn"
            value={skillAndLinkData.linkedIn}
            onChange={(e) => setSkillAndLinkData({
              ...skillAndLinkData,
              linkedIn: e.target.value,
            })}
            fullWidth
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: <LinkedIn color="action" style={{ marginRight: 8 }} />,
            }}
          />
          <TextField
            label="Portfolio"
            name="portfolio"
            value={skillAndLinkData.portfolio}
            onChange={(e) => setSkillAndLinkData({
              ...skillAndLinkData,
              portfolio: e.target.value,
            })}
            fullWidth
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: <Language color="action" style={{ marginRight: 8 }} />,
            }}
          />
          <Box display="flex" justifyContent="center" mt={2}>
            <StyledButton
              variant="contained"
              onClick={handleAddSkillAndLink}
              fullWidth
            >
              Submit
            </StyledButton>
          </Box>
        </StyledPaper>
      </Fade>
    </StyledModal>
  );
};

export default LinkAndSkillModal;