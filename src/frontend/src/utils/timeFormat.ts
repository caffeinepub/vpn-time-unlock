/**
 * Formats seconds into HH:MM:SS format
 * @param seconds - Total seconds to format
 * @returns Formatted time string (e.g., "01:23:45")
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [hours, minutes, secs]
    .map((unit) => unit.toString().padStart(2, '0'))
    .join(':');
}
