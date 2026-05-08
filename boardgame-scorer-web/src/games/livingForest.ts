import { GameDefinition, PhotoStep } from '../types'

export const livingForest: GameDefinition = {
  id: 'living_forest',
  displayName: 'Living Forest',
  description: 'Cooperative-competitive game protecting the sacred tree',
  minPlayers: 1,
  maxPlayers: 4,
  emoji: '🌳',

  buildPhotoSteps(playerNames: string[]): PhotoStep[] {
    const steps: PhotoStep[] = [
      {
        id: 'lf_shared_board',
        title: 'Forest Board',
        instruction: 'Photograph the shared forest board showing the circle of spirits and fire tokens',
      },
    ]
    for (const name of playerNames) {
      steps.push(
        {
          id: `lf_forest_${name}`,
          title: `${name}'s Forest`,
          instruction: `Photograph ${name}'s personal forest showing planted trees and protective animals`,
          playerName: name,
        },
        {
          id: `lf_circle_${name}`,
          title: `${name}'s Guardian Circle`,
          instruction: `Photograph ${name}'s guardian animal circle showing collected animal cards and sun/rain/lightning tokens`,
          playerName: name,
        },
      )
    }
    return steps
  },

  buildScoringPrompt(playerNames: string[], photoLabels: string[]): string {
    return `You are scoring a game of Living Forest. Photos shown: ${photoLabels.join(', ')}.

Players: ${playerNames.join(', ')}

Determine the winner by checking victory conditions (first to 12 of any one type wins; if simultaneous, use tiebreaker):
- trees_planted: number of trees planted in personal forest
- fire_extinguished: number of fire tokens removed from shared board
- animals_attracted: number of different animal symbols in guardian circle

Score each player for tracking purposes (not a traditional point score):
- trees_planted: count of tree tokens in personal forest
- animals: total animal cards in guardian circle
- fire_tokens: fire tokens extinguished total
- sun_tokens: sun flower tokens collected
- rain_tokens: rain drop tokens collected
- sapling_score: extra points from sapling bonuses on tree tiles

Return ONLY valid JSON:
{
  "players": [
    {
      "name": "exact player name",
      "total": 0,
      "breakdown": {
        "trees_planted": 0,
        "animals": 0,
        "fire_tokens": 0,
        "sun_tokens": 0,
        "rain_tokens": 0,
        "sapling_score": 0
      }
    }
  ],
  "notes": "who triggered game end and how"
}`
  },
}
