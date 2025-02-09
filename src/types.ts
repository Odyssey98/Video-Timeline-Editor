export interface VideoClip {
  id: string;
  start: number;
  end: number;
  track: number;
  thumbnail: string;
}

export interface Track {
  id: string;
  clips: VideoClip[];
}

export interface TimelineState {
  tracks: Track[];
  duration: number;
  scale: number;
}