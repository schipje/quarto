import { GameDefinition, PhotoStep } from '../types'

export const altiplano: GameDefinition = {
  id: 'altiplano',
  displayName: 'Altiplano',
  description: 'Resource management bag-building game in the Andes',
  minPlayers: 2,
  maxPlayers: 5,
  emoji: '🦙',

  buildPhotoSteps(playerNames: string[]): PhotoStep[] {
    const steps: PhotoStep[] = [
      {
        id: 'altiplano_board',
        title: 'Game Board',
        instruction: 'Photograph the main game board showing the route track and any shared scoring elements',
      },
    ]
    for (const name of playerNames) {
      steps.push(
        {
          id: `altiplano_warehouse_${name}`,
          title: `${name}'s Warehouse`,
          instruction: `Photograph ${name}'s warehouse board showing all stored goods and extensions`,
          playerName: name,
        },
        {
          id: `altiplano_score_${name}`,
          title: `${name}'s Score Track`,
          instruction: `Photograph ${name}'s score track and any personal scoring cards or goods tiles`,
          playerName: name,
        },
      )
    }
    return steps
  },

  buildScoringPrompt(playerNames: string[], photoLabels: string[]): string {
    return `You are scoring a game of Altiplano. Photos shown: ${photoLabels.join(', ')}.

Players: ${playerNames.join(', ')}

Score each player:
- track_position: points from position on the scoring track
- goods_stored: 1 point per good stored in the warehouse at game end
- extensions: points from warehouse extension tiles (value printed on tile)
- route_bonus: bonus points from route positions claimed (read from board)
- leftover_goods: some goods score end-game points (check tiles)

Return ONLY valid JSON:
{
  "players": [
    {
      "name": "exact player name",
      "total": 0,
      "breakdown": {
        "track_position": 0,
        "goods_stored": 0,
        "extensions": 0,
        "route_bonus": 0,
        "leftover_goods": 0
      }
    }
  ],
  "notes": "any scoring notes"
}`
  },
}
