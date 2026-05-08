import { GameDefinition, PhotoStep } from '../types'

export const catan: GameDefinition = {
  id: 'catan',
  displayName: 'Catan',
  description: 'Classic resource trading and settlement building',
  minPlayers: 3,
  maxPlayers: 4,
  emoji: '🏝️',

  buildPhotoSteps(playerNames: string[]): PhotoStep[] {
    const steps: PhotoStep[] = [
      {
        id: 'catan_board',
        title: 'Catan Board',
        instruction: 'Photograph the full Catan board showing all settlements, cities, and roads for all players',
      },
    ]
    for (const name of playerNames) {
      steps.push({
        id: `catan_devcards_${name}`,
        title: `${name}'s Development Cards`,
        instruction: `Photograph ${name}'s face-up victory point cards and any special cards (Longest Road, Largest Army markers)`,
        playerName: name,
      })
    }
    return steps
  },

  buildScoringPrompt(playerNames: string[], photoLabels: string[]): string {
    return `You are scoring a game of Catan. Photos shown: ${photoLabels.join(', ')}.

Players: ${playerNames.join(', ')}

Count victory points for each player:
- settlements: 1 point per settlement on board
- cities: 2 points per city on board
- longest_road: 2 points if this player holds the Longest Road card (5+ road segments)
- largest_army: 2 points if this player holds the Largest Army card (3+ knights played)
- vp_cards: points from Victory Point development cards (Chapel, University, Market, Library, Great Hall)

Return ONLY valid JSON:
{
  "players": [
    {
      "name": "exact player name",
      "total": 0,
      "breakdown": {
        "settlements": 0,
        "cities": 0,
        "longest_road": 0,
        "largest_army": 0,
        "vp_cards": 0
      }
    }
  ],
  "notes": "who holds longest road and largest army"
}`
  },
}
