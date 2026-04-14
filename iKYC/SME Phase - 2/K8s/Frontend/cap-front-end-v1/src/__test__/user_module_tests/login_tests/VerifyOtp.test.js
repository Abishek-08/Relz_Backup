/*
 * @aurthor: sundhar raj s - 12106
 * @since: 01-07-2024
 * @version: 1.0
 * @purpose: VerifyOtp.test.js
 */
import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import OtpView from "../../../views/user_module_views/login_view/OtpView";

jest.mock("axios", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("VerifyOtpComponent", () => {
  it("renders heading", () => {
    render(
      <Router>
        <OtpView />
      </Router>
    );

    // Check heading is present
    expect(screen.getByText("Verify Your OTP")).toBeInTheDocument();
  });

  it("check verify and login button present or not", () => {
    render(
      <Router>
        <OtpView />
      </Router>
    );

    // Check button present
    expect(screen.getByText("Verify and Login")).toBeInTheDocument();
  });

  it("Check for clear button", () => {
    render(
      <Router>
        <OtpView />
      </Router>
    );
    expect(screen.getByText("clear")).toBeInTheDocument();
  });

  it("Check for resent button", () => {
    render(
      <Router>
        <OtpView />
      </Router>
    );
    expect(screen.getByText("Resend")).toBeInTheDocument();
  });
});
