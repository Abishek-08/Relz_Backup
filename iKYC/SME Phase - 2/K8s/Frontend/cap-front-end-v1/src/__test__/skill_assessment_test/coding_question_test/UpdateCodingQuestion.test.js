import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateCodingQuestion from "../../../components/skill_assessment_components/coding_question_components/UpdateCodingQuestion"; // Assuming UpdateCodingQuestion is the correct component to test

describe("Update Coding Question Component", () => {
  it("should render the Update Question button", () => {
    render(<UpdateCodingQuestion/>);
    const updateButton = screen.getByRole("button", { name: "Update Question" }); 
    expect(updateButton).toBeInTheDocument();
  });
});
