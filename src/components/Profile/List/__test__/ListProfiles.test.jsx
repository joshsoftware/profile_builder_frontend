delete window.matchMedia;
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
});

import React from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { useGetProfileListQuery } from "../../../../api/profileApi";
import ListProfiles from "..";

import "@testing-library/jest-dom/extend-expect";

jest.mock("../../../../api/profileApi", () => ({
  useGetProfileListQuery: jest.fn(),
}));

describe("ListProfiles Component", () => {
  beforeEach(() => {
    useGetProfileListQuery.mockClear();
  });

  test("renders loading state initially", async () => {
    useGetProfileListQuery.mockReturnValue({
      isFetching: true,
      data: null,
      error: null,
    });

    render(<ListProfiles />);

    await waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  test("renders error state", async () => {
    useGetProfileListQuery.mockReturnValue({
      isFetching: false,
      data: null,
      error: "Failed to fetch data",
    });

    render(<ListProfiles />);
    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch list of Profile!")
      ).toBeInTheDocument();
    });
  });

  test("renders data correctly", async () => {
    const profiles = [
      {
        id: 1,
        name: "Abhishek Jain",
        email: "abhishek@example.com",
        years_of_experience: 0.5,
        primary_skills: ["go", "SQL", "ML"],
        is_current_employee: 1,
      },
    ];

    useGetProfileListQuery.mockReturnValue({
      isFetching: false,
      data: { profiles },
      error: null,
    });

    render(<ListProfiles />);

    await waitFor(() => {
      expect(screen.getByText("List of Profiles")).toBeInTheDocument();
      expect(screen.getByText("Abhishek Jain")).toBeInTheDocument();
      expect(screen.getByText("abhishek@example.com")).toBeInTheDocument();
      expect(screen.getByText("0.5")).toBeInTheDocument();
      expect(screen.getByText("SQL")).toBeInTheDocument();
      expect(screen.getByText("ML")).toBeInTheDocument();
      expect(screen.getByText("YES")).toBeInTheDocument();
    });
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
        name: "Saurabh Puri",
        email: "saurabh@example.com",
        years_of_experience: 3,
        primary_skills: ["angular", "python"],
        is_current_employee: 0,
      },
    ];

    useGetProfileListQuery.mockReturnValue({
      isFetching: false,
      data: { profiles },
      error: null,
    });

    render(<ListProfiles />);
    const dropdownTrigger = screen.getAllByRole("button", { name: /search/i });
    fireEvent.click(dropdownTrigger[0]);
    fireEvent.click(screen.getByPlaceholderText("Search name"));
    const searchInput = screen.getByPlaceholderText("Search name");
    fireEvent.change(searchInput, { target: { value: "Prajjwal" } });
    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(screen.queryByText("Saurabh Puri")).not.toBeInTheDocument();
      expect(screen.getByText("Prajjwal")).toBeInTheDocument();
    });
  });
});
