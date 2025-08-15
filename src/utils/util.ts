/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const formatPhoneNumber = (phone: string): string => {
  const normalizePhoneNumber = phone.replace(/[^\d]/g, '');

  if (normalizePhoneNumber.length === 11) {
    return normalizePhoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else {
    return normalizePhoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
};

export const subtractDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date: Date, divisor: string = '/'): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${day}${divisor}${month}${divisor}${year}`;
};

export const normalizeDate = (date: string): Date => {
  const dateString = date.split('/');

  return new Date(`${dateString[2]}-${dateString[1]}-${dateString[0]}T00:00:00.000Z`);
};

interface ObjectDate {
  startDayOfThisMonth: number;
  endDayOfThisMonth: number;
  startDayOfThisNextMonth: number;
  endDayOfThisNextMonth: number;
  thisMonth: number;
  thisYear: number;
  nextMonth: number;
  nextYear: number;
  firstDayOfThisMonth: Date;
  lastDayOfThisMonth: Date;
  firstDayOfNextMonth: Date;
  lastDayOfNextMonth: Date;
}

export const generateObjectDate = (): ObjectDate => {
  const currentDate = new Date();
  const thisYear = currentDate.getFullYear();
  let nextMonth = currentDate.getMonth() + 1;
  let twoNextMonth = nextMonth + 1;

  if (nextMonth > 11) {
    nextMonth = 0;
    twoNextMonth = 1;
  }

  const nextYear = nextMonth === 0 ? thisYear + 1 : thisYear;

  const nextMonthLastDate = new Date(nextYear, twoNextMonth, 0);
  const nextMonthDate = new Date(nextYear, nextMonth, 1);

  const startOfMonth = new Date(thisYear, nextMonth, 1);
  const lastDayOfThisMonth1 = new Date(thisYear, nextMonth, 0);

  const firstDayOfThisMonth = new Date(thisYear, currentDate.getMonth(), 1);
  const lastDayOfThisMonth = new Date(thisYear, currentDate.getMonth() + 1, 0);
  const firstDayOfNextMonth = new Date(nextYear, nextMonth, 1);
  const lastDayOfNextMonth = nextMonthLastDate;

  return {
    startDayOfThisMonth: startOfMonth.getDate(),
    endDayOfThisMonth: lastDayOfThisMonth1.getDate(),
    thisMonth: currentDate.getMonth() + 1,
    thisYear: thisYear,
    nextMonth: nextMonthDate.getMonth() + 1,
    nextYear: nextYear,
    startDayOfThisNextMonth: nextMonthDate.getDate(),
    endDayOfThisNextMonth: nextMonthLastDate.getDate(),
    firstDayOfThisMonth: firstDayOfThisMonth,
    lastDayOfThisMonth: lastDayOfThisMonth,
    firstDayOfNextMonth: firstDayOfNextMonth,
    lastDayOfNextMonth: lastDayOfNextMonth,
  };
};
