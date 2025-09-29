export const formatTime = (time: string) => {
    // 2025-11-30 16:30:00 -> 16:30
    return time.split(" ")[1].substring(0, 5);
}
