import type { GameSession } from "~/types/game.types";

// 建议将 GameSession 的默认值提取为常量
export const DEFAULT_SESSION: GameSession = {
    id: '1',
    name: '默认场次',
    flatCodes: [],
    specialCode: '',
    totalAmount: 0,
    flatCodeOdds: 2,
    specialCodeOdds: 47,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    betRecords: [],
    operationRecords: [],
    numbers: Array.from({ length: 49 }, (_, i) => ({
        number: (i + 1).toString().padStart(2, '0'),
        amount: 0,
        odds: 0,
        paoAmount: 0
    })),
    status: 'active'
}