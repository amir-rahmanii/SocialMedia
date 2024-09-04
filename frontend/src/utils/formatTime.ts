export const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
  
    // گرفتن ساعت و دقیقه
    let hours = date.getHours();
    const minutes = date.getMinutes();
  
    // مشخص کردن AM یا PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // تبدیل ساعت به 12 ساعته
    hours = hours % 12;
    hours = hours ? hours : 12; // ساعت صفر باید 12 نشان داده شود
  
    // اضافه کردن صفرهای پیشرو به دقیقه
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  
    // تولید خروجی نهایی
    return `${hours}:${minutesStr} ${ampm}`;
  };