import { SeriesObject } from './task.service';

export const sameDay = (compareDate: Date) => {
  const currentDate = new Date();
  return (
    currentDate.getFullYear() === compareDate.getFullYear() &&
    currentDate.getMonth() === compareDate.getMonth() &&
    currentDate.getDate() === compareDate.getDate()
  );
};

export const prevAndFutureDates = () => {
  const twoDaysAgo = new Date();
  const afterTwoDays = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  twoDaysAgo.setHours(7, 0, 0);
  afterTwoDays.setDate(afterTwoDays.getDate() + 2);
  afterTwoDays.setHours(23, 59, 59, 0);

  return {
    twoDaysAgo,
    afterTwoDays,
  };
};

export const fillEmptyDays = (result: SeriesObject[]) => {
  const { twoDaysAgo, afterTwoDays } = prevAndFutureDates();
  const map = new Map();

  const today = new Date();

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  //dates we are interested in
  const dates = [twoDaysAgo, yesterday, today, tomorrow, afterTwoDays];

  //populate the data by default values
  dates.forEach((date) => {
    return map.set(getDateString(date), {
      day: date,
      number_of_tasks: 0,
    });
  });

  //override the data based on result
  result.forEach((res) => {
    if (res.day) {
      return map.set(getDateString(new Date(res.day)), {
        day: new Date(res.day),
        number_of_tasks: res.number_of_tasks,
      });
    }

    return;
  });

  const finalArray: SeriesObject[] = dates.map((date) => {
    let item = map.get(getDateString(date));
    return item;
  });

  return finalArray;
};

export const getDateString = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export function getLastWeeksDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
}
