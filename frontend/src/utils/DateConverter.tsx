// DateConverter.tsx
import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';

type DateConverterProps = {
  date: Date;
}

const DateConverter: React.FC<DateConverterProps> = ({ date }) => {
  const formatDate = (date: Date): string => {
    if (isToday(date)) {
      return "Today " + format(date, 'hh:mm a');
    } else if (isYesterday(date)) {
      return "Yesterday " + format(date, 'hh:mm a');
    } else {
      return format(date, 'd MMMM yyyy');
    }
  };

  return <span>{formatDate(date)}</span>;
};

export default DateConverter;