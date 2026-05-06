// Pure game logic extracted from quarto.html
// bit 3 = Hoog, bit 2 = Donker, bit 1 = Vierkant, bit 0 = Vol

const LINES = [
    [0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15],
    [0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15],
    [0,5,10,15],[3,6,9,12]
];

function attrs(p) {
    return { tall: !!(p&8), dark: !!(p&4), square: !!(p&2), solid: !!(p&1) };
}

function checkWinOnBoard(board) {
    for (const line of LINES) {
        if (!line.every(i => board[i] !== null)) continue;
        for (let bit = 0; bit < 4; bit++) {
            const mask = 1 << bit;
            const ref  = board[line[0]] & mask;
            if (line.every(i => (board[i] & mask) === ref)) return line;
        }
    }
    return null;
}

function emptyCells(board) {
    return board.reduce((a, v, i) => { if (v === null) a.push(i); return a; }, []);
}

function wouldWin(board, piece, cell) {
    const b = [...board]; b[cell] = piece;
    return checkWinOnBoard(b) !== null;
}

function isDangerous(piece, board) {
    return emptyCells(board).some(c => wouldWin(board, piece, c));
}

function placementScore(piece, cell, board) {
    const b = [...board]; b[cell] = piece;
    let score = 0;
    for (const line of LINES) {
        if (!line.includes(cell)) continue;
        const ps = line.filter(i => b[i] !== null).map(i => b[i]);
        if (!ps.length) continue;
        for (let bit = 0; bit < 4; bit++) {
            const mask = 1 << bit, ref = ps[0] & mask;
            if (ps.every(p => (p & mask) === ref)) { score += ps.length; break; }
        }
    }
    return score;
}

function pieceDangerScore(piece, board) {
    return emptyCells(board).reduce((s, c) => s + placementScore(piece, c, board), 0);
}

function aiSelect(available, board, difficulty) {
    const avail = [...available];
    if (difficulty === 'easy') return avail[Math.random() * avail.length | 0];

    const safe = avail.filter(p => !isDangerous(p, board));
    const pool = safe.length ? safe : avail;

    if (difficulty === 'medium' || pool.length === 1)
        return pool[Math.random() * pool.length | 0];

    let best = pool[0], bestScore = Infinity;
    for (const p of pool) {
        const s = pieceDangerScore(p, board);
        if (s < bestScore) { bestScore = s; best = p; }
    }
    return best;
}

function aiPlace(chosen, board, difficulty) {
    const empty = emptyCells(board);

    for (const c of empty)
        if (wouldWin(board, chosen, c)) return c;

    if (difficulty === 'easy') return empty[Math.random() * empty.length | 0];

    let best = empty[0], bestScore = -1;
    for (const c of empty) {
        const s = placementScore(chosen, c, board);
        if (s > bestScore) { bestScore = s; best = c; }
    }
    return best;
}

module.exports = {
    LINES, attrs, checkWinOnBoard, emptyCells,
    wouldWin, isDangerous, placementScore,
    pieceDangerScore, aiSelect, aiPlace,
};
