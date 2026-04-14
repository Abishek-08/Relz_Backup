export const DescriptionValidations = (description) => {
  const hasMinimumLength = description.length >= 10 && description.length <= 50;
  const doesNotStartWithNumber = !/^\d/.test(description);

  return hasMinimumLength && doesNotStartWithNumber;
};
