
const options = { 
        timeZone: "Asia/Tokyo", 
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit", 
        hour: "2-digit", 
        minute: "2-digit" 
    };

export const formatter = new Intl.DateTimeFormat("ja-JP", options);

