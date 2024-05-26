import { useEffect, useState } from 'react';

import { Location } from '@/types/walk';

const LOCATION_ERROR_MESSAGE = {
  PERMISSION_DENIED: '현재 위치 서비스에 동의하지 않았습니다. \n 동의 후 이용 가능합니다.',
};

const useCurrentLocation = (options = {}) => {
  const [location, setLocation] = useState<Location>();
  const [error, setError] = useState<string | null>(null);

  const handleError = ({ code, PERMISSION_DENIED }: GeolocationPositionError) => {
    /*
    code = 1  => PERMISSION_DENIED
    code = 2  => POSITION_UNAVAILABLE
    code = 3  => TIMEOUT 

    PERMISSION_DENIED => '사용자가 위치정보 권한을 허용하지 않음'
    POSITION_UNAVAILABLE => '위치 정보를 사용할 수 없음'
    TIMEOUT => 'timeout 발생'
    UNKNOWN_ERROR => '알 수 없는 에러'
  */

    if (code === PERMISSION_DENIED) setError(LOCATION_ERROR_MESSAGE.PERMISSION_DENIED);
  };

  const handleSuccess = ({ coords }: GeolocationPosition) => {
    setLocation({ latitude: coords.latitude, longitude: coords.longitude });
  };

  useEffect(() => {
    const { geolocation } = navigator;

    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [options]);

  return { location, error };
};

export default useCurrentLocation;
