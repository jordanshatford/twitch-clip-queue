export interface Clip {
  id?: string;
  title?: string;
  channel?: string;
  game?: string;
  timestamp?: string;
  submitter?: string;
  url?: string;
  thumbnailUrl?: string;
}

export interface ClipQueue {
  currentClip: Clip | undefined;
  queue: Clip[];
  allClips: Clip[];
  acceptingClips: boolean;
  queueClipLimit: number;
}
