import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Menu,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Dropzone from "react-dropzone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchCategories,
  fetchLanguages,
  getReferenceDocumentUrl,
  uploadCodingQuestion,
  addCategory,
  addLanguage,
} from "../../../services/skill_assessment_services/coding_question_services/CodingQuestionService";
import {
  validateZipFile,
  validateForm,
} from "../../../utils/skill_assessment_utils/coding_question_utils/AddCodingQuestionValidation";
import "../../../styles/skill_assessment_styles/coding_question_styles/AddQuestion.css";
import {
  notifyError,
  notifySuccess,
} from "../../../constants/skill_assessment_constants/NotifyToasterConstants";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

/**
 * @author Prem M, SanjayKhanna, Vinolisha V, Srinivasan
 * @version 2.0
 * @since 04.09.2024
 */


const AddCodingQuestion = () => {
  const [data, setData] = useState({
    questionTitle: "",
    questionDescription: "",
    level: "",
    category: { categoryId: 0 },
  });
  const [fileData, setFileData] = useState([]);
  const [currentLangId, setcurrentLangId] = useState(0); // state to handle denote current language while upload zip file feature
  const [languages, setLanguages] = useState([]); // state to handle language dropdown
  const [categories, setCategories] = useState([]); // state to handle category dropdown
  const [loading, setLoading] = useState(false); // state to handle circular progress loading
  const [validationErrors, setValidationErrors] = useState({}); // state to handle validations
  const [openAddLanguage, setOpenAddLanguage] = useState(false); // state to handle add language
  const [openAddCategory, setOpenAddCategory] = useState(false); // state to handle add category
  const [anchorEl, setAnchorEl] = useState(null); // state to handle drop down of add language and add category
  const [langData, setLangData] = useState({ language: { languageId: 0 } }); // state to handle upload different language zip files
  const navigate = useNavigate();
  const referenceDocumentUrl = getReferenceDocumentUrl();

  // Use effect to get all languages and categories
  useEffect(() => {
    fetchLanguages()
      .then((res) => setLanguages(res.data))
      .catch((err) => console.log(err));
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Function will clear validation errors on all the fields when the fields suits the requirement
  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Function will take care of description and provides validation
  const handleDescriptionChange = (value) => {
    setData((prevData) => ({ ...prevData, questionDescription: value }));
    if (validationErrors.questionDescription) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.questionDescription;
        return newErrors;
      });
    }
  };

  // Function will take care of choosing of language to upload the zip files
  const handleLanguageChange = (e) => {
    const languageId = parseInt(e.target.value);
    setcurrentLangId(languageId);
    setLangData((prevData) => ({
      ...prevData,
      language: { languageId },
    }));

    if (validationErrors.language) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.language;
        return newErrors;
      });
    }
  };

  // Function to handle
  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    setData((prevData) => ({
      ...prevData,
      category: { ...prevData.category, categoryId },  
    }));
    if (validationErrors.category) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.category;
        return newErrors;
      });
    }
  };

  // Handles the choosing zip files based on language.
  const handleZipFileChange = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const validationResult = await validateZipFile(file);

    // Use a switch case based on validationResult.isValid
    switch (validationResult.isValid) {
      case true: // When validation succeeds
        const existingFileIndex = fileData.findIndex(
          (fileWithLang) => fileWithLang.languageId === currentLangId
        );

        switch (true) {
          case existingFileIndex >= 0:
            // Replace the existing file
            setFileData((prevFiles) => {
              const newFiles = [...prevFiles];
              newFiles[existingFileIndex] = { file, languageId: currentLangId };
              return newFiles;
            });
            break;

          case existingFileIndex === -1:
            setFileData((prevFiles) => [
              ...prevFiles,
              { file, languageId: currentLangId },
            ]);
            break;
          default:
            console.error("Error in file index handling");
        }

        setValidationErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.zipFile;
          return newErrors;
        });
        break;

      case false: // When validation fails
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          zipFile: validationResult.errorMessage,
        }));
        break;

      default:
        console.error("Unexpected validation result");
        break;
    }
  };

  // Handles to remove the chosen file
  const handleFileRemove = (index) => {
    setFileData((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm(
      data,
      fileData.length ? fileData[0].file : null,
      langData
    );
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      setLoading(false);
      return;
    }
    // Validate zip file(s)
    const validationResult = await validateZipFile(
      fileData.length ? fileData[0].file : null
    );
    if (!validationResult.isValid) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        zipFile: validationResult.errorMessage,
      }));
      setLoading(false);
      return;
    }

    // Proceed with form submission
    setLoading(true);
    const files = fileData.map((record) => record.file);
    const languages = fileData.map((record) => ({
      languageId: record.languageId,
    }));
    const formData = new FormData();
    formData.append("codingQuestion", JSON.stringify(data));
    formData.append("languages", JSON.stringify(languages));
    files.forEach((file) => formData.append("files", file));

    uploadCodingQuestion(formData)
      .then(() => {
        setLoading(false);
        notifySuccess("Coding question uploaded successfully!");
        setFileData([]);
        setTimeout(() => navigate("/allcodingquestion"), 3000);
      })
      .catch(() => {
        setLoading(false);
        notifyError("Error uploading coding question.");
        setTimeout(() => window.location.reload(), 3000);
      });
  };

  // Function which handles adding the new language
  const handleAddLanguage = (e) => {
    e.preventDefault();
    setOpenAddLanguage(false);
    addLanguage({ languageName: e.target.languageName.value })
      .then(() => {
        notifySuccess("Language added successfully!");
        setTimeout(() => window.location.reload(), 3000);
      })
      .catch(() => {
        notifyError("Error adding language");
        setTimeout(() => window.location.reload(), 3000);
      });
  };

  // Function which handles adding the new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    setOpenAddCategory(false);
    addCategory({
      categoryName: e.target.categoryName.value,
      language: { languageId: currentLangId },
    })
      .then(() => {
        notifySuccess("Category added successfully!");
        setTimeout(() => window.location.reload(), 3000);
      })
      .catch(() => {
        notifyError("Error adding category");
        setTimeout(() => window.location.reload(), 3000);
      });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (option) => {
    setAnchorEl(null);
    if (option === "addCategory") {
      setOpenAddCategory(true);
    } else if (option === "addLanguage") {
      setOpenAddLanguage(true);
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          fontFamily={"Times-New-Roman"}
          fontWeight="bold"
          textAlign="center"
          mb={4}
        >
          Add Skill Question
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Tooltip title="Add New Category and Language" placement="top-start">
            <Button
              variant="contained"
              onClick={handleMenuOpen}
              endIcon={<ArrowDropDownIcon />}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ bgcolor: "#060270", "&:hover": { bgcolor: "#0b4db0" } }}
            >
              Add
            </Button>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuSelect("addCategory")}>
              Add Category
            </MenuItem>
            <MenuItem onClick={() => handleMenuSelect("addLanguage")}>
              Add Language
            </MenuItem>
          </Menu>
        </Box>

        <ToastContainer />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={2} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={data.category.categoryId}
                  onChange={handleCategoryChange}
                  label="Category"
                  error={!!validationErrors.category}
                >
                  <MenuItem value={0} disabled>
                    Select Category
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.category && (
                  <Typography color="error" variant="caption">
                    {validationErrors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={2} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="level-label">Level</InputLabel>
                <Select
                  labelId="level-label"
                  name="level"
                  value={data.level}
                  onChange={handleDataChange}
                  label="Level"
                  error={!!validationErrors.level}
                >
                  <MenuItem value="" disabled>
                    Select your option
                  </MenuItem>
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
                {validationErrors.level && (
                  <Typography color="error" variant="caption">
                    {validationErrors.level}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label=" Question Title"
                name="questionTitle"
                value={data.questionTitle}
                onChange={handleDataChange}
                fullWidth
                error={!!validationErrors.questionTitle}
                helperText={validationErrors.questionTitle}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Description
              </Typography>
              <ReactQuill
                value={data.questionDescription}
                onChange={handleDescriptionChange}
                modules={modules}
              />
              {validationErrors.questionDescription && (
                <Typography color="error" variant="caption">
                  {validationErrors.questionDescription}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sx={{ ml: 1 }}>
              <Box>
                <Typography
                  variant="body2"
                  style={{ fontSize: 18, fontFamily: "Italic-bold" }}
                >
                  Please download the Zip file format to review and ensure
                  proper structure and format for effective Question Bank
                  development.{" "}
                  <a
                    href={referenceDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Here
                  </a>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4} sm={4} mt={1}>
              <FormControl fullWidth>
                <InputLabel id="language-label">Language</InputLabel>
                <Select
                  labelId="language-label"
                  value={currentLangId}  
                  onChange={handleLanguageChange} 
                  label="Language"
                  error={!!validationErrors.language}
                >
                  <MenuItem value={0} disabled>
                    Select Language
                  </MenuItem>{" "}
                  {/* Placeholder */}
                  {languages.map((lang) => (
                    <MenuItem key={lang.languageId} value={lang.languageId}>
                      {lang.languageName}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.language && (
                  <Typography color="error" variant="caption">
                    {validationErrors.language}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ ml: 23 }} mt={1}>
              <Dropzone
                onDrop={handleZipFileChange}
                accept=".zip"
                multiple={false}
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed #060270",
                      padding: 1,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: "#e8e8e8",
                      "&:hover": {
                        bgcolor: "#e8e8e9",
                      },
                    }}
                  >
                    <input {...getInputProps()} />
                    <CloudUploadIcon sx={{ fontSize: 35, color: "#060270" }} />
                    <br />
                    Drag and Drop or Click to Select one
                  </Box>
                )}
              </Dropzone>
              {validationErrors.zipFile && (
                <Typography color="error" variant="caption">
                  {validationErrors.zipFile}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              {fileData.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">
                    <b>Uploaded Files</b>
                  </Typography>
                  {fileData.map((fileWithLang, index) => (
                    <Paper
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        mt: 1,
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2">
                          Language:{" "}
                          {
                            languages.find(
                              (lang) =>
                                lang.languageId === fileWithLang.languageId
                            )?.languageName
                          }
                        </Typography>
                        <Typography variant="body2">
                          File Name: {fileWithLang.file.name}
                        </Typography>
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => handleFileRemove(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mr: 4 }}
              onClick={() => navigate("/allcodingquestion")}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ bgcolor: "#060270", "&:hover": { bgcolor: "#0b4db0" } }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog open={openAddLanguage} onClose={() => setOpenAddLanguage(false)}>
        <DialogTitle>Add Language</DialogTitle>
        <DialogContent>
          <form id="add-language-form" onSubmit={handleAddLanguage}>
            <TextField
              autoFocus
              margin="dense"
              id="languageName"
              label="Language Name"
              type="text"
              fullWidth
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddLanguage(false)}>Cancel</Button>
          <Button
            type="submit"
            form="add-language-form"
            variant="contained"
            sx={{ bgcolor: "#060270", "&:hover": { bgcolor: "#0b4db0" } }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddCategory} onClose={() => setOpenAddCategory(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <form id="add-category-form" onSubmit={handleAddCategory}>
            <TextField
              autoFocus
              margin="dense"
              id="categoryName"
              label="Category Name"
              type="text"
              fullWidth
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCategory(false)}>Cancel</Button>
          <Button
            type="submit"
            form="add-category-form"
            variant="contained"
            sx={{ bgcolor: "#060270", "&:hover": { bgcolor: "#0b4db0" } }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddCodingQuestion;
