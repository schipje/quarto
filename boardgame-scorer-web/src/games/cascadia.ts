import { GameDefinition, PhotoStep } from '../types'

export const cascadia: GameDefinition = {
  id: 'cascadia',
  displayName: 'Cascadia',
  description: 'Tile-laying nature game scoring wildlife corridors',
  minPlayers: 1,
  maxPlayers: 4,
  emoji: '🐻',

  buildPhotoSteps(playerNames: string[]): PhotoStep[] {
    const steps: PhotoStep[] = [
      {
        id: 'cascadia_scoring_cards',
        title: 'Scoring Cards',
        instruction: 'Photograph the five active scoring cards (bear, elk, salmon, hawk, fox) in the centre of the table',
      },
    ]
    for (const name of playerNames) {
      steps.push({
        id: `cascadia_habitat_${name}`,
        title: `${name}'s Habitat`,
        instruction: `Photograph ${name}'s completed habitat showing all tiles and wildlife tokens`,
        playerName: name,
      })
    }
    return steps
  },

  buildScoringPrompt(playerNames: string[], photoLabels: string[]): string {
    return `You are scoring a game of Cascadia. Photos shown: ${photoLabels.join(', ')}.

Players: ${playerNames.join(', ')}

Score each player by applying the active scoring cards to their habitat:
- bear: points per bear group (size matters per scoring card)
- elk: points for elk lines (length matters per scoring card)
- salmon: points for salmon runs (length matters per scoring card)
- hawk: points for lone/specific hawk placement per scoring card
- fox: points based on adjacent unique wildlife per scoring card
- habitat_bonus: 3 points per complete nature token scoring (4 of a kind), 1 per leftover token
- scenic_bonus: 3 points for largest contiguous habitat type (only if using that variant; skip if unclear)

Return ONLY valid JSON:
{
  "players": [
    {
      "name": "exact player name",
      "total": 0,
      "breakdown": {
        "bear": 0,
        "elk": 0,
        "salmon": 0,
        "hawk": 0,
        "fox": 0,
        "habitat_bonus": 0
      }
    }
  ],
  "notes": "scoring card variants used"
}`
  },
}
