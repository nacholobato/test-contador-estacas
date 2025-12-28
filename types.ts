
export type BoundingBox = [number, number, number, number]; // [x1, y1, x2, y2]

export interface DetectionResponse {
  log_count: number;
  detections: BoundingBox[];
}

export interface PredictionState {
  image: string | null;
  file: File | null;
  results: DetectionResponse | null;
  loading: boolean;
  error: string | null;
}
