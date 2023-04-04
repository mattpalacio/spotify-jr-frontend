export interface WebPlaybackState {
  player: Spotify.Player;
  state: Spotify.PlaybackState;
  deviceId: string;
  volume: number;
}
