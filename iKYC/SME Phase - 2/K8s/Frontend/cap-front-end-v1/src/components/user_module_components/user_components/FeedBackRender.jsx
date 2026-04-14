import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";

const FeedBackRender = ({
  field,
  questionNumber,
  handleDynamicFieldChange,
}) => {
  const textFieldStyle = {
    width: "100%",
    height: "40px",
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const inputType = (field.attributeType || "")
    .split(",")
    .map((type) => type.trim());

  const handleOptionChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    let updatedSelections;

    if (isChecked) {
      // Add the selected option
      updatedSelections = [...selectedOptions, value];
    } else {
      // Remove the deselected option
      updatedSelections = selectedOptions.filter((option) => option !== value);
    }

    // Check if the number of selected options exceeds the limit
    if (updatedSelections.length > 3) {
      toast.warn("You can select a maximum of 3 options");
    } else {
      setSelectedOptions(updatedSelections);
      handleDynamicFieldChange(field.attributeId, updatedSelections.join(","));
    }
  };

  const renderOptions = (options) =>
    options.map((option, index) => (
      <FormControlLabel
        key={index}
        value={option}
        control={
          <Checkbox
            checked={selectedOptions.includes(option)}
            onChange={handleOptionChange}
            value={option}
          />
        }
        label={option}
      />
    ));

  const renderRadioOptions = (options) =>
    options.map((option, index) => (
      <FormControlLabel
        key={index}
        value={option}
        control={<Radio />}
        label={option}
      />
    ));

  switch (inputType[0]) {
    case "PLAIN TEXT":
      return (
        <TextField
          required
          key={field.attributeId}
          label={`Q${questionNumber}: ${field.attributeName}`}
          type="text"
          fullWidth
          margin="normal"
          InputProps={{ style: textFieldStyle }}
          onChange={(e) =>
            handleDynamicFieldChange(field.attributeId, e.target.value)
          }
        />
      );

    case "SSQ":
      const ssqOptions = inputType.slice(1);
      return (
        <FormControl
          required
          key={field.attributeId}
          component="fieldset"
          margin="normal"
          fullWidth
        >
          <Typography variant="subtitle1" gutterBottom>
            {`Q${questionNumber}: ${field.attributeName}`}
          </Typography>
          <RadioGroup
            onChange={(e) =>
              handleDynamicFieldChange(field.attributeId, e.target.value)
            }
          >
            {renderRadioOptions(ssqOptions)}
          </RadioGroup>
        </FormControl>
      );

    case "MSQ":
      const msqOptions = inputType.slice(1);
      return (
        <FormControl
          required
          key={field.attributeId}
          component="fieldset"
          margin="normal"
          fullWidth
        >
          <Typography variant="subtitle1" gutterBottom>
            {`Q${questionNumber}: ${field.attributeName}`}
          </Typography>
          <FormGroup>{renderOptions(msqOptions)}</FormGroup>
        </FormControl>
      );

    case "YES OR NO":
      return (
        <FormControl
          required
          key={field.attributeId}
          component="fieldset"
          margin="normal"
          fullWidth
        >
          <Typography variant="subtitle1" gutterBottom>
            {`Q${questionNumber}: ${field.attributeName}`}
          </Typography>
          <RadioGroup
            onChange={(e) =>
              handleDynamicFieldChange(field.attributeId, e.target.value)
            }
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      );

    default:
      return null;
  }
};

export default FeedBackRender;
