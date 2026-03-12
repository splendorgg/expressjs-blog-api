function roundXP(xp) {
    if (xp < 1000) return Math.ceil(xp / 10) * 10
    if (xp < 5000) return Math.ceil(xp / 50) * 50
    return Math.ceil(xp / 100) * 100
}

export function getRequiredXP(level) {
    const baseXP = 100
    const growth = 1.2

    const rawXP = baseXP * Math.pow(level, growth)

    return roundXP(rawXP)
}