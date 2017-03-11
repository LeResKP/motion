export class Camera {
  id: number;
  name: string;
  src: string;
  host: string;
  port: number;
  public_url: string;
  enabled?: boolean;
  detection_enabled?: boolean;
  upload_enabled?: boolean;
}
