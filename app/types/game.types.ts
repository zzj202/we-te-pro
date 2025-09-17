export interface GameSession {
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
  totalAmount: number // 总金额
  flatCodeOdds: number // 平码赔率
  specialCodeOdds: number // 特码赔率
  createdAt: string
  updatedAt: string
  betRecords: BetRecord[]   //加注记录列表
  operationRecords: OperationRecord[]  //操作记录列表  包括加注、减注 抛操作
  otherAdd: {
    id: string,
    inputValue: string,
    totalAmount: number
  }[]
  otherPao: {
    id: string,
    inputValue: string,
    totalAmount: number
  }[]
  status: string
}

export interface BetRecord {
  id: string
  inputValue: string //输入
  type: string  //直选  包肖  包头尾 波色 单双  其他
  numbers: string[] // 号码
  amount: number // 号码 单注金额
  description?: string //描述
  timestamp: string  //时间戳
}

export interface OperationRecord {
  id: string
  type: string // 'CREATE_SESSION' | 'SET_NAME' | 'SET_ODDS' | 'SET_FLAT_CODES' | 'SET_SPECIAL_CODE' | 'PLACE_BET' | 'CANCEL_BET'
  description?: string
  timestamp: string
  betRecord?: BetRecord
}

//mianStore
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