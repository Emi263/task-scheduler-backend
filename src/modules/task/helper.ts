export const sameDay = (compareDate: Date) => {
  const currentDate = new Date();

  return (
    currentDate.getFullYear() === compareDate.getFullYear() &&
    currentDate.getMonth() === compareDate.getMonth() &&
    currentDate.getDate() === compareDate.getDate()
  );
};
