import { GameDefinition } from '../types'
import { wingspan } from './wingspan'
import { cascadia } from './cascadia'
import { ticketToRideEurope } from './ticketToRide'
import { altiplano } from './altiplano'
import { livingForest } from './livingForest'
import { catan } from './catan'
import { azul } from './azul'

export const GAMES: GameDefinition[] = [
  wingspan,
  cascadia,
  ticketToRideEurope,
  catan,
  azul,
  altiplano,
  livingForest,
]

export function getGame(id: string): GameDefinition | undefined {
  return GAMES.find(g => g.id === id)
}
