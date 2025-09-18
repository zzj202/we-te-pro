// stores/races.store.ts
import { defineStore } from 'pinia'
import { DEFAULT_CREATE_RACE_CATEGORY, DEFAULT_RACE_CATEGORYS, DEFAULT_RACE } from '~/constants/race.constants'
import type { RaceCategory, Race, BetLine, BetRecord, OperationRecord } from '~/types/race.types'
import { createDiscreteApi } from 'naive-ui'
import dayjs from 'dayjs'

const { message, loadingBar } = createDiscreteApi(
    ['message', 'loadingBar']
)

export const useRaceStore = defineStore('race', {
    state: () => ({
        raceCategories: DEFAULT_RACE_CATEGORYS as RaceCategory[],
        currentCategoryId: '',
        currentRaceId: '',
    }),
    getters: {
        // 获取所有比赛分类列表
        allRaceCategories: (state) => state.raceCategories,
        // 获取特定分类的比赛列表
        getRacesByCategoryById: (state) => (categoryId: string) => {
            return state.raceCategories.find(cat => cat.id === categoryId)?.races || []
        },
        // 获取特定分类的比赛列表
        getRacesByCategoryByName: (state) => (categoryName: string) => {
            return state.raceCategories.find(cat => cat.name === categoryName)?.races || []
        },
        // 获取特定比赛
        //从所有category找
        getRaceByRaceId: (state) => (raceId: string) => {
            // 遍历所有分类
            for (const category of state.raceCategories) {
                // 在当前分类中查找匹配的比赛
                const race = category.races.find(r => r.id === raceId)
                if (race) {
                    // 如果找到匹配的比赛，返回比赛数据和所属分类信息
                    return race
                }
            }
            // 如果没有找到，返回 null
            return null
        },
        //获取特点比赛 高效
        getRaceByCategoryIdRaceId: (state) => (categoryId: string, raceId: string) => {
            // 先找到对应的分类
            const category = state.raceCategories.find(cat => cat.id === categoryId)
            if (!category) {
                return null
            }
            // 在分类中查找对应的比赛
            const race = category.races.find(r => r.id === raceId)
            if (!race) {
                return null
            }
            // 返回比赛数据和所属分类信息
            return race
        },
        //通过raceID获取比赛分类 
        getCategoryByRaceId: (state) => (raceId: string) => {
            // 遍历所有分类
            for (const category of state.raceCategories) {
                // 在当前分类中查找匹配的比赛
                const race = category.races.find(r => r.id === raceId)
                if (race) {
                    // 如果找到匹配的比赛，返回比赛数据和所属分类信息
                    return category
                }
            }
            // 如果没有找到，返回 null
            return null
        },
        //如果current不为空 则获取当前比赛分类
        getCurrentCategory: (state) => () => {
            return state.raceCategories.find(cat => cat.id === state.currentCategoryId) || null
        },
        //如果current不为空 则获取当前比赛
        //从categoryId找
        getCurrentRace: (state) => () => {
            const category = state.raceCategories.find(cat => cat.id === state.currentCategoryId)
            if (!category) {
                message.warning(`当前未选择比赛类别`)
                return null
            }
            // 在分类中查找对应的比赛
            const race = category.races.find(r => r.id === state.currentRaceId)
            if (!race) {
                message.warning(`当前未选择场次`)
                return null
            }
            // 返回比赛数据和所属分类信息
            return race
        }
    },

    actions: {
        // 添加新的比赛分类
        addCategory(categoryName: string) {
            this.loadFromKvAPI()
            this.raceCategories.push({
                ...DEFAULT_CREATE_RACE_CATEGORY,
                id: generateUniqueId(),
                name: categoryName
            })
            this.saveTokvAPI()
        },
        // 添加比赛到特定分类
        async addRace(categoryName: string): Promise<RaceCategory> {
            await this.loadFromKvAPI()
            const category = this.raceCategories.find(cat => cat.name === categoryName) as RaceCategory
            if (category) {
                const raceId = generateUniqueId()
                category.races.unshift({
                    ...DEFAULT_RACE,
                    name: `${category.name}_${category.races.length + 1}`,
                    id: raceId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                this.currentCategoryId = category.id
                this.currentRaceId = raceId
                message.success(`创建成功`)
            } else {
                message.error(`未找到该比赛种类`)
            }
            await this.saveTokvAPI()
            return category
        },
        //设置currentCategoryId
        setCurrentCategoryId(categoryId: string) {
            this.currentCategoryId = categoryId
        },
        //设置currentRaceId
        setCurrentRaceId(raceId: string) {
            this.currentRaceId = raceId
            this.currentCategoryId = this.getCategoryByRaceId(raceId)?.id as string
        },

        //从redis上加载
        async loadFromKvAPI() {
            const kvAPI = userKvAPI()
            const categories = await kvAPI.get('race:category')
            if (categories) {
                this.raceCategories = categories
                if (!this.currentCategoryId) {
                    this.currentCategoryId = categories[0].id
                    this.currentRaceId = categories[0].races[0].id
                }

            }
        },
        //保存redis
        async saveTokvAPI() {
            const kvAPI = userKvAPI()
            await kvAPI.set('race:category', this.raceCategories)
        },


        //加注
        async place(addBetLines: BetLine | BetLine[]) {
            //首先获取race
            await this.loadFromKvAPI()
            const race = this.getRaceByCategoryIdRaceId(this.currentCategoryId, this.currentRaceId)
            if (!race) {
                message.error(`场次不存在`)
                return
            }
            const tmp = Array.isArray(addBetLines) ? addBetLines : [addBetLines];
            const bets = tmp.filter(bet =>
                bet.inputValue !== '' ||
                (bet.selectedNumbers?.length ?? 0) > 0 ||
                bet.amount !== 0
            );
            // 验证所有投注项
            const invalidBet = bets.find(bet => !bet.isValid);
            if (invalidBet) {
                message.error(`无效的投注项，序号: ${invalidBet.index}`);
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
            race.betRecords.unshift(...betRecords)
            race.addTotalAmount += totalAmount
            race.updatedAt = new Date().toISOString()
            // 更新号码的投注金额
            bets.forEach(bet => {
                bet.selectedNumbers.forEach(num => {
                    const numberObj = race.numbers.find(n => n.number === num);
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
            race.operationRecords.push(operationRecord)
            await this.saveTokvAPI()  //更新session  和 session:id
            message.success(`加注成功!共${bets.length}条！总金额${totalAmount}元`)
        },
        //抛注
        async placePao(addBetLines: BetLine | BetLine[]) {
            await this.loadFromKvAPI()
            //首先获取race
            const race = this.getRaceByCategoryIdRaceId(this.currentCategoryId, this.currentRaceId)
            if (!race) {
                message.error(`场次不存在`)
                return
            }
            const tmp = Array.isArray(addBetLines) ? addBetLines : [addBetLines];
            const bets = tmp.filter(bet =>
                bet.inputValue !== '' ||
                (bet.selectedNumbers?.length ?? 0) > 0 ||
                bet.amount !== 0
            );
            // 验证所有投注项
            const invalidBet = bets.find(bet => !bet.isValid);
            if (invalidBet) {
                message.error(`无效的投注项，序号: ${invalidBet.index}`);
            }
            // 计算总加注金额
            const totalAmount = bets.reduce((sum, bet) => sum + bet.totalAmount, 0);
            // 创建所有投注记录
            const paoRecords: BetRecord[] = bets.map(bet => ({
                id: `${Date.now()}_${bet.index}`,
                inputValue: bet.inputValue,
                type: bet.type,
                numbers: bet.selectedNumbers,
                amount: bet.amount,
                description: bet.description,
                timestamp: new Date().toISOString(),
            }));
            race.paoRecords.unshift(...paoRecords)
            race.paoTotalAmount += totalAmount
            race.updatedAt = new Date().toISOString()
            // 更新号码的投注金额
            bets.forEach(bet => {
                bet.selectedNumbers.forEach(num => {
                    const numberObj = race.numbers.find(n => n.number === num);
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
                description: `抛注 | 共抛出${bets.length}个 | 抛出总金额${totalAmount}元 | 原输入：${bets.map(record => record.inputValue).join('|')}`
            };
            race.operationRecords.push(operationRecord)
            await this.saveTokvAPI()  //更新session  和 session:id
            message.success(`抛出成功!共${bets.length}条！总金额${totalAmount}元`)
        },
        //撤销加注
        async cancelBet(record: BetRecord) {
            await this.loadFromKvAPI()
            //首先获取race
            const race = this.getRaceByCategoryIdRaceId(this.currentCategoryId, this.currentRaceId)
            if (!race) {
                message.error(`场次不存在`)
                return
            }
            const index = race.betRecords.findIndex(b => b.id === record.id)
            if (index === -1) return
            const bet = race.betRecords[index]
            if (!bet) return
            bet.numbers.forEach(num => {
                const number = race.numbers.find(n => n.number === num)
                if (number) {
                    number.amount -= bet.amount
                }
            })
            race.addTotalAmount -= bet.amount * bet.numbers.length
            race.betRecords.splice(index, 1)
            race.updatedAt = new Date().toISOString()

            // 创建操作记录
            const operationRecord: OperationRecord = {
                id: Date.now().toString(),
                type: 'CANCEL_BET',
                timestamp: new Date().toISOString(),
                description: `撤销加注号码${bet.numbers.join(',')}  单注金额${bet.amount}  ${bet.description}`
            };
            race.operationRecords.push(operationRecord)
            await this.saveTokvAPI()
            message.success('撤销成功')
        },
        //撤销抛注
        async cancelPao(record: BetRecord) {
            await this.loadFromKvAPI()
            //首先获取race
            const race = this.getRaceByCategoryIdRaceId(this.currentCategoryId, this.currentRaceId)
            if (!race) {
                message.error(`场次不存在`)
                return
            }
            const index = race.paoRecords.findIndex(b => b.id === record.id)
            if (index === -1) return
            const bet = race.paoRecords[index]
            if (!bet) return
            bet.numbers.forEach(num => {
                const number = race.numbers.find(n => n.number === num)
                if (number) {
                    number.paoAmount -= bet.amount
                }
            })
            race.paoTotalAmount -= bet.amount * bet.numbers.length
            race.paoRecords.splice(index, 1)
            race.updatedAt = new Date().toISOString()

            // 创建操作记录
            const operationRecord: OperationRecord = {
                id: Date.now().toString(),
                type: 'CANCEL_PAO',
                timestamp: new Date().toISOString(),
                description: `撤销抛注号码${bet.numbers.join(',')}  单注金额${bet.amount}  ${bet.description}`
            };
            race.operationRecords.push(operationRecord)
            await this.saveTokvAPI()
            message.success('撤销成功')
        },

        // 更新比赛信息
        updateRace(categoryId: string, raceId: string, updates: Partial<Race>) {
            const category = this.raceCategories.find(cat => cat.id === categoryId)
            if (category) {
                const raceIndex = category.races.findIndex(r => r.id === raceId) as number
                if (raceIndex !== -1 && category.races[raceIndex]) {
                    category.races[raceIndex] = {
                        ...category.races[raceIndex],
                        ...updates
                    }
                }
            }
        },

        // 删除比赛
        async removeRace(raceId: string) {
            await this.loadFromKvAPI();
            let removedRace = null;

            // 遍历所有分类
            for (const category of this.raceCategories) {
                // 查找比赛索引
                const raceIndex = category.races.findIndex(r => r.id === raceId);
                if (raceIndex !== -1) {
                    // 从分类中删除比赛
                    category.races.splice(raceIndex, 1);
                    this.currentRaceId = category.races[0]?.id as string
                    break;  // 找到并删除后退出循环
                }
            }
            // 保存更改到 KV API
            await this.saveTokvAPI();
            // 返回被删除的比赛信息（可选）
            return removedRace;
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})