import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';

type DateConverterProps = {
  date: Date | string | undefined; // Allow undefined as a valid type
};

const DateConverter: React.FC<DateConverterProps> = ({ date }) => {
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) {
      return "Unknown date"; // Fallback for undefined
    }

    const parsedDate = typeof date === 'string' ? new Date(date) : date; // Convert string to Date

    if (isToday(parsedDate)) {
      return "Today " + format(parsedDate, 'hh:mm a');
    } else if (isYesterday(parsedDate)) {
      return "Yesterday " + format(parsedDate, 'hh:mm a');
    } else {
      return format(parsedDate, 'd MMMM yyyy');
    }
  };

  return <span className='text-xs md:text-sm text-nowrap'>{formatDate(date)}</span>;
};

export default DateConverter;
