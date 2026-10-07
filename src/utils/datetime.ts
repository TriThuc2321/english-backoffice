import dayjs from 'dayjs';

export const formatDateTime = (date?: string | Date, format = 'DD/MM/YYYY') =>
  date ? dayjs(date).format(format) : '-';
