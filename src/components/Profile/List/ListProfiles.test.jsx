import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ListProfiles from "../List";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../../services/axios";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("../../../services/axios", () => ({
  get: jest.fn(),
}));

describe("ListProfiles Component", () => {
  beforeEach(() => {
    useQuery.mockClear();
    get.mockClear();
  });

  test("renders loading state initially", () => {
    useQuery.mockReturnValue({
      isFetching: true,
      data: null,
      error: null,
    });

    render(<ListProfiles />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders error state", () => {
    useQuery.mockReturnValue({
      isFetching: false,
      data: null,
      error: "Failed to fetch data",
    });

    render(<ListProfiles />);
    expect(
      screen.getByText("Failed to fetch list of Profile!")
    ).toBeInTheDocument();
  });

  test("renders data correctly", async () => {
    const profiles = [
      {
        key: "1",
        name: "Abhishek Jain",
        email: "abhishek@example.com",
        years_of_experience: 5,
        primary_skills: ["react", "nodejs"],
        is_current_employee: 1,
      },
    ];

    useQuery.mockReturnValue({
      isFetching: false,
      data: profiles,
      error: null,
    });

    render(<ListProfiles />);

    expect(screen.getByText("List of Profiles")).toBeInTheDocument();
    expect(screen.getByText("Abhishek Jain")).toBeInTheDocument();
    expect(screen.getByText("abhishek@example.com")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("REACT")).toBeInTheDocument();
    expect(screen.getByText("NODEJS")).toBeInTheDocument();
    expect(screen.getByText("YES")).toBeInTheDocument();
  });

  test("search functionality", async () => {
    const profiles = [
      {
        key: "1",
        name: "Prajjwal",
        email: "praj@example.com",
        years_of_experience: 5,
        primary_skills: ["react", "nodejs"],
        is_current_employee: 1,
      },
      {
        key: "2",
        name: "Saurabh puri",
        email: "saurabh@example.com",
        years_of_experience: 3,
        primary_skills: ["angular", "python"],
        is_current_employee: 0,
      },
    ];

    useQuery.mockReturnValue({
      isFetching: false,
      data: profiles,
      error: null,
    });

    render(<ListProfiles />);

    fireEvent.click(screen.getByPlaceholderText("Search name"));

    const searchInput = screen.getByPlaceholderText("Search name");
    fireEvent.change(searchInput, { target: { value: "Prajjwal" } });

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(screen.queryByText("Saurabh")).not.toBeInTheDocument();
      expect(screen.getByText("Prajjwal")).toBeInTheDocument();
    });
  });
});
