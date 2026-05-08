import { GameDefinition, PhotoStep } from '../types'

export const wingspan: GameDefinition = {
  id: 'wingspan',
  displayName: 'Wingspan',
  description: 'Engine-building bird game with eggs, food, and habitats',
  minPlayers: 1,
  maxPlayers: 5,
  emoji: '🦜',

  buildPhotoSteps(playerNames: string[]): PhotoStep[] {
    const steps: PhotoStep[] = [
      {
        id: 'wingspan_goals',
        title: 'Round Goals Board',
        instruction: 'Photograph the central round goals board showing how many cubes each player placed on each goal',
      },
    ]
    for (const name of playerNames) {
      steps.push({
        id: `wingspan_mat_${name}`,
        title: `${name}'s Bird Mat`,
        instruction: `Photograph ${name}'s player mat showing all birds played, eggs, cached food, and tucked cards`,
        playerName: name,
      })
      steps.push({
        id: `wingspan_bonus_${name}`,
        title: `${name}'s Bonus Cards`,
        instruction: `Photograph ${name}'s bonus cards (face-up) so we can check their conditions`,
        playerName: name,
      })
    }
    return steps
  },

  buildScoringPrompt(playerNames: string[], photoLabels: string[]): string {
    return `You are scoring a game of Wingspan. You have been shown the following photos: ${photoLabels.join(', ')}.

Players: ${playerNames.join(', ')}

Carefully analyze each photo and score each player using these rules:
- birds: sum of all points printed on each bird card played (shown on the card face)
- eggs: total egg count on all birds on the mat
- cached_food: total food tokens cached on birds (shown on the bird cards)
- tucked_cards: total cards tucked beneath birds
- round_goals: points earned from end-of-round goals (read cube placements from the goals board)
- bonus_cards: points from any bonus cards whose conditions are fully met

Return ONLY valid JSON with NO extra text:
{
  "players": [
    {
      "name": "exact player name",
      "total": 0,
      "breakdown": {
        "birds": 0,
        "eggs": 0,
        "cached_food": 0,
        "tucked_cards": 0,
        "round_goals": 0,
        "bonus_cards": 0
      }
    }
  ],
  "notes": "any important scoring clarifications"
}`
  },
}
