interface Location {
  latitude: number;
  longitude: number;
  placeName: string;
}

export function generateMessage(username: string, location: Location | null): string {
  const timestamp = new Date().toLocaleString();
  let message = `Message from ${username} at ${timestamp}`;

  if (location) {
    message += `\nCurrent location: ${location.placeName}`;
  }

  return message;
}