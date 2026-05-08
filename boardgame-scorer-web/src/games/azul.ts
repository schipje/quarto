import { GameDefinition, PhotoStep } from '../types'

export const azul: GameDefinition = {
  id: 'azul',
  displayName: 'Azul',
  description: 'Tile drafting and mosaic building strategy game',
  minPlayers: 2,
  maxPlayers: 4,
  emoji: '🔷',

  buildPhotoSteps(playerNames: string[]): PhotoStep[] {
    const steps: PhotoStep[] = [
      {
        id: 'azul_factory',
        title: 'Factory Display',
        instruction: 'Photograph the factory displays and centre pool (for reference)',
      },
    ]
    for (const name of playerNames) {
      steps.push({
        id: `azul_board_${name}`,
        title: `${name}'s Player Board`,
        instruction: `Photograph ${name}'s complete player board showing the wall tiles and score track`,
        playerName: name,
      })
    }
    return steps
  },

  buildScoringPrompt(playerNames: string[], photoLabels: string[]): string {
    return `You are scoring a final game of Azul (standard edition). Photos shown: ${photoLabels.join(', ')}.

Players: ${playerNames.join(', ')}

Read each player's score track for their running score, then add end-game bonuses:
- running_score: current score shown on score track
- complete_rows: +2 points per fully completed horizontal row on the wall
- complete_columns: +7 points per fully completed vertical column on the wall
- complete_colors: +10 points per color where all 5 tiles of that color are on the wall
- floor_penalty: the floor line penalty should already be reflected in running_score

Total = running_score + complete_rows + complete_columns + complete_colors

Return ONLY valid JSON:
{
  "players": [
    {
      "name": "exact player name",
      "total": 0,
      "breakdown": {
        "running_score": 0,
        "complete_rows": 0,
        "complete_columns": 0,
        "complete_colors": 0
      }
    }
  ],
  "notes": "any ambiguous tiles noted"
}`
  },
}
