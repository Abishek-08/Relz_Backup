/*
 * @author: S Sundhar Raj
 * @since: 16-07-2024
 * @version: 3.0
 * @purpose: ScheduledLearningAssessmentView.test.js
 */

import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../redux/store/Store";
import ScheduledLearningAssessmentView from "../../../views/user_module_views/scheduledassessment_view/ScheduledLearningAssessmentView";

jest.mock(
  "../../../services/user_module_service/ScheduleAssessmentsService.js",
  () => ({
    __esModule: true,
    default: {
      fetchLearningAssessments: jest.fn(),
      verifySecretKey: jest.fn(),
    },
  })
);

describe("ScheduledLearningAssessment", () => {
  it("renders scheduled learning assessments header", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ScheduledLearningAssessmentView />
        </BrowserRouter>
      </Provider>
    );
    expect(
      screen.getByText("Scheduled Learning Assessments")
    ).toBeInTheDocument();
  });

  it("renders filter by day input field", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ScheduledLearningAssessmentView />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByLabelText("Select Day")).toBeInTheDocument();
  });

  it("renders filter by type select field", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ScheduledLearningAssessmentView />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByLabelText("Select Type")).toBeInTheDocument();
  });

  it("renders assessment cards", () => {
    const assessmentsData = [
      {
        assessmentId: 1,
        assessmentName: "Assessment 1",
        assessmentDate: "2024-07-01",
        startTime: "10:00 AM",
        duration: 30,
        type: "Quick",
        status: "Active",
      },
      {
        assessmentId: 2,
        assessmentName: "Assessment 2",
        assessmentDate: "2024-07-02",
        startTime: "11:00 AM",
        duration: 60,
        type: "Moderate",
        status: "Inactive",
      },
    ];

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ScheduledLearningAssessmentView assessmentsData={assessmentsData} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getAllByRole("card")).toHaveLength(2);
  });

  it("calls handleTakeAssessment when take assessment button is clicked", () => {
    const handleTakeAssessment = jest.fn();
    const assessment = {
      assessmentId: 1,
      assessmentName: "Assessment 1",
      assessmentDate: "2024-07-01",
      startTime: "10:00 AM",
      duration: 30,
      type: "Quick",
      status: "Active",
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ScheduledLearningAssessmentView
            handleTakeAssessment={handleTakeAssessment}
          />
        </BrowserRouter>
      </Provider>
    );

    const takeAssessmentButton = screen.getByText("Take Assessment");
    fireEvent.click(takeAssessmentButton);

    expect(handleTakeAssessment).toHaveBeenCalledTimes(1);
    expect(handleTakeAssessment).toHaveBeenCalledWith(assessment);
  });

  it("renders secret key modal when take assessment button is clicked", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ScheduledLearningAssessmentView />
        </BrowserRouter>
      </Provider>
    );

    const takeAssessmentButton = screen.getByText("Take Assessment");
    fireEvent.click(takeAssessmentButton);

    expect(screen.getByText("Enter Secret Key")).toBeInTheDocument();
  });
});
