// services/hotelService.ts
const GEO_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

export const getHotelsByCity = async (city: string) => {
  if (!GEO_KEY) return [];

  try {
    // 1. Get Coordinates
    const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&apiKey=${GEO_KEY}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    
    if (!geoData.features?.length) return [];
    const [lon, lat] = geoData.features[0].geometry.coordinates;

    // 2. Get Hotels with extra details
    const hotelUrl = `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},5000&limit=12&apiKey=${GEO_KEY}`;
    const hotelRes = await fetch(hotelUrl);
    const hotelData = await hotelRes.json();

    return hotelData.features.map((f: any, index: number) => {
      const p = f.properties;
      
      // LOGIC: Generate a realistic price (e.g., ₹2,500 - ₹8,000)
      const basePrice = Math.floor(Math.random() * (8000 - 2500) + 2500);
      
      return {
        id: p.place_id,
        name: p.name || "Luxury Stay",
        address: p.address_line2 || "Premium Location",
        rating: (Math.random() * (4.9 - 3.8) + 3.8).toFixed(1),
        // FORMATTED AMOUNT
        amount: `₹${basePrice.toLocaleString('en-IN')}`,
        // DYNAMIC ROOM PHOTOS: Uses the index to ensure different photos for different cards
        image: `https://images.unsplash.com/photo-${getPhotoId(index)}?auto=format&fit=crop&q=80&w=800`,
        tags: ["Free Wifi", "AC", "Breakfast Included"].slice(0, Math.floor(Math.random() * 3) + 1)
      };
    });
  } catch (err) {
    console.error("Hotel Service Error:", err);
    return [];
  }
};

// Helper to provide a list of high-quality hotel room IDs from Unsplash
const getPhotoId = (index: number) => {
  const ids = [
    '1566073771259-6a8506099945', // Modern room
    '1590490360182-c33d57733427', // Bed view
    '1582719478250-c89cae4dc85b', // Resort style
    '1542314831-068cd1dbfeeb', // Luxury suite
    '1571896349842-33c89424de2d', // Pool side
    '1611892440504-42a792e24d32', // Cozy room
    '1564501049412-61c253fcdcf2', // Minimalist
    '1596394516093-501ba68a0ba6', // Modern hotel
  ];
  return ids[index % ids.length];
};