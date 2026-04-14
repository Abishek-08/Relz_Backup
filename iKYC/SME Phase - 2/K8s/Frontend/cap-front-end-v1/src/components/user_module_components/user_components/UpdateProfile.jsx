import BadgeIcon from "@mui/icons-material/Badge";
import BoyIcon from "@mui/icons-material/Boy";
import GirlIcon from "@mui/icons-material/Girl";
import { Box, Button, Modal, TextField, useMediaQuery } from "@mui/material";
import { IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import defaultPicture from "../../../assets/user-module-assets/DefaultProfileImage.png";
import "../../../styles/user_module_styles/user_dashboard_styles/ProfileViewStyle.css";
import "../../../styles/user_module_styles/user_dashboard_styles/UpdateProfile.css";
import {
  Attachment,
  CalendarMonthSharp,
  CameraAlt,
  Close,
  DeleteForever,
  Done,
  Edit,
  EditNote,
  GitHub,
  LinkOutlined,
  LinkedIn,
  PersonPin,
  Phone,
  School,
  Work,
  WorkspacePremium,
} from "@mui/icons-material";
import userWorkExperienceLogo from "../../../assets/user-module-assets/Organization.png";
import skills from "../../../assets/user-module-assets/Skills.jpg";
import userAcademicsLogo from "../../../assets/user-module-assets/college.jfif";
import { UserProfileAction } from "../../../redux/actions/user_module_actions/UserProfileAction";
import {
  fetchProfileInfomrations,
  updateProfileDetails,
  updateProfilePicture,
} from "../../../services/user_module_service/ProfileService";
import CertificationModal from "./modal_components/CertificationModal";
import DeleteModal from "./modal_components/DeleteModal";
import EditEducationModal from "./modal_components/EditEducationModal";
import EditSkillAndSkillModal from "./modal_components/EditSkillAndLinkModal";
import EditWorkExperienceModal from "./modal_components/EditWorkExpeienceModal";
import EducationModal from "./modal_components/EducationModal";
import LinkAndSkillModal from "./modal_components/LinkAndSkillModal";
import WorkExperienceModal from "./modal_components/WorkExperienceModal";
import { setProctoring } from "../../../redux/actions/user_module_actions/ProctoringAction";
import Tooltip from "@mui/material/Tooltip";
import { styled, useTheme } from "@mui/material/styles";
import { RingLoader } from "react-spinners";

/**
 * @author sathiyan.sivarajan
 * @since 08-07-2024
 * @version 1.0
 *
 * @author sundhar.soundhar
 * @since 30-07-2024
 * @version 5.0
 *
 * @author kirubakaran.b
 * @since 14-07-2024
 * @version 2.0
 */

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "24px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4),
  width: "90%",
  maxWidth: "600px",
  maxHeight: "95vh",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "linear-gradient(45deg, #25235C 30%, #2196F3 90%)",
  marginTop: theme.spacing(3),
  borderRadius: "30px",
  padding: "12px 24px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
    transition: "all 0.3s ease",
  },
  "& .MuiInputLabel-root": {
    transition: "all 0.3s ease",
  },
}));

function UpdateProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const [profileData, setProfileData] = useState({
    userId: 1,
    name: "",
    userName: "",
    userEmail: "",
    userMobile: "",
    profileImage: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [updatedProfileData, setUpdatedProfileData] = useState({
    userId: "",
    userName: "",
    userDOB: "",
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userMobile: "",
    userGender: "",
  });

  const [loading, setLoading] = useState(false);

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [openCertificationModal, setOpenCertificationModal] = useState(false);
  const [openEducationModal, setOpenEducationModal] = useState(false);
  const [openSkillModal, setOpenSkillModal] = useState(false);
  const [openWorkExperienceModal, setOpenWorkExperienceModal] = useState(false);
  const [educationDetails, setEducationDetails] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [selectedDeleteObject, setSelectedDeleteObject] = useState(null);
  const [openEditEducationModal, setOpenEditEducationModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [workexperience, setWorkExperience] = useState([]);
  const [selectedWorkExperience, setSelectedWorkExperience] = useState(null);
  const [openEditWorkExperienceModal, setOpenEditWorkExperienceModal] =
    useState(false);

  const [skillAndLink, setSkillAndLink] = useState([]);
  const [selectedSkillAndLink, setSelectedSkillAndLink] = useState(null);
  const [openEditSkillAndLinkModal, setOpenEditSkillAndLinkModal] =
    useState(false);
  const [certificateDetails, setCertificateDetails] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(setProctoring());
    setProfileData(user);
    setUpdatedProfileData({
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      userMobile: user.userMobile,
      userFirstName: user.userFirstName,
      userLastName: user.userLastName,
      userDOB: user.userDOB,
      userGender: user.userGender,
    });
  }, [user, dispatch]);

  // Calculate the maximum date (17 years ago)
  const now = new Date();
  const maxDate = new Date(
    now.getFullYear() - 17,
    now.getMonth(),
    now.getDate()
  )
    .toISOString()
    .split("T")[0];

  // Set the minimum date to January 1, 1980
  const minDate = "1980-01-01";

  useEffect(() => {
    const getWorkExperienceData = async () => {
      try {
        if (user.userId) {
          const data = await fetchProfileInfomrations(user.userId);
          setWorkExperience(data.workExperience);
          setSkillAndLink(data.skillAndLinks);
          setCertificateDetails(data.certifications);
          setEducationDetails(data.academicDetails);
        }
      } catch (error) {
        console.error("Error fetching work experience details:", error);
      }
    };

    getWorkExperienceData(); // Call the function defined above
  }, [user]);

  const updateProfile = (newExperience) => {
    setWorkExperience([...workexperience, newExperience]);
  };

  const updateEducation = (newEducation) => {
    setEducationDetails([...educationDetails, newEducation]);
  };

  const updateCertificate = (newCertificate) => {
    setCertificateDetails([...certificateDetails, newCertificate]);
  };

  const updateSkill = (newSkillAndLinks) => {
    setSkillAndLink([...skillAndLink, newSkillAndLinks]);
  };

  const handleDeleteEducation = (academicIdToDelete) => {
    const idPattern = /^(\d+)(\D+)$/;
    const match = academicIdToDelete.match(idPattern);
    if (match) {
      const id = parseInt(match[1], 10);
      const label = match[2];
      if (label === "academic") {
        setEducationDetails(prevDetails =>
          prevDetails.filter(record => record.academicId !== id)
        );
      }
      if (label === "workexperience") {
        setWorkExperience(prevDetails =>
          prevDetails.filter(record => record.workExperienceId !== id)
        );
      }
      if (label === "certifications") {
        setCertificateDetails(prevDetails =>
          prevDetails.filter(record => record.certificateId !== id)
        );
      }
      if (label === "skill") {
        setSkillAndLink(prevDetails =>
          prevDetails.filter(record => record.skillsId !== id)
        );
      }
    }
  };

  const fileInputRef = useRef(null);

  const handleCancelPreview = () => {
    setIsFileSelected(false);
    setPreviewImage(null);
  };

  const handleEditClick = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfileData({ ...updatedProfileData, [name]: value });
  };

  const handleFileChange = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/heic", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, HEIC, and GIF file types are allowed.");
      return;
    }
    setProfileImageFile(file);
    setIsFileSelected(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = () => {
    const mobileNumberRegex =
      /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;

    if (!mobileNumberRegex.test(updatedProfileData.userMobile)) {
      toast.error("Invalid mobile number format.");
      return;
    }

    if (updatedProfileData.userFirstName.length > 20) {
      toast.error("FirstName Must contain Less than 20 chars");
      return;
    }

    if (updatedProfileData.userLastName.length > 20) {
      toast.error("LastName Must contain Less than 20 chars");
      return;
    }

    setLoading(true);

    updateProfileDetails(updatedProfileData)
      .then((response) => {
        dispatch(UserProfileAction(response.data));
        setProfileData(user);
        setOpenModal(false);
        toast.success("Profile updated successfully!");
      })
      .catch((error) => {
        toast.error("Error Updating Profile.. Try Again..!");
      })
      .finally(() => {
        // Stop loading animation after 2 seconds (simulating delay)
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
  };

  const handleUpdateProfilePicture = async () => {
    if (!profileImageFile) {
      return;
    }
    const formData = new FormData();
    formData.append("file", profileImageFile);
    const userId = profileData.userId;
    try {
      const response = await updateProfilePicture(userId, formData);
      dispatch(UserProfileAction(response.data));
      setProfileData(response.data);
      setOpenModal(false);
      setIsFileSelected(false);
      setPreviewImage(null);

      // Convert the new image file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        // Update the user object in the Redux store
        dispatch(
          UserProfileAction({
            ...response.data,
            userImageData: base64String,
          })
        );
      };
      reader.readAsDataURL(profileImageFile);

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error("Error updating profile picture. Please try again.");
    }
  };

  const handlePreviewImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditEducationClick = (education) => {
    setSelectedEducation(education);
    setOpenEditEducationModal(true);
  };

  const handleEditWorkClick = (workexperience) => {
    setSelectedWorkExperience(workexperience);
    setOpenEditWorkExperienceModal(true);
  };

  const handleEditSkillAndLinkClick = (skillAndLink) => {
    setSelectedSkillAndLink(skillAndLink);
    setOpenEditSkillAndLinkModal(true);
  };

  const handleDeleteClick = (object) => {
    setSelectedDeleteObject(object);
    setOpenDeleteModal(true);
  };

  const handleDeleteEducationModalClose = () => {
    setOpenDeleteModal(false);
  };

  const handleEditEducationModalClose = () => {
    setOpenEditEducationModal(false);
    setSelectedEducation(null);
  };

  const handleEditWorkExperienceModalClose = () => {
    setOpenEditWorkExperienceModal(false);
    setSelectedWorkExperience(null);
  };

  const handleEditSkillAndLinkModalClose = () => {
    setOpenEditSkillAndLinkModal(false);
    setSelectedSkillAndLink(null);
  };

  const handleEducationUpdate = (updatedEducation) => {
    setEducationDetails((prevDetails) =>
      prevDetails.map((education) =>
        education.academicId === updatedEducation.academicId
          ? updatedEducation
          : education
      )
    );
  };

  const handleWorkExpereinceUpdate = (updatedWorkExperience) => {
    setWorkExperience((prevDetails) =>
      prevDetails.map((workexperience) =>
        workexperience.workExperienceId ===
        updatedWorkExperience.workExperienceId
          ? updatedWorkExperience
          : workexperience
      )
    );
  };

  const handleSkillAndLinkUpdate = (updatedSkillAndLink) => {
    setSkillAndLink((prevDetails) =>
      prevDetails.map((skillAndLink) =>
        skillAndLink.skillsId === updatedSkillAndLink.skillsId
          ? updatedSkillAndLink
          : skillAndLink
      )
    );
  };

  const handleGenderIcon = () => {
    if (
      profileData.userGender === "male" ||
      profileData.userGender === "Male"
    ) {
      return (
        <BoyIcon
          className="genderIcon"
          style={{ fontSize: "35px", marginLeft: "-7px" }}
        />
      );
    } else {
      return (
        <GirlIcon
          className="genderIcon"
          style={{ fontSize: "35px", marginLeft: "-7px" }}
        />
      );
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      className="container-fluid"
      id=""
      style={{ backgroundColor: "#f7f8fd", minHeight: "100vh" }}
    >
      <div>
        <div className="row" id="fixed_conatiner_update_profile_page_main">
          <div
            className="col-md-5 d-flex flex-column"
            style={{ marginTop: "5%", minWidth: "532px" }}
          >
            <div id="fixed_conatiner_update_profile_page">
              <div
                id="update_user_profile_container"
                className="container-fluid d-flex"
              >
                <div>
                  <div className="container-fluid">
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileInputChange}
                      accept="image/*"
                    />
                    {previewImage || user.userImageData ? (
                      <img
                        alt="Profile"
                        id="user_module_profile_image"
                        src={
                          previewImage ||
                          `data:image/jpeg;base64,${user.userImageData}`
                        }
                        onClick={handlePreviewImageClick}
                        style={{
                          cursor: "pointer",
                          width: "150px",
                          height: "150px",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <img
                        alt="Profile"
                        id="user_module_profile_image"
                        src={defaultPicture}
                        onClick={handleFileChange}
                        style={{
                          cursor: "pointer",
                          width: "150px",
                          height: "150px",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn"
                        id="camera_alt_button_update_profile"
                        onClick={handleFileChange}
                      >
                        <Tooltip title="Update Image">
                          <CameraAlt />
                        </Tooltip>
                      </button>
                    </div>
                  </div>

                  <div className="container justify-content-center d-flex column-gap-2 mt-3">
                    {isFileSelected && (
                      <button
                        className="btn"
                        onClick={handleUpdateProfilePicture}
                        id="submit_profile_picture_button_success"
                      >
                        <Done />
                      </button>
                    )}
                    {isFileSelected && (
                      <button
                        className="btn"
                        onClick={handleCancelPreview}
                        id="submit_profile_picture_button_cancel"
                      >
                        <Close />
                      </button>
                    )}
                  </div>

                  <Modal
                    open={showModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "30%",
                        maxWidth: 600,
                        maxHeight: 600,
                        minHeight: 600,
                        minWidth: 600,
                        bgcolor: "black",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        onClick={handleCloseModal}
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 8,
                          backgroundColor: "white",
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <img
                        alt="Preview"
                        src={
                          previewImage ||
                          `data:image/jpeg;base64,${user.userImageData}`
                        }
                        style={{ width: "600px", height: "600px" }}
                      />
                    </Box>
                  </Modal>
                </div>
                <div
                  className="d-flex flex-column"
                  id="user_profile_content_container"
                >
                  <div id="username_profile_picture_update_profile">
                    <p>{profileData.userFirstName}</p>
                  </div>
                  <div id="userEmail_profile_update_userEmail">
                    <h5>@{profileData.userName}</h5>
                  </div>
                  <div id="userEmail_profile_update_userEmail">
                    <h5>{profileData.userEmail}</h5>
                  </div>
                </div>
              </div>
              <div id="update_user_profile_container">
                <div
                  className="d-flex flex-column"
                  id="user_profile_content_container_two"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span id="personal_information_text">
                      &nbsp;&nbsp;Personal Details
                    </span>
                    <button
                      onClick={handleEditClick}
                      id="edit_button_update_user"
                    >
                      {" "}
                      <Tooltip title="Edit Profile Details">
                        <Edit
                          style={{
                            verticalAlign: "middle",
                            marginBottom: "10px",
                          }}
                        />
                      </Tooltip>
                    </button>
                  </div>
                  <br />

                  {/* user personal details */}
                  <div id="userEmail_profile_update_userDetails">
                    <p id="userEmail_profile_update_userDetails">
                      <PersonPin id="userEmail_profile_update_icons" />{" "}
                      <span>First Name : </span> {profileData.userFirstName}
                    </p>
                  </div>
                  <div id="userEmail_profile_update_userDetails">
                    <p id="userEmail_profile_update_userDetails">
                      <BadgeIcon id="userEmail_profile_update_icons" />{" "}
                      <span>Last Name : </span>
                      {profileData.userLastName}
                    </p>
                  </div>

                  <div id="userEmail_profile_update_userDetails">
                    <p id="userEmail_profile_update_userDetails">
                      {handleGenderIcon(profileData.userGender)}
                      <span>Gender : </span>
                      {profileData.userGender}
                    </p>
                  </div>
                  <div id="userEmail_profile_update_userDetails">
                    <p id="userEmail_profile_update_userDetails">
                      <Phone id="userEmail_profile_update_icons" />{" "}
                      <span>Mobile No : </span>
                      {profileData.userMobile}
                    </p>
                  </div>
                  <div id="userEmail_profile_update_userDetails">
                    <p id="userEmail_profile_update_userDetails">
                      <CalendarMonthSharp id="userEmail_profile_update_icons" />{" "}
                      <span>DOB : </span>
                      {profileData.userDOB}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-7" style={{ marginTop: "5%" }}>
            <div
              className="container-fluid"
              id="main-conatiner-update-profile-user"
            >
              <div className="container-fluid d-flex flex-column">
                <div className="row">
                  <div className="col-md-9">
                    <span id="user_profile_titles_card">
                      <School /> Education
                    </span>
                  </div>
                  <div className="col-md-3">
                    <button
                      id="user_profile_update_informations_in_cards_button"
                      onClick={() => setOpenEducationModal(true)}
                    >
                      + Add Education
                    </button>
                  </div>
                </div>
                <div>
                  {educationDetails.length === 0 && (
                    <p id="user_profile_update_informations_in_cards">
                      We believe in skills over pedigree; but go ahead and add
                      your education for those who don't.
                    </p>
                  )}
                  <div>
                    {educationDetails.map((education) => (
                      <div key={education.academicId}>
                        <div className="container-fluid d-flex mt-3">
                          <div>
                            <img
                              src={userAcademicsLogo}
                              alt=""
                              id="user_academics_logo_image"
                            />
                          </div>
                          <div className="container-fluid d-flex flex-column">
                            <div className="mb-1 d-flex justify-content-between">
                              <div>
                                <b>{education.instituteName}</b>
                              </div>
                              <div className="d-flex justify-content-end column-gap-3">
                                <Tooltip title="Delete Education Details">
                                  <button
                                    id="editNoteButton_user_profile"
                                    onClick={() => handleDeleteClick(education)}
                                  >
                                    <DeleteForever style={{ color: "red" }} />
                                  </button>
                                </Tooltip>
                                <Tooltip title="Edit Education Details">
                                  <button
                                    id="editNoteButton_user_profile"
                                    onClick={() =>
                                      handleEditEducationClick(education)
                                    }
                                  >
                                    <EditNote />
                                  </button>
                                </Tooltip>
                              </div>
                            </div>
                            <div>
                              {education.degree} - {education.stream}{" "}
                              <b>&#128967;</b>
                              {education.fromDuration} - {education.toDuration}{" "}
                              <b>&#128967;</b> CGPA: {education.cgpa}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="container-fluid"
              id="main-conatiner-update-profile-user"
            >
              <div className="container-fluid d-flex flex-column">
                <div className="row">
                  <div className="col-md-9">
                    <div id="user_profile_titles_card">
                      <Work /> Work experience
                    </div>
                  </div>
                  <div className="col-md-3">
                    <button
                      id="user_profile_update_informations_in_cards_button"
                      onClick={() => setOpenWorkExperienceModal(true)}
                    >
                      +Add Work
                    </button>
                  </div>
                </div>
                <div>
                  {workexperience.length === 0 && (
                    <p id="user_profile_update_informations_in_cards">
                      We believe in skills over pedigree; but go ahead and add
                      your education for those who don't.
                    </p>
                  )}
                  <div>
                    {workexperience.map((workexperience) => (
                      <div key={workexperience.workexperience}>
                        <div className="container-fluid d-flex mt-3">
                          <div>
                            <img
                              src={userWorkExperienceLogo}
                              alt=""
                              id="user_academics_logo_image"
                            />
                          </div>
                          <div className="container-fluid d-flex flex-column">
                            <div className="mb-1 d-flex justify-content-between">
                              <div>
                                <b>
                                  {workexperience.companyName} -{" "}
                                  {workexperience.role} - @
                                  {workexperience.location} (
                                  {workexperience.fromYear} -{" "}
                                  {workexperience.toYear} )
                                </b>
                              </div>
                              <div className="d-flex justify-content-end column-gap-3">
                                <Tooltip title="Delete Work Experience">
                                  <button
                                    id="editNoteButton_user_profile"
                                    onClick={() =>
                                      handleDeleteClick(workexperience)
                                    }
                                  >
                                    <DeleteForever style={{ color: "red" }} />
                                  </button>
                                </Tooltip>
                                <Tooltip title="Edit Work Experience">
                                  <button
                                    id="editNoteButton_user_profile"
                                    onClick={() =>
                                      handleEditWorkClick(workexperience)
                                    }
                                  >
                                    <EditNote />
                                  </button>
                                </Tooltip>
                              </div>
                            </div>
                            <div>Description: {workexperience.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Certification area */}
            <div
              className="container-fluid"
              id="main-conatiner-update-profile-user"
            >
              <div className="container-fluid d-flex flex-column">
                <div className="row">
                  <div className="col-md-9">
                    <span id="user_profile_titles_card">
                      <WorkspacePremium /> Certifications
                    </span>
                  </div>
                  <div className="col-md-3">
                    <button
                      id="user_profile_update_informations_in_cards_button"
                      onClick={() => setOpenCertificationModal(true)}
                    >
                      + Add Certification
                    </button>
                  </div>
                </div>
                <div>
                  {certificateDetails.length === 0 && (
                    <p id="user_profile_update_informations_in_cards">
                      We believe in skills over pedigree; but go ahead and add
                      your education for those who don't.
                    </p>
                  )}
                  {certificateDetails.map((certificateDetails) => (
                    <div key={certificateDetails.certificateId}>
                      <div className="container-fluid d-flex mt-3">
                        <div className="container-fluid d-flex flex-column">
                          <div className="mb-1 d-flex justify-content-between">
                            <div
                              className="d-flex align-items-center justify-content-between"
                              style={{ width: "100%" }}
                            >
                              <div className="d-flex column-gap-3">
                                <img
                                  src={`data:image/jpeg;base64,${certificateDetails.certificate}`}
                                  alt="CertificateImage"
                                  id="user_academics_logo_image_certificate"
                                />
                                <div className="d-flex flex-column">
                                  <table>
                                    <tr>
                                      <td>Certified In </td>
                                      <td>&nbsp;:&nbsp; </td>
                                      <td>
                                        {" "}
                                        {certificateDetails.certificateName}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Provider Name</td>
                                      <td>&nbsp;:&nbsp; </td>
                                      <td>
                                        {" "}
                                        {certificateDetails.institutionName}
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </div>

                              <div>
                                <Tooltip title="Detele Certification">
                                  <button
                                    id="editNoteButton_user_profile"
                                    onClick={() =>
                                      handleDeleteClick(certificateDetails)
                                    }
                                  >
                                    <DeleteForever style={{ color: "red" }} />
                                  </button>
                                </Tooltip>
                              </div>
                            </div>

                            <div className="d-flex justify-content-end column-gap-3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* links and skills area */}
            <div
              className="container-fluid"
              id="main-conatiner-update-profile-user"
            >
              <div className="container-fluid d-flex flex-column">
                <div className="row">
                  <div className="col-md-9">
                    <span id="user_profile_titles_card">
                      <LinkOutlined /> Link and Skill
                    </span>
                  </div>
                  <div className="col-md-3">
                    {skillAndLink.length === 0 && (
                      <button
                        id="user_profile_update_informations_in_cards_button"
                        onClick={() => setOpenSkillModal(true)}
                      >
                        +Add Skill & link
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  {skillAndLink.length === 0 && (
                    <p id="user_profile_update_informations_in_cards">
                      Add all the relevant skills and links that help you to
                      know well.
                    </p>
                  )}
                </div>
                {skillAndLink.map((skillAndLink) => (
                  <div key={skillAndLink.skillsId}>
                    <div className="container-fluid d-flex mt-3">
                      <div>
                        <img
                          src={skills}
                          alt=""
                          id="user_academics_logo_image"
                        />
                      </div>
                      <div className="container-fluid d-flex flex-column">
                        <div className="mb-1 d-flex justify-content-between">
                          <div>
                            <b>Skills : {skillAndLink.skills}</b>
                          </div>
                          <div className="d-flex justify-content-end column-gap-3">
                            <Tooltip title="Delete Skill/Links">
                              <button
                                id="editNoteButton_user_profile"
                                onClick={() => handleDeleteClick(skillAndLink)}
                              >
                                <DeleteForever style={{ color: "red" }} />
                              </button>
                            </Tooltip>
                            <Tooltip title="Edit Skill/Links">
                              <button
                                id="editNoteButton_user_profile"
                                onClick={() =>
                                  handleEditSkillAndLinkClick(skillAndLink)
                                }
                              >
                                <EditNote />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                        <div>
                          {skillAndLink.gitHubLink !== "" && (
                            <div>
                              <GitHub /> -
                              <a href={skillAndLink.gitHubLink}>
                                {skillAndLink.gitHubLink}
                              </a>
                            </div>
                          )}
                        </div>
                        <div>
                          {skillAndLink.linkedIn !== "" && (
                            <div>
                              <LinkedIn /> -{" "}
                              <a href={skillAndLink.linkedIn}>
                                {skillAndLink.linkedIn}
                              </a>
                            </div>
                          )}
                        </div>
                        <div>
                          {skillAndLink.portfolio !== "" && (
                            <div>
                              <Attachment /> -{" "}
                              <a href={skillAndLink.portfolio}>
                                {skillAndLink.portfolio}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <StyledModal open={openModal} onClose={handleModalClose}>
        <ModalContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              style={{ color: "#25235C" }}
            >
              <Edit
                fontSize={isMobile ? "large" : ""}
                style={{
                  marginBottom: "5px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                }}
              />
              Edit Profile
            </Typography>
            <IconButton onClick={handleModalClose} size="small">
              <Close style={{ color: "#25235C" }} />
            </IconButton>
          </Box>

          <StyledTextField
            label="First name"
            name="userFirstName"
            value={updatedProfileData.userFirstName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            inputProps={{ pattern: "[A-Za-z ]{1,}" }}
            error={!/^[A-Za-z ]+$/.test(updatedProfileData.userFirstName)}
            helperText={
              !/^[A-Za-z ]+$/.test(updatedProfileData.userFirstName)
                ? "Name should contain only alphabets"
                : ""
            }
          />

          <StyledTextField
            label="Last name"
            name="userLastName"
            value={updatedProfileData.userLastName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ pattern: "[A-Za-z ]{1,}" }}
            error={!/^[A-Za-z ]+$/.test(updatedProfileData.userLastName)}
            helperText={
              !/^[A-Za-z ]+$/.test(updatedProfileData.userLastName)
                ? "Name should contain only alphabets"
                : ""
            }
          />

          <StyledTextField
            label="Phone no"
            name="userMobile"
            value={updatedProfileData.userMobile}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ pattern: "[0-9]{10}" }}
            error={!/^[0-9]{10}$/.test(updatedProfileData.userMobile)}
            helperText={
              !/^[0-9]{10}$/.test(updatedProfileData.userMobile)
                ? "Phone number should be exactly 10 digits"
                : ""
            }
          />

          <StyledTextField
            label="DOB"
            name="userDOB"
            type="date"
            value={updatedProfileData.userDOB}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputProps: {
                min: minDate,
                max: maxDate,
              },
            }}
          />

          <Box display="flex" justifyContent="flex-end">
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleUpdateProfile}
              fullWidth
              style={{ backgroundColor: "#25235C" }}
            >
              {loading ? (
                <RingLoader color="#ffffff" loading={true} size={26} />
              ) : (
                "Save Changes"
              )}
            </StyledButton>
          </Box>
        </ModalContent>
      </StyledModal>

      {/* Existing modals */}
      <CertificationModal
        open={openCertificationModal}
        onClose={() => setOpenCertificationModal(false)}
        updateCertificate={updateCertificate}
      />

      <EducationModal
        open={openEducationModal}
        onClose={() => setOpenEducationModal(false)}
        updateEducation={updateEducation}
      />

      <LinkAndSkillModal
        open={openSkillModal}
        onClose={() => setOpenSkillModal(false)}
        updateSkill={updateSkill}
      />

      <WorkExperienceModal
        open={openWorkExperienceModal}
        onClose={() => setOpenWorkExperienceModal(false)}
        updateProfile={updateProfile}
      />

      {selectedEducation && (
        <EditEducationModal
          open={openEditEducationModal}
          onClose={handleEditEducationModalClose}
          education={selectedEducation}
          onSave={handleEducationUpdate}
        />
      )}

      {selectedWorkExperience && (
        <EditWorkExperienceModal
          open={openEditWorkExperienceModal}
          onClose={handleEditWorkExperienceModalClose}
          workexperience={selectedWorkExperience}
          onSave={handleWorkExpereinceUpdate}
        />
      )}

      {selectedSkillAndLink && (
        <EditSkillAndSkillModal
          open={openEditSkillAndLinkModal}
          onClose={handleEditSkillAndLinkModalClose}
          skillAndLink={selectedSkillAndLink}
          onSave={handleSkillAndLinkUpdate}
        />
      )}

      <DeleteModal
        open={openDeleteModal}
        onClose={handleDeleteEducationModalClose}
        deleteObject={selectedDeleteObject}
        onDelete={handleDeleteEducation}
      />
      <ToastContainer />
    </div>
  );
}

export default UpdateProfile;
