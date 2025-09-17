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
        },
        removePrize(categoryId: string, prizeId: string) {
            const category = this.prizeCategories.find(cat => cat.id === categoryId) as PrizeCategory
            const prizeIndex = category.prizes.findIndex(prize => prize.id === prizeId);
            if (prizeIndex === -1) {
                message.error('不存在')
                return;
            }
            category.prizes.splice(prizeIndex, 1);
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})