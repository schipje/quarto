# Quarto

Online implementatie van het strategische bordspel **Quarto** — speelbaar in de browser, met een AI-tegenstander op drie moeilijkheidsgraden.

## Het spel

Quarto is een tweespelersspel op een 4×4 bord met 16 unieke stukken. Elk stuk heeft vier binaire eigenschappen:

| Eigenschap | Optie A | Optie B |
|---|---|---|
| Hoogte | Hoog | Laag |
| Kleur | Donker | Licht |
| Vorm | Vierkant | Rond |
| Vulling | Vol | Hol |

**Doel:** vier stukken op een rij, kolom of diagonaal plaatsen die minstens één eigenschap gemeen hebben.

**De twist:** jij kiest welk stuk je tegenstander moet plaatsen — niet je eigen stuk.

## Spelen

Open `quarto/quarto.html` in een browser. Geen installatie nodig.

1. Kies bovenaan de tegenstander: **Mens** of **Computer** (drie niveaus)
2. Speler 1 klikt een stuk in het rechterpaneel → bevestig met de knop
3. Speler 2 klikt een lege cel op het bord om het stuk te plaatsen
4. Herhaal tot iemand wint of het bord vol is

## AI-moeilijkheidsgraden

| Niveau | Stuk kiezen | Stuk plaatsen |
|---|---|---|
| **Makkelijk** | Willekeurig | Wint direct als het kan, anders willekeurig |
| **Gemiddeld** | Geeft nooit een direct-winnend stuk (indien mogelijk) | Wint direct als het kan, anders willekeurig |
| **Moeilijk** | Geeft het minst strategisch waardevolle stuk | Wint direct als het kan, anders maximaliseert gedeelde-eigenschap-lijnen |

## Projectstructuur

```
quarto/
├── quarto.html        # Het spel — open dit in de browser
├── quarto-logic.js    # Pure spellogica als Node.js module
├── quarto.test.js     # 38 unit tests
└── package.json       # npm test script
```

## Tests uitvoeren

Vereist [Node.js](https://nodejs.org/) v18 of hoger.

```bash
cd quarto
npm test
```

Uitvoer:

```
# tests 38
# pass  38
# fail   0
```

De tests dekken:
- Stuk-attribuut encoding (16 unieke combinaties)
- Win-detectie op alle 10 lijnen (rijen, kolommen, diagonalen) voor alle 4 attributen
- False positive preventie (3 stukken op een rij ≠ winst)
- AI-beslissingen: nooit direct-winnend stuk geven, altijd winnen als het kan
- Spelstroom integratie

## Technologie

- Puur HTML, CSS en JavaScript — geen frameworks, geen build-stap
- Tests via de ingebouwde `node:test` runner (geen npm dependencies)

## Licentie

MIT
