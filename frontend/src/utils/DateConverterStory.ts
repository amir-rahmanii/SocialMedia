import React from 'react'

function DateConverterStory(date : Date) {
  const nowDate = new Date();
  const pastDate = new Date(date);
  const diffInMilliseconds = nowDate.getTime() - pastDate.getTime();
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  return diffInHours;
}

export default DateConverterStory