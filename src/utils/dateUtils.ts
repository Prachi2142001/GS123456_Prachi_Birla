import { format, startOfYear, addWeeks, getMonth, parse, startOfWeek, endOfWeek, getWeek } from 'date-fns';

export const generateWeeks = () => {
  const startDate = startOfYear(new Date());
  const weeks: string[] = [];

  for (let i = 0; i < 52; i++) {
    const weekDate = addWeeks(startDate, i);
    const weekNumber = getWeek(weekDate);
    weeks.push(weekNumber.toString().padStart(2, '0'));
  }

  return weeks;
};

export const getMonthFromWeek = (week: string): string => {
  const startDate = startOfYear(new Date());
  const weekNumber = parseInt(week, 10);
  const weekDate = addWeeks(startDate, weekNumber - 1);
  return format(weekDate, 'MMMM');
};

export const getWeekRange = (week: string): { start: Date; end: Date } => {
  const startDate = startOfYear(new Date());
  const weekNumber = parseInt(week, 10);
  const weekDate = addWeeks(startDate, weekNumber - 1);
  return {
    start: startOfWeek(weekDate),
    end: endOfWeek(weekDate),
  };
};

export const formatWeekRange = (week: string): string => {
  const { start, end } = getWeekRange(week);
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
};
