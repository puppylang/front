'use client';

import dayjs from 'dayjs';
import { debounce, throttle } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map } from 'react-kakao-maps-sdk';
import { useRecoilState, useRecoilValue } from 'recoil';

import useCurrentLocation from '@/hooks/useCurrentLocation';
import useWatchLocation from '@/hooks/useWatchLocation';
import { mapIsClicked, stopWatchState, trackMapState } from '@/recoil/atoms/walkAtom';
import { Center, Location, geolocationOptions } from '@/types/walk';

import Alert from '@/components/Alert';

import { CenterMarker } from './CenterMarker';
import { PathLine } from './PathLine';
import Loading from '../../Loading';

interface MapProps {
  defaultLocations?: Location[];
}

function TrackMap({ defaultLocations }: MapProps) {
  const { isRunning, isPaused } = useRecoilValue(stopWatchState);
  const { location: currentLocation, error: locationPermissionError } = useCurrentLocation(geolocationOptions);
  const { location: watchedLocation, cancelLocationWatch } = useWatchLocation(geolocationOptions, isRunning);
  const [trackMap, setTrackMap] = useRecoilState(trackMapState);
  const [center, setCenter] = useState<Center | null>(null);
  const [changedCenter, setChangedCenter] = useState<Center>({ lat: 0, lng: 0 });
  const [isChangedCenter, setIsChangedCenter] = useRecoilState(mapIsClicked);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const positions = useMemo(() => {
    return trackMap.locations.map(({ latitude, longitude }) => ({ lat: latitude, lng: longitude }));
  }, [trackMap.locations]);

  const handleChangeCurrentCenter = useRef(
    debounce(() => {
      setIsChangedCenter(false);
    }, 2000),
  ).current;

  const handleOutCenter = useRef(
    throttle((target: kakao.maps.Map) => {
      setIsChangedCenter(true);

      const center = target.getCenter();
      setChangedCenter({ lat: center.getLat(), lng: center.getLng() });

      handleChangeCurrentCenter();
    }, 200),
  ).current;

  const handleUpdatedLocations = useCallback(() => {
    if (!isRunning || !watchedLocation) return;

    const lastLocation = [...trackMap.locations].at(-1);
    if (lastLocation && watchedLocation) {
      const { latitude, longitude } = watchedLocation;
      const { latitude: lastedLat, longitude: lastedLon } = lastLocation;

      if (lastedLat === latitude && lastedLon === longitude) return;

      const newPosition = [
        ...trackMap.locations,
        {
          latitude,
          longitude,
          recorded_at: dayjs().toISOString(),
        },
      ];

      setTrackMap(prev => ({ ...prev, locations: newPosition }));
      setCenter({ lat: latitude, lng: longitude });
    }
  }, [isRunning, watchedLocation, setTrackMap, trackMap.locations]);

  const InitLocation = useCallback(() => {
    if (!isRunning || !watchedLocation) return;

    const { latitude, longitude } = watchedLocation;

    setTrackMap(prev => ({
      ...prev,
      locations: [{ latitude, longitude, recorded_at: dayjs().toISOString() }],
    }));
    setCenter({ lat: latitude, lng: longitude });
  }, [isRunning, setTrackMap, watchedLocation]);

  useEffect(() => {
    if (isPaused) {
      return cancelLocationWatch();
    }
  }, [cancelLocationWatch, isPaused]);

  useEffect(() => {
    if (!isRunning) return;

    if (trackMap.locations.length === 0) {
      return InitLocation();
    }

    return handleUpdatedLocations();
  }, [InitLocation, handleUpdatedLocations, isRunning, trackMap.locations.length]);

  useEffect(() => {
    // Center Init
    if (!center && currentLocation) {
      setCenter({ lat: currentLocation.latitude, lng: currentLocation.longitude });
    }
  }, [currentLocation, center]);

  useEffect(() => {
    if (defaultLocations) setTrackMap(prev => ({ ...prev, distance: 0, locations: defaultLocations }));
  }, [defaultLocations, setTrackMap]);

  useEffect(() => {
    if (locationPermissionError) {
      setIsAlertOpen(true);
    }
  }, [locationPermissionError]);

  const handleCloseAlert = () => setIsAlertOpen(false);

  if (isAlertOpen) {
    return (
      <Alert
        isOpen
        message={locationPermissionError || ''}
        useActionButton={false}
        messageStyle='whitespace-pre-wrap text-center'
        onClose={handleCloseAlert}
      />
    );
  }

  if (!center) return <Loading />;

  return (
    <Map
      center={isChangedCenter ? changedCenter : center}
      className='w-full h-[100vh]'
      level={1}
      isPanto
      onCenterChanged={handleOutCenter}
    >
      <PathLine path={positions} strokeWeight={5} strokeColor='#6AC9E5' strokeOpacity={0.9} />
      <CenterMarker position={center} />
    </Map>
  );
}

export default TrackMap;
