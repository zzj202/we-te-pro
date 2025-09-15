// stores/game.ts
import { defineStore } from 'pinia'
import { DEFAULT_SESSION } from '~/constants/game.constants'
import type { GameSession, BetRecord, OperationRecord, BetLine } from '~/types/game.types'
import { createDiscreteApi } from 'naive-ui'

const { dialog, message, loadingBar } = createDiscreteApi(
    ['dialog', 'message', 'loadingBar']
)
export const useGameStore = defineStore('game', {
    state: () => ({
        sessions: [] as GameSession[],
        currentSession: { ...DEFAULT_SESSION }, // 使用展开运算符创建新对象
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getSessionById: (state) => (id: string) => state.sessions.find(session => session.id === id),
        flatCodesTotalAmount: (state) => state.currentSession.flatCodes.reduce((total, code) => {
            const number = state.currentSession.numbers.find(n => n.number === code)
            return total + (number?.amount || 0)
        }, 0),
        specialCodeAmount: (state) => {
            if (!state.currentSession.specialCode) return 0
            const number = state.currentSession.numbers.find(n => n.number === state.currentSession.specialCode)
            return number?.amount || 0
        },
        recentOperations: (state) => [...state.currentSession.operationRecords]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5),
    },

    actions: {
        // 初始化加载数据
        //从redis 加载session 更新cur
        async loadSessions() {
            this.loading = true
            this.error = null
            try {
                loadingBar.start()
                const kvAPI = userKvAPI()
                const sessions = await kvAPI.get('game:sessions')
                if (sessions && sessions.length > 0) {
                    this.sessions = sessions
                    this.currentSession = this.getSessionById(this.currentSession.id) ? this.getSessionById(this.currentSession.id) : sessions[0]
                }
            } catch (error) {
                this.error = '加载场次数据失败'
                console.error(error)
            } finally {
                this.loading = false
                loadingBar.finish()
            }
        },

        // 保存当前状态到kvAPI
        //保存 session cur
        async saveTokvAPI() {
            const kvAPI = userKvAPI()
            try {
                loadingBar.start()
                await kvAPI.set('game:sessions', this.sessions)
            } catch (error) {
                this.error = '保存数据失败'
                console.error(error)
                throw error
            } finally {
                loadingBar.finish()
            }
        },
        //覆盖
        async reset() {
            this.sessions = []
            this.currentSession = { ...DEFAULT_SESSION }
            this.sessions.push(this.currentSession)
        },

        // 创建新场次
        async createNewSession(newSession: GameSession) {
            this.loading = true
            this.error = null
            try {
                newSession.id = Date.now().toString()
                newSession.createdAt = new Date().toISOString()
                newSession.updatedAt = new Date().toISOString()
                const kvAPI = userKvAPI()
                this.sessions.unshift(newSession)
                this.currentSession = newSession
                console.log('创建场次', this.currentSession)
                await kvAPI.set('game:sessions', this.sessions)

            } catch (error) {
                this.error = '创建场次失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 设置当前场次
        async setCurrentSession(id: string) {
            this.loading = true
            this.error = null
            try {
                this.currentSession = this.getSessionById(id) as GameSession
            } catch (error) {
                this.error = '设置当前场次失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 设置场次名称
        async setSessionName(name: string) {
            this.loading = true
            this.error = null
            try {
                this.currentSession.name = name
                this.currentSession.updatedAt = new Date().toISOString()
                this.saveCurrentSession()
            } catch (error) {
                this.error = '设置场次名称失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 设置赔率
        async setOdds({ flatCodeOdds, specialCodeOdds }: { flatCodeOdds?: number; specialCodeOdds?: number }) {
            this.loading = true
            this.error = null
            try {
                if (flatCodeOdds !== undefined) this.currentSession.flatCodeOdds = flatCodeOdds
                if (specialCodeOdds !== undefined) this.currentSession.specialCodeOdds = specialCodeOdds
                this.currentSession.updatedAt = new Date().toISOString()
                this.saveCurrentSession()
            } catch (error) {
                this.error = '设置赔率失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 设置平码号码
        async setFlatCodes(codes: string[]) {
            this.loading = true
            this.error = null
            try {
                if (codes.length > 6) throw new Error('平码最多只能设置6个号码')
                this.currentSession.flatCodes = codes
                this.currentSession.updatedAt = new Date().toISOString()
                this.saveCurrentSession()
            } catch (error) {
                this.error = '设置平码失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 设置特码号码
        async setSpecialCode(code: string) {
            this.loading = true
            this.error = null
            try {
                this.currentSession.specialCode = code
                this.currentSession.updatedAt = new Date().toISOString()
                this.saveCurrentSession()
            } catch (error) {
                this.error = '设置特码失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        //加注
        async place(addBetLines: BetLine | BetLine[]) {
            this.loading = true
            this.error = null
            try {
                loadingBar.start()
                // 统一转换为数组处理
                const tmp = Array.isArray(addBetLines) ? addBetLines : [addBetLines];
                const bets = tmp.filter(bet =>
                    bet.inputValue !== '' ||
                    (bet.selectedNumbers?.length ?? 0) > 0 ||
                    bet.amount !== 0
                );

                // 验证所有投注项
                const invalidBet = bets.find(bet => !bet.isValid);
                if (invalidBet) {
                    throw new Error(`无效的投注项，序号: ${invalidBet.index}`);
                }
                // 计算总加注金额
                const totalAmount = bets.reduce((sum, bet) => sum + bet.totalAmount, 0);
                // 创建所有投注记录
                const betRecords: BetRecord[] = bets.map(bet => ({
                    id: `${Date.now()}_${bet.index}`,
                    inputValue: bet.inputValue,
                    type: bet.type,
                    numbers: bet.selectedNumbers,
                    amount: bet.amount,
                    description: bet.description,
                    timestamp: new Date().toISOString(),
                }));
                this.currentSession.betRecords.unshift(...betRecords);
                this.currentSession.totalAmount += totalAmount;
                this.currentSession.updatedAt = new Date().toISOString();

                // 更新号码的投注金额和赔率
                bets.forEach(bet => {
                    bet.selectedNumbers.forEach(num => {
                        const numberObj = this.currentSession.numbers.find(n => n.number === num);
                        if (numberObj) {
                            numberObj.amount += bet.amount;
                        }
                    });
                });
                // 创建操作记录
                const operationRecord: OperationRecord = {
                    id: Date.now().toString(),
                    type: 'ADD_BET',
                    timestamp: new Date().toISOString(),
                    description: `加注 | 共加注${bets.length}个 | 加注总金额${totalAmount}元 | 原输入：${betRecords.map(record => record.inputValue).join('|')}`
                };
                this.currentSession.operationRecords.push(operationRecord);
                await this.saveCurrentSession()  //更新session  和 session:id
                message.success(`加注成功!总金额${totalAmount}元`)
                // 返回类型与输入类型一致
                return Array.isArray(addBetLines) ? betRecords : betRecords[0];
            } catch (error) {
                this.error = '加注失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
                loadingBar.finish()
            }
        },

        async placePao(addBetLines: BetLine | BetLine[]) {
            this.loading = true
            this.error = null
            try {
                loadingBar.start()
                // 统一转换为数组处理
                const tmp = Array.isArray(addBetLines) ? addBetLines : [addBetLines];
                const bets = tmp.filter(bet =>
                    bet.inputValue !== '' ||
                    (bet.selectedNumbers?.length ?? 0) > 0 ||
                    bet.amount !== 0
                );

                // 验证所有投注项
                const invalidBet = bets.find(bet => !bet.isValid);
                if (invalidBet) {
                    throw new Error(`无效的投注项，序号: ${invalidBet.index}`);
                }
                // 计算总加注金额
                const totalAmount = bets.reduce((sum, bet) => sum + bet.totalAmount, 0);

                // 更新号码的投注金额和赔率
                bets.forEach(bet => {
                    bet.selectedNumbers.forEach(num => {
                        const numberObj = this.currentSession.numbers.find(n => n.number === num);
                        if (numberObj) {
                            numberObj.paoAmount += bet.amount;
                        }
                    });
                });
                // 创建操作记录
                const operationRecord: OperationRecord = {
                    id: Date.now().toString(),
                    type: 'PAO_BET',
                    timestamp: new Date().toISOString(),
                    description: `抛单 | 共抛出${bets.length}个 | 抛出总金额${totalAmount}元 | 原输入：${bets.map(record => record.inputValue).join('|')}`
                };
                this.currentSession.operationRecords.push(operationRecord);
                await this.saveCurrentSession()  //更新session  和 session:id
                message.success(`抛出成功!总金额${totalAmount}元`)
            } catch (error) {
                this.error = '抛出失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
                loadingBar.finish()
            }
        },
        // 撤销加注
        async cancelBet(record: BetRecord) {
            this.loading = true
            this.error = null
            try {
                const index = this.currentSession.betRecords.findIndex(b => b.id === record.id)
                if (index === -1) return

                const bet = this.currentSession.betRecords[index]
                if (!bet) return

                bet.numbers.forEach(num => {
                    const number = this.currentSession.numbers.find(n => n.number === num)
                    if (number) {
                        number.amount -= bet.amount
                    }
                })
                this.currentSession.totalAmount -= bet.amount * bet.numbers.length
                this.currentSession.betRecords.splice(index, 1)
                this.currentSession.updatedAt = new Date().toISOString()

                // 创建操作记录
                const operationRecord: OperationRecord = {
                    id: Date.now().toString(),
                    type: 'CANCEL_BET',
                    timestamp: new Date().toISOString(),
                    description: `撤销号码${bet.numbers.join(',')}  单注金额${bet.amount}  ${bet.description}`
                };
                this.currentSession.operationRecords.push(operationRecord);
                await this.saveCurrentSession()  //更新session  和 session:id
                message.success('撤销成功')

            } catch (error) {
                this.error = '撤销加注失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 记录操作
        async recordOperation(operation: Omit<OperationRecord, 'id'>) {
            try {
                const opRecord: OperationRecord = {
                    id: Date.now().toString(),
                    ...operation,
                    timestamp: new Date().toISOString(),
                }
                this.currentSession.operationRecords.push(opRecord)
                this.saveCurrentSession()
            } catch (error) {
                console.error('记录操作失败:', error)
            }
        },

        // 保存当前场次到列表
        //session cur 同步更新
        async saveCurrentSession() {
            this.loading = true
            this.error = null
            try {
                const kvAPI = userKvAPI()
                const index = this.sessions.findIndex(s => s.id === this.currentSession.id)
                if (index !== -1) {
                    this.sessions[index] = JSON.parse(JSON.stringify(this.currentSession))
                } else {
                    this.sessions.push(JSON.parse(JSON.stringify(this.currentSession)))
                }
                console.log(this.currentSession)
                await kvAPI.set('game:sessions', this.sessions)
            } catch (error) {
                this.error = '保存场次失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },
        //保存指定场次
        //session cur 同步更新
        async saveSession(session: GameSession) {
            this.loading = true
            this.error = null
            try {
                const kvAPI = userKvAPI()
                const index = this.sessions.findIndex(s => s.id === session.id)
                if (index !== -1) {
                    this.sessions[index] = JSON.parse(JSON.stringify(session))
                } else {
                    this.sessions.push(JSON.parse(JSON.stringify(session)))
                }
                await kvAPI.set('game:sessions', this.sessions)
            } catch (error) {
                this.error = '保存场次失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }

        },

        // 删除指定场次
        async deleteSession(id: string) {
            this.loading = true
            this.error = null
            try {
                const kvAPI = userKvAPI()
                await kvAPI.del(`game:session:${id}`)
                this.sessions = this.sessions.filter(s => s.id !== id)
                if (this.currentSession.id === id && this.sessions.length == 0) {
                    this.currentSession = { ...DEFAULT_SESSION }
                } else {
                    this.currentSession = this.sessions[0] as GameSession
                }
                await kvAPI.set('game:sessions', this.sessions)
            } catch (error) {
                this.error = '删除场次失败'
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },
    },
    // 持久化配置
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})

