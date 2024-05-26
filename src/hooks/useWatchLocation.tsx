import { useEffect, useRef, useState } from 'react';

import { Location } from '@/types/walk';

const useWatchLocation = (options = {}, isRunning = false) => {
  const [location, setLocation] = useState<Location>();
  const locationWatchId = useRef<number | null>(null);

  const cancelLocationWatch = () => {
    const { geolocation } = navigator;

    if (locationWatchId.current && geolocation) {
      geolocation.clearWatch(locationWatchId.current);
    }
  };

  const handleError = () => {
    console.log('ERROR');
  };

  useEffect(() => {
    const { geolocation } = navigator;

    // 사용된 브라우저에서 지리적 위치(Geolocation)가 정의되지 않은 경우 오류로 처리합니다.
    if (!geolocation) return;

    if (isRunning) {
      locationWatchId.current = geolocation.watchPosition(
        ({ coords }) => {
          setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        },
        handleError,
        options,
      );
    }
    return cancelLocationWatch;
  }, [options, isRunning]);

  return { location, cancelLocationWatch };
};

export default useWatchLocation;
