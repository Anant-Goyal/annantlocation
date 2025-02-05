interface Location {
  latitude: number;
  longitude: number;
  placeName: string;
}

async function getPlaceNameFromCoords(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&namedetails=1`,
      {
        headers: {
          'User-Agent': 'MessageGeneratorApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location details');
    }

    const data = await response.json();
    console.log('Raw location data:', data); // Debug log

    // Process address components in order of specificity
    if (data.address) {
      const addr = data.address;
      const components = [];

      // Add specific location first (if available)
      if (addr.amenity) components.push(addr.amenity);
      if (addr.building) components.push(addr.building);
      if (addr.house_number) components.push(addr.house_number);

      // Add street level information
      if (addr.road) components.push(addr.road);
      if (addr.residential) components.push(addr.residential);
      if (addr.quarter) components.push(addr.quarter);

      // Add neighborhood level
      if (addr.neighbourhood) components.push(addr.neighbourhood);
      if (addr.suburb) components.push(addr.suburb);
      if (addr.city_district) components.push(addr.city_district);

      // Add city level
      if (addr.city || addr.town || addr.village) {
        components.push(addr.city || addr.town || addr.village);
      }

      // Add state and country
      if (addr.state) components.push(addr.state);
      if (addr.country) components.push(addr.country);

      console.log('Address components:', components); // Debug log

      const placeName = components
        .filter(Boolean)
        .filter((item, index, arr) => arr.indexOf(item) === index) // Remove duplicates
        .join(", ");

      if (placeName) {
        console.log('Final place name:', placeName); // Debug log
        return placeName;
      }
    }

    // Fallback to display_name if we couldn't construct a detailed address
    console.log('Falling back to display_name:', data.display_name); // Debug log
    return data.display_name;
  } catch (error) {
    console.error('Error getting place name:', error);
    throw new Error('Failed to get location details');
  }
}

export async function getCurrentLocation(): Promise<Location> {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by your browser");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const placeName = await getPlaceNameFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );

          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            placeName
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error("Failed to get location: " + error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}