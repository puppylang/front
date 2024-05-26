import { Location } from '@/types/walk';

export const calculatePathCenter = (locations: Location[]) => {
  const pathLength = locations.length;
  const latAvg = locations.reduce((total, point) => total + point.latitude, 0) / pathLength;
  const lngAvg = locations.reduce((total, point) => total + point.longitude, 0) / pathLength;

  return {
    lat: latAvg,
    lng: lngAvg,
  };
};

export const formatDistance = (distance: number) => {
  if (distance < 1000) {
    return `${distance}m`;
  }

  const distanceInKm = distance / 1000;
  return `${distanceInKm}km`;
};
