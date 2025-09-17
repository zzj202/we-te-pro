export interface Race {
    id: string
    name: string
    numbers: {
        number: string // 01-49
        amount: number  //金额
        paoAmount: number //抛的金额
        odds: number  //赔率
    }[]
    flatCodes: string[] // 平码列表
    specialCode: string // 特码
    addTotalAmount: number // 加总金额
    paoTotalAmount: number // 抛总金额
    flatCodeOdds: number // 平码赔率
    specialCodeOdds: number // 特码赔率
    createdAt: string
    updatedAt: string
    betRecords: BetRecord[]   //加注记录列表
    paoRecords:BetRecord[]  //抛注记录列表
    operationRecords: OperationRecord[]  //操作记录列表  包括加注、减注 抛操作
    otherAdd: {  //其他下注
        id: string,
        inputValue: string,
        totalAmount: number
    }[]
    otherPao: {  //其他抛
        id: string,
        inputValue: string,
        totalAmount: number
    }[]
    status: string
}

//比赛种类
export interface RaceCategory {
    id: string
    name: string
    races: Race[]
}

//比赛种类的中奖记录列表
export interface PrizeCategory {
    id: string
    name: string
    prizes: Prize[]
}

//比赛种类历史中奖记录
export interface Prize {
    id: string,
    date: string,
    numbers: string[]
}

//下注输入
export interface BetLine {
    index: number  //序号
    inputValue: string //输入
    selectedNumbers: []  //选择的号码
    amount: number  //金额
    totalAmount: number //总金额
    isValid: boolean //合格
    type: string  //方式
    description?: string
}

//下注记录
export interface BetRecord {
    id: string
    inputValue: string //输入
    type: string  //直选  包肖  包头尾 波色 单双  其他
    numbers: string[] // 号码
    amount: number // 号码 单注金额
    description?: string //描述
    timestamp: string  //时间戳
}
//下注记录
export interface PaoRecord {
    id: string
    inputValue: string //输入
    type: string  //直选  包肖  包头尾 波色 单双  其他
    numbers: string[] // 号码
    amount: number // 号码 单注金额
    description?: string //描述
    timestamp: string  //时间戳
}

//操作记录
//下注 撤销 抛出 改名 设置倍率 设置平码 设置特码 
export interface OperationRecord {
    id: string
    type: string // 'CREATE_SESSION' | 'SET_NAME' | 'SET_ODDS' | 'SET_FLAT_CODES' | 'SET_SPECIAL_CODE' | 'PLACE_BET' | 'CANCEL_BET'
    description?: string
    timestamp: string
    betRecord?: BetRecord
}