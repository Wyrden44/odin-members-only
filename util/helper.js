const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
}

function getTimeAgo (date) {
    const now = new Date(Date.now());
    console.log(now.toISOString(), date);
    const seconds =  Math.floor((now - new Date(date)) / 1000);

    let minCount = 10000;
    let minValue = null;

    for (const [unit, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value);
        if (count >= 1 && count < minCount) {
            minCount = count;
            minValue = unit;
        }
    }

    if (minValue == null) {
        return "just now";
    }
    
    return `${minCount} ${minValue}${(minCount > 1) ? "s" : ""} ago`;
}

exports.addTimeToMessages = (messages) => {
    for (let i=0; i < messages.length; i++) {
        messages[i] = {
            ...messages[i],
            time: getTimeAgo(messages[i].time)
        }
    }
    
    return messages;
}