import { DateTimes } from '@woowacourse/mission-utils';

export const getDateTimes = () => {
  return DateTimes.now();
};

export const checkTimes = (start_date, end_date) => {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const currentDate = new Date(getDateTimes());
  return currentDate >= startDate && currentDate <= endDate;
};
