export const DATE_FORMATTER = (dateString: string) => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleString();
};
