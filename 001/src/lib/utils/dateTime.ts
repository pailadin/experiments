import dayjs, { Dayjs as DayJsType } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export type DateType = string | DayJsType;

export const timeAgo = (date: DateType) => dayjs().to(dayjs(date));
