/*
* @aurthor: sundhar raj s - 12106
* @since: 01-07-2024
* @version: 1.0
* @purpose: LoginPage.test.js
*/ 

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import LoginView from "../../../views/user_module_views/login_view/LoginView";
import { Provider } from "react-redux";
import store from "../../../redux/store/Store";

jest.mock("axios", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("LoginComponent", () => {
  it("renders login heading", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginView />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText("LOGIN")).toBeInTheDocument();
  });

  it("renders email input field", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginView />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders password input field", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginView />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders captcha input field", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginView />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByLabelText("captcha code")).toBeInTheDocument();
  });

  it("renders login button", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginView />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText("Login")).toBeVisible();
  });

  it("does not call handleSubmit when login button is disabled", () => {
    const handleSubmit = jest.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginView handleSubmit={handleSubmit} disabled={true} />
        </BrowserRouter>
      </Provider>
    );
    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
