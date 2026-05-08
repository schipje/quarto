export interface PhotoStep {
  id: string;
  title: string;
  instruction: string;
  playerName?: string;
}

export interface PlayerScore {
  name: string;
  total: number;
  breakdown: Record<string, number>;
}

export interface ScoreResult {
  players: PlayerScore[];
  notes?: string;
}

export interface GameDefinition {
  id: string;
  displayName: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  emoji: string;
  buildPhotoSteps(playerNames: string[]): PhotoStep[];
  buildScoringPrompt(playerNames: string[], photoLabels: string[]): string;
}

export interface CapturedPhoto {
  stepId: string;
  label: string;
  dataUrl: string; // base64 JPEG
}
