export const TimeFormatter = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Handle midnight (0 hours)
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
};
