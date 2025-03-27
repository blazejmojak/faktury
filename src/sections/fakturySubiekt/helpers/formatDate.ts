const formatDate = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);

    return new Intl.DateTimeFormat('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: false,
        timeZone: 'Europe/Warsaw'
    }).format(date).replace(/:/g, '-').replace(/, /g, ' ');
}

export default formatDate;