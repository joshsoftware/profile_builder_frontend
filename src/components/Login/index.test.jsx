/* eslint-disable */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Login from ".";

// Mock the useGoogleLogin hook
jest.mock("@react-oauth/google", () => ({
  useGoogleLogin: jest.fn(),
}));

// Mock the useMutation hook from react-query
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

// Mock the useNavigate hook from react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock the post function
jest.mock("../../services/axios", () => ({
  post: jest.fn(),
}));

// Mock the post function
jest.mock("../../services/axios", () => ({
  post: jest.fn(),
}));

describe("Login Component", () => {
  let mockGoogleLogin;
  let mockMutate;
  let mockNavigate;

  beforeEach(() => {
    mockGoogleLogin = jest.fn();
    mockMutate = jest.fn();
    mockNavigate = jest.fn();

    useGoogleLogin.mockReturnValue(mockGoogleLogin);
    useMutation.mockReturnValue({ mutate: mockMutate });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders the login button", () => {
    render(<Login />);
    const loginButton = screen.getByRole("button", {
      name: /login with google/i,
    });
    expect(loginButton).toBeInTheDocument();
  });

  test("calls google login on button click", () => {
    render(<Login />);
    const loginButton = screen.getByRole("button", {
      name: /login with google/i,
    });
    fireEvent.click(loginButton);
    expect(mockGoogleLogin).toHaveBeenCalled();
  });

  test("calls mutate function on successful google login", () => {
    render(<Login />);
    const onSuccess = useGoogleLogin.mock.calls[0][0].onSuccess;
    const tokenResponse = { access_token: "fake_access_token" };

    onSuccess(tokenResponse);
    expect(mockMutate).toHaveBeenCalledWith({
      url: "/login",
      access_token: "fake_access_token",
    });
  });

  test("handles error in google login", () => {
    console.log = jest.fn(); // Mock console.log
    render(<Login />);
    const onError = useGoogleLogin.mock.calls[0][0].onError;
    const errorResponse = { error: "error_message" };

    onError(errorResponse);
    expect(console.log).toHaveBeenCalledWith("Error:", "error_message");
  });

  test("navigates to dashboard on successful mutation", async () => {
    render(<Login />);
    const onSuccess = useMutation.mock.calls[0][0].onSuccess;
    const response = { data: { token: "fake_token" } };

    onSuccess(response);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("logs error on mutation error", () => {
    console.log = jest.fn(); // Mock console.log
    render(<Login />);
    const onError = useMutation.mock.calls[0][0].onError;
    const error = new Error("mutation_error");

    onError(error);
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
