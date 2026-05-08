import { GameDefinition, PhotoStep } from '../types'

export const ticketToRideEurope: GameDefinition = {
  id: 'ticket_to_ride_europe',
  displayName: 'Ticket to Ride: Europe',
  description: 'Classic train route building across Europe',
  minPlayers: 2,
  maxPlayers: 5,
  emoji: '🚂',

  buildPhotoSteps(playerNames: string[]): PhotoStep[] {
    const steps: PhotoStep[] = [
      {
        id: 'ttr_board',
        title: 'Game Board',
        instruction: 'Photograph the full Ticket to Ride Europe board showing all claimed routes (colour of trains matters)',
      },
    ]
    for (const name of playerNames) {
      steps.push({
        id: `ttr_tickets_${name}`,
        title: `${name}'s Destination Tickets`,
        instruction: `Photograph all of ${name}'s destination tickets (both completed and uncompleted)`,
        playerName: name,
      })
    }
    return steps
  },

  buildScoringPrompt(playerNames: string[], photoLabels: string[]): string {
    return `You are scoring a game of Ticket to Ride: Europe. Photos shown: ${photoLabels.join(', ')}.

Players: ${playerNames.join(', ')}

Scoring rules:
- routes: sum of route points for all routes claimed by this player
  (1 car=1pt, 2=2pt, 3=4pt, 4=7pt, 5=10pt, 6=15pt, 8=21pt — Europe edition)
- tickets_completed: sum of point values on destination tickets that are fully connected
- tickets_failed: NEGATIVE sum of point values on destination tickets NOT connected (subtract these)
- longest_route: 10 points to player(s) with the longest continuous route
- stations: -4 points per station still on board at game end (not used if all stations placed/returned)

Carefully trace each player's train network on the board to determine which tickets are completed.

Return ONLY valid JSON:
{
  "players": [
    {
      "name": "exact player name",
      "total": 0,
      "breakdown": {
        "routes": 0,
        "tickets_completed": 0,
        "tickets_failed": 0,
        "longest_route": 0,
        "stations": 0
      }
    }
  ],
  "notes": "which player has longest route, any close calls"
}`
  },
}
