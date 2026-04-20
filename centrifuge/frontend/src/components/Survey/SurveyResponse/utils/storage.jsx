
const ANSWERS_PREFIX = "sr_answers_";
const ANON_KEY = "sr_anonymous_id";

export function persistAnswers(eventId, answersMap) {
  try {
    const obj = Object.fromEntries(answersMap);
    localStorage.setItem(ANSWERS_PREFIX + eventId, JSON.stringify(obj));
  } catch {}
}

export function restoreAnswers(eventId) {
  try {
    const raw = localStorage.getItem(ANSWERS_PREFIX + eventId);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return new Map(Object.entries(obj));
  } catch {
    return null;
  }
}

export function clearAnswers(eventId) {
  try {
    localStorage.removeItem(ANSWERS_PREFIX + eventId);
  } catch {}
}

export function ensureAnonymousId() {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = "anon_" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return "anon_fallback";
  }
}
