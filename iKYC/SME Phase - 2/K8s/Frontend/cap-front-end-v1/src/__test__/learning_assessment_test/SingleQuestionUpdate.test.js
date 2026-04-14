import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import axios from "axios";
import Single_Question_Update from "../../components/learningassessment_module_components/Single_Question_Update";

import axios from "axios";

jest.mock("axios");

const mockFetchQuestionById = jest.fn();
const mockUpdateQuestion = jest.fn();
const mockFetchTopics = jest.fn();
const mockFetchSubtopicsByTopicId = jest.fn();

axios.get.mockImplementation((url) => {
  if (url.includes("/learning/question")) {
    return mockFetchQuestionById(url);
  } else if (url.includes("/learning/topic")) {
    return mockFetchTopics(url);
  } else if (url.includes("/learning/subtopic")) {
    return mockFetchSubtopicsByTopicId(url);
  }
});

axios.put.mockImplementation((url, data) => {
  return mockUpdateQuestion(url, data);
});

describe("Single_Question_Update component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders component with fetched question data", async () => {
    const mockQuestionData = {
      data: [
        {
          question: {
            questionId: "1",
            complexity: "basic",
            content: "Sample question content",
            mark: 5,
            questionType: "mcq",
            subtopic: {
              subtopicId: "1",
              subtopicName: "Sample Subtopic",
            },
          },
          answers: [
            {
              optionId: 1,
              correctAnswer: 0,
              optionContent: "Option 1",
              optionMark: 1,
            },
            {
              optionId: 2,
              correctAnswer: 1,
              optionContent: "Option 2",
              optionMark: 2,
            },
          ],
        },
      ],
    };

    const mockTopicsData = {
      data: [
        { topicId: "1", topicName: "Sample Topic" },
        { topicId: "2", topicName: "Another Topic" },
      ],
    };

    const mockSubtopicsData = {
      data: [
        { subtopicId: "1", subtopicName: "Sample Subtopic" },
        { subtopicId: "2", subtopicName: "Another Subtopic" },
      ],
    };

    mockFetchQuestionById.mockResolvedValue(mockQuestionData);
    mockFetchTopics.mockResolvedValue(mockTopicsData);
    mockFetchSubtopicsByTopicId.mockResolvedValue(mockSubtopicsData);

    const { getByText, getByLabelText } = render(<Single_Question_Update />);

    await waitFor(() => {
      expect(getByText("Update Single Question")).toBeInTheDocument();
    });

    expect(getByLabelText("Complexity *")).toHaveValue("basic");
    expect(getByLabelText("Content *")).toHaveValue("Sample question content");
    expect(getByLabelText("Mark *")).toHaveValue("5");
    expect(getByLabelText("Question Type *")).toHaveValue("mcq");
  });

  test("handles form submission correctly", async () => {
    const mockUpdatedQuestion = {
      data: { message: "Question updated successfully" },
    };

    mockUpdateQuestion.mockResolvedValue(mockUpdatedQuestion);

    const { getByText, getByLabelText, getByRole } = render(
      <Single_Question_Update />
    );

    fireEvent.change(getByLabelText("Complexity *"), {
      target: { value: "intermediate" },
    });
    fireEvent.change(getByLabelText("Content *"), {
      target: { value: "Updated question content" },
    });
    fireEvent.change(getByLabelText("Mark *"), { target: { value: "10" } });
    fireEvent.change(getByLabelText("Question Type *"), {
      target: { value: "ssq" },
    });

    fireEvent.change(getByLabelText("Topic *"), { target: { value: "1" } });
    fireEvent.change(getByLabelText("Subtopic *"), { target: { value: "1" } });

    fireEvent.change(getByLabelText("Option 1 *"), {
      target: { value: "Option 1 updated" },
    });
    fireEvent.change(getByLabelText("Option 2 *"), {
      target: { value: "Option 2 updated" },
    });

    fireEvent.click(getByText("Update"));

    await waitFor(() => {
      expect(mockUpdateQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          question: expect.objectContaining({
            complexity: "intermediate",
            content: "Updated question content",
            mark: "10",
            questionType: "ssq",
            subtopic: expect.objectContaining({
              subtopicId: "1",
            }),
          }),
          answer: expect.arrayContaining([
            { optionContent: "Option 1 updated" },
            { optionContent: "Option 2 updated" },
          ]),
        })
      );
    });

    await waitFor(() => {
      expect(getByText("Question updated successfully!")).toBeInTheDocument();
    });
  });
});
