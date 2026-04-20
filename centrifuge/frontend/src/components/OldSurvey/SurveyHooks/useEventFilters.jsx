import { useEffect, useState } from "react";
import {
  getAllEventCategoriesMinimal,
  getEventsByCategoryMinimal,
} from "../../../services/Services";
export function useEventFilters() {
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [eventId, setEventId] = useState(null);
  useEffect(() => {
    (async () => {
      const data = await getAllEventCategoriesMinimal();
      setCategories(data || []);
      if (data?.length) setCategoryId(data[0].eventCategoryId);
    })();
  }, []);
  useEffect(() => {
    if (!categoryId) return;
    (async () => {
      const data = await getEventsByCategoryMinimal(categoryId);
      setEvents(data || []);
      setEventId(data?.[0]?.eventId ?? null);
    })();
  }, [categoryId]);
  return {
    categories,
    events,
    categoryId,
    eventId,
    setCategoryId,
    setEventId,
  };
}
