export const formatTime = (time: string) => {
    if (!time) return '';
    // Handles both "YYYY-MM-DD HH:mm:ss" and "HH:mm:ss"
    const timePart = time.includes(' ') ? time.split(' ')[1] : time;
    return timePart.substring(0, 5);
}
