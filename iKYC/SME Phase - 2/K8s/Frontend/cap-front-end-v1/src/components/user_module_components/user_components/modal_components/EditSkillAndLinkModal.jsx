import React, { useState, useEffect } from "react";
import { Modal, TextField, Button, Autocomplete, Chip, Box, IconButton, Typography } from "@mui/material";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { updateUserSkillsAndLinks } from "../../../../services/user_module_service/ProfileService";
import { Close, GitHub, LinkedIn, Language, Code } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { styled, keyframes } from "@mui/material/styles";
import { ValidateLinks } from "../../../../utils/user_module_utils/ValidateLinks";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  width: '90%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflowY: 'auto',
  animation: `${fadeIn} 0.3s ease-out`,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.light,
    borderRadius: '4px',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s',
    
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '10px 20px',
  transition: 'all 0.3s',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: '4px',
  borderRadius: '16px',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.15)',
  },
}));

const EditSkillAndLinksModal = ({ open, onClose, skillAndLink, onSave }) => {
  
   const user = useSelector((state) => state.profileDetails.profileDetails);
  const userId = user.userId;

  const [skillAndLinksData, setSkillAndLinksData] = useState({
    skillsId: "",
    skills: [],
    gitHubLink: "",
    linkedIn: "",
    portfolio: "",
    user: {
      userId: userId,
    },
  });

  const [availableSkills] = useState([
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
  ]);

  useEffect(() => {
    // Set initial state if skillAndLink prop changes
    if (skillAndLink) {
      const { skillsId, skills, gitHubLink, linkedIn, portfolio } =
        skillAndLink;
      const initialSkills = skills.split(","); // Split skills string into array
      setSkillAndLinksData({
        skillsId,
        skills: initialSkills,
        gitHubLink,
        linkedIn,
        portfolio,
        user: {
          userId: userId,
        },
      });
    }
  }, [skillAndLink, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkillAndLinksData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSkillsChange = (event, newValue) => {
    setSkillAndLinksData((prevState) => ({
      ...prevState,
      skills: newValue,
    }));
  };

  const handleUpdate = async () => {
    try {
      const { skillsId, skills, ...otherData } = skillAndLinksData;

      const updatedData = {
        ...otherData,
        skills: skills.join(","),
        skillsId: skillAndLink.skillsId,
      };

      const errors = ValidateLinks(updatedData);
      if (Object.keys(errors).length > 0) {
        Object.values(errors).forEach((error) => {
          toast.error(error);
        });
        return;
      }

      // Call API service to update skills and links data
      await updateUserSkillsAndLinks(skillsId, updatedData);
      toast.success("Skills and Links updated successfully!");
      onSave(updatedData);
      onClose();
    } catch (error) {
      toast.error("Error updating skills and links. Please try again.");
    }
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2" fontWeight="bold" style={{color:"#25235C"}}>
            <Code fontSize="large" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
            Edit Skills and Links
          </Typography>
          <IconButton onClick={onClose} size="small" color="primary">
            <Close style={{color:"#25235C"}}/>
          </IconButton>
        </Box>

        <Autocomplete
          multiple
          freeSolo
          options={availableSkills}
          value={skillAndLinksData.skills}
          onChange={handleSkillsChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <StyledChip
                key={index}
                label={option}
                {...getTagProps({ index })}
                onDelete={() => {
                  setSkillAndLinksData((prevState) => ({
                    ...prevState,
                    skills: prevState.skills.filter((skill, i) => i !== index),
                  }));
                }}
                deleteIcon={<CloseIcon />}
              />
            ))
          }
          renderInput={(params) => (
            <StyledTextField
              {...params}
              label="Skills"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <StyledTextField
          label="GitHub Link"
          name="gitHubLink"
          value={skillAndLinksData.gitHubLink}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: <GitHub color="action" style={{ marginRight: '8px' }} />,
          }}
        />
        <StyledTextField
          label="LinkedIn"
          name="linkedIn"
          value={skillAndLinksData.linkedIn}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: <LinkedIn color="action" style={{ marginRight: '8px' }} />,
          }}
        />
        <StyledTextField
          label="Portfolio"
          name="portfolio"
          value={skillAndLinksData.portfolio}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: <Language color="action" style={{ marginRight: '8px' }} />,
          }}
        />
        <Box mt={3} display="flex" justifyContent="flex-end">
          <StyledButton variant="contained" onClick={handleUpdate} style={{backgroundColor:"#25235C"}}>
            Save
          </StyledButton>
        </Box>
      </ModalContent>
    </StyledModal>
  );
};

export default EditSkillAndLinksModal;