import { Pet } from './pet';
import { Caution } from './post';

export interface Location {
  latitude: number;
  longitude: number;
  recorded_at?: string;
}

export const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1,
  maximumAge: 1000 * 3600 * 24,
};

export enum WalkRole {
  PetOwner = 'PetOwner',
  PetSitterWalker = 'PetSitterWalker',
}

export interface WalkForm {
  id?: number | null;
  start_at: string;
  end_at: string;
  locations: Location[];
  distance: number;
  pet_id: number;
  pet?: Pet;
  created_at?: string;
  post_id?: number;
  cautions?: Caution[];
}

export interface StopWatch {
  isRunning: boolean;
  isPaused: boolean;
  start_at: string | null;
  end_at: string | null;
  time: number;
}

export interface TrackMap {
  distance: number;
  locations: Location[];
}

export interface Center {
  lat: number;
  lng: number;
}
