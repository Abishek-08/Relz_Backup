import { useEffect, useMemo, useState, useDeferredValue } from "react";
import {
  getSurveyQuestionsByEventCategoryId,
  getSurveyQuestionsByEventAndEventCategoryId,
} from "../../../services/Services";
export function usePreviousQuestions(categoryId, eventId) {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  useEffect(() => {
    if (!categoryId) return;
    (async () => {
      const res = eventId
        ? await getSurveyQuestionsByEventAndEventCategoryId(categoryId, eventId)
        : await getSurveyQuestionsByEventCategoryId(categoryId);
      setQuestions(res?.data || []);
    })();
  }, [categoryId, eventId]);

  const filtered = useMemo(() => {
    if (!deferredSearch) {
      return questions;
    }
    return questions.filter((q) =>
      q.surveyQuestion.toLowerCase().includes(deferredSearch.toLowerCase()),
    );
  }, [questions, deferredSearch]);

  return {
    filtered,
    setSearch,
  };
}
