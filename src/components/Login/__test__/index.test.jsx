import React from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useGoogleLogin } from "@react-oauth/google";
import { fireEvent, render, screen } from "@testing-library/react";

import Login from "..";

import "@testing-library/jest-dom/extend-expect";

// Mock the required modules
jest.mock("@react-oauth/google", () => ({
  useGoogleLogin: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  MemoryRouter: jest.requireActual("react-router-dom").MemoryRouter,
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
  useStore: jest.fn(),
}));

describe("Login Component", () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => callback({}));
    useStore.mockImplementation(() => ({}));
  });

  test("renders the h1 heading", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    expect(screen.getByText("Sign In With Google")).toBeInTheDocument();
  });

  test("calls login function when the button is clicked", () => {
    const mockLogin = jest.fn();
    useGoogleLogin.mockImplementation(() => mockLogin);
    const navigate = jest.fn();
    useNavigate.mockImplementation(() => navigate);
    const dispatch = jest.fn();
    useDispatch.mockImplementation(() => dispatch);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /Login With Google/i });
    fireEvent.click(button);

    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
});
