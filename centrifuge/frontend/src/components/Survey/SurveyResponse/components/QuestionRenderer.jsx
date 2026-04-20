import React from "react";
import CommentInput from "./controls/CommentInput";
import Dropdown from "./controls/DropDown";
import RadioGroup from "./controls/RadioGroup";
import CheckboxGroup from "./controls/CheckboxGroup";
import SliderRating from "./controls/SliderRating";
import HorizontalScaleRating from "./controls/HorizontalScaleRating";
import MatrixQuestion from "./controls/MatrixQuestion";

export default function QuestionRenderer({
  type,
  question,
  value,
  onChange,
  disabled,
  primaryColor = "#f4a261",
}) {
  switch (type) {
    case "comment":
      return (
        <CommentInput
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          primaryColor={primaryColor}
        />
      );

    case "dropdown":
      return (
        <Dropdown
          options={question?.surveyCheckBoxOptions || question?.options || []}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          primaryColor={primaryColor}
        />
      );

    case "radio":
      return (
        <RadioGroup
          options={question?.surveyCheckBoxOptions || question?.options || []}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          primaryColor={primaryColor}
        />
      );

    case "checkbox":
      return (
        <CheckboxGroup
          options={question?.surveyCheckBoxOptions || question?.options || []}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          disabled={disabled}
          primaryColor={primaryColor}
        />
      );

    case "slider":
      return (
        <SliderRating
          min={question?.scaleMin ?? 0}
          max={question?.scaleMax ?? 10}
          step={1}
          value={
            value !== null &&
            value !== undefined &&
            value !== "" &&
            Number.isFinite(Number(value))
              ? Number(value)
              : null
          }
          onChange={onChange}
          disabled={disabled}
          mode="slider"
          primaryColor={primaryColor}
          labels={question?.scaleLabels || []}
        />
      );

    case "rating":
      return (
        <HorizontalScaleRating
          min={question?.scaleMin ?? 1}
          max={question?.scaleMax ?? 5}
          labels={question?.scaleLabels || []}
          value={
            value !== null &&
            value !== undefined &&
            value !== "" &&
            Number.isFinite(Number(value))
              ? Number(value)
              : null
          }
          onChange={onChange}
          disabled={disabled}
          primaryColor={primaryColor}
          name={`scale-rating-${question?.surveyQuestionId ?? question?.id ?? question?._id}`}
        />
      );

    case "star":
      return (
        <SliderRating
          min={0}
          max={question?.scaleMax ?? 5}
          step={1}
          value={
            value !== null &&
            value !== undefined &&
            value !== "" &&
            Number.isFinite(Number(value))
              ? Number(value)
              : null
          }
          onChange={onChange}
          disabled={disabled}
          mode="stars"
          primaryColor={primaryColor}
          labels={question?.scaleLabels || []}
        />
      );

    case "matrix":
      return (
        <MatrixQuestion
          rows={question?.matrixQnLabels || question?.matrixRows || []}
          columns={question?.scaleLabels || []}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          disabled={disabled}
          primaryColor={primaryColor}
        />
      );

    default:
      return (
        <CommentInput
          question={question}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          primaryColor={primaryColor}
        />
      );
  }
}
