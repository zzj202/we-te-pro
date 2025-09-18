// stores/races.store.ts
import { defineStore } from 'pinia'
import { DEFAULT_CREATE_RACE_CATEGORY, DEFAULT_RACE_CATEGORYS, DEFAULT_RACE, DEFAULT_PRIZE_CATEGORYS } from '~/constants/race.constants'
import type { PrizeCategory, Prize } from '~/types/race.types'
import { createDiscreteApi } from 'naive-ui'

const { message, loadingBar } = createDiscreteApi(
    ['message', 'loadingBar']
)

export const usePrizeStore = defineStore('prize', {
    state: () => ({
        prizeCategories: DEFAULT_PRIZE_CATEGORYS as PrizeCategory[],
        currentCategoryId: '',
    }),
    getters: {
        // 获取所有比赛分类历史中奖记录列表
        allPrizeCategories: (state) => state.prizeCategories,
        //如果current不为空 则获取当前比赛分类 历史开奖记录
        getCurrentCategory: (state) => () => {
            console.log(state.currentCategoryId)
            return state.prizeCategories.find(cat => cat.id === state.currentCategoryId) || null
        },
    },

    actions: {
        //覆盖
        setByCategoryId(categoryId: string, prizes: Prize[]) {
            const category = this.prizeCategories.find(cat => cat.id === categoryId) as PrizeCategory
            category.prizes = prizes
        },
        //currentCategoryId
        setCurrentCategoryId(categoryId: string) {
            this.currentCategoryId = categoryId
        },
        addPrize(categoryId: string, prize: Prize) {
            const category = this.prizeCategories.find(cat => cat.id === categoryId) as PrizeCategory
            category.prizes.unshift(prize)
            this.saveTokvAPI()
        },
        removePrize(categoryId: string, prizeId: string) {
            const category = this.prizeCategories.find(cat => cat.id === categoryId) as PrizeCategory
            const prizeIndex = category.prizes.findIndex(prize => prize.id === prizeId);
            if (prizeIndex === -1) {
                message.error('不存在')
                return;
            }
            category.prizes.splice(prizeIndex, 1);
        },


        //从redis上加载
        async loadFromKvAPI() {
            const kvAPI = userKvAPI()
            const categories = await kvAPI.get('prize:category')
            if (categories) {
                this.prizeCategories = categories
            }
        },
        //保存redis
        async saveTokvAPI() {
            const kvAPI = userKvAPI()
            await kvAPI.set('prize:category', this.prizeCategories)
        },

        //统计出号码最近一次出现 距离
        getNumberLastAppearBycategoryId() {
            const category = this.prizeCategories.find(cat => cat.id === this.currentCategoryId);
            if (!category || !category.prizes || category.prizes.length === 0) {
                return {};
            }
            const sortedPrizes = category.prizes
            const result: Record<string, number> = {};
            // 初始化01-49所有号码，默认距离为-1（表示从未出现过）
            for (let i = 1; i <= 49; i++) {
                const num = i.toString().padStart(2, '0'); // 格式化为两位数，如01, 02,...49
                result[num] = -1;
            }
            // 遍历每一期开奖记录
            sortedPrizes.forEach((prize, index) => {
                if (prize.numbers) {
                    prize.numbers.forEach(num => {
                        // 如果这个号码的距离还是-1（即第一次出现），则设置距离为当前期数索引
                        if (result[num] === -1) {
                            result[num] = index + 1;
                        }
                    });
                }
            });
            return result;
        },
        /**
         * 统计每个号码在历史开奖中出现的总次数
         * @returns {Object} 返回一个对象，键是号码字符串(如'01')，值是该号码出现的总次数
         */
        getNumberFrequency() {
            // 1. 查找当前类别的彩票数据
            const category = this.prizeCategories.find(cat => cat.id === this.currentCategoryId);
            // 2. 如果没有数据或没有奖项数据，返回空对象
            if (!category?.prizes?.length) return {};

            // 3. 初始化频率统计对象
            const frequency: Record<string, number> = {};

            // 4. 初始化所有号码(01-49)的出现次数为0
            for (let i = 1; i <= 49; i++) {
                frequency[i.toString().padStart(2, '0')] = 0;
            }

            // 5. 遍历每一期开奖数据
            category.prizes.forEach(prize => {
                // 6. 遍历当期开出的每个号码
                prize.numbers?.forEach(num => {
                    // 7. 对应号码的出现次数加1
                    frequency[num]++;
                });
            });

            return frequency;
        },
        /**
         * 统计每个号码的平均出现间隔期数
         * @returns {Object} 返回一个对象，键是号码字符串，值是该号码的平均间隔期数
         */
        getNumberAverageGaps() {
            // 1. 查找当前类别的彩票数据
            const category = this.prizeCategories.find(cat => cat.id === this.currentCategoryId);
            // 2. 如果没有数据或没有奖项数据，返回空对象
            if (!category?.prizes?.length) return {};

            // 3. 初始化间隔统计对象，记录总和和出现次数
            const gaps: Record<string, { sum: number, count: number }> = {};
            // 4. 记录每个号码最后一次出现的期数索引
            const lastAppear: Record<string, number> = {};

            // 5. 初始化所有号码(01-49)的数据
            for (let i = 1; i <= 49; i++) {
                const num = i.toString().padStart(2, '0');
                gaps[num] = { sum: 0, count: 0 }; // 间隔总和和出现次数
                lastAppear[num] = -1; // -1表示尚未出现过
            }

            // 6. 遍历每一期开奖数据（带索引）
            category.prizes.forEach((prize, index) => {
                prize.numbers?.forEach(num => {
                    // 7. 如果这个号码之前出现过（不是第一次出现）
                    if (lastAppear[num] !== -1) {
                        // 8. 计算当前期与上次出现的间隔，并累加到总和
                        gaps[num].sum += (index - lastAppear[num]);
                        // 9. 出现次数加1
                        gaps[num].count++;
                    }
                    // 10. 更新该号码最后一次出现的期数索引
                    lastAppear[num] = index;
                });
            });

            // 11. 计算每个号码的平均间隔
            const result: Record<string, number> = {};
            Object.keys(gaps).forEach(num => {
                result[num] = gaps[num].count > 0
                    ? Math.round(gaps[num].sum / gaps[num].count) // 计算平均值并四舍五入
                    : category.prizes.length; // 从未出现过的号码，默认间隔为总期数
            });

            return result;
        },
        /**
         * 统计每个号码的最大连续出现期数
         * @returns {Object} 返回一个对象，键是号码字符串，值是包含max(最大连出)和current(当前连出)的对象
         */
        getNumberConsecutiveStats() {
            // 1. 查找当前类别的彩票数据
            const category = this.prizeCategories.find(cat => cat.id === this.currentCategoryId);
            // 2. 如果没有数据或没有奖项数据，返回空对象
            if (!category?.prizes?.length) return {};

            // 3. 初始化统计对象，记录最大连出和当前连出
            const stats: Record<string, { max: number, current: number }> = {};

            // 4. 初始化所有号码(01-49)的数据
            for (let i = 1; i <= 49; i++) {
                stats[i.toString().padStart(2, '0')] = { max: 0, current: 0 };
            }

            // 5. 记录上一期的开奖号码
            let prevNumbers: string[] = [];

            // 6. 遍历每一期开奖数据
            category.prizes.forEach(prize => {
                const currentNumbers = prize.numbers || [];

                // 7. 重置不在当前期的号码的current值（连出中断）
                Object.keys(stats).forEach(num => {
                    if (!currentNumbers.includes(num)) {
                        stats[num].current = 0;
                    }
                });

                // 8. 更新在当前期的号码的连出数据
                currentNumbers.forEach(num => {
                    // 9. 当前连出次数加1
                    stats[num].current++;
                    // 10. 更新最大连出次数
                    if (stats[num].current > stats[num].max) {
                        stats[num].max = stats[num].current;
                    }
                });

                // 11. 更新上一期号码
                prevNumbers = currentNumbers;
            });

            return stats;
        },
        /**
         * 分析号码的冷热程度（近期出现频率）
         * @param {number} recentPeriods 考虑的近期期数，默认为30期
         * @returns {Object} 返回一个对象，键是号码字符串，值包含recent(近期出现次数)、total(总出现次数)和hotRatio(热度比率)
         */
        getNumberHotColdAnalysis(recentPeriods = 30) {
            // 1. 查找当前类别的彩票数据
            const category = this.prizeCategories.find(cat => cat.id === this.currentCategoryId);
            // 2. 如果没有数据或没有奖项数据，返回空对象
            if (!category?.prizes?.length) return {};

            // 3. 获取最近N期的开奖数据
            const recentPrizes = category.prizes.slice(0, recentPeriods);
            // 4. 获取总期数
            const allPrizesCount = category.prizes.length;

            // 5. 初始化结果对象
            const result: Record<string, {
                recent: number,   // 近期出现次数
                total: number,    // 总出现次数
                hotRatio: number  // 热度比率（近期出现次数/近期期数）
            }> = {};

            // 6. 初始化所有号码(01-49)的数据
            for (let i = 1; i <= 49; i++) {
                const num = i.toString().padStart(2, '0');
                result[num] = { recent: 0, total: 0, hotRatio: 0 };
            }

            // 7. 统计每个号码的总出现次数
            category.prizes.forEach(prize => {
                prize.numbers?.forEach(num => {
                    result[num].total++;
                });
            });

            // 8. 统计每个号码在近期的出现次数
            recentPrizes.forEach(prize => {
                prize.numbers?.forEach(num => {
                    result[num].recent++;
                });
            });

            // 9. 计算每个号码的热度比率（近期出现频率）
            Object.keys(result).forEach(num => {
                result[num].hotRatio = result[num].recent / recentPeriods;
            });

            return result;
        }

    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})