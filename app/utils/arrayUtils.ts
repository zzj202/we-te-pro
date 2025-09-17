/**
 * 判断数组中是否有重复元素
 * @param arr 要检查的数组
 * @returns 如果有重复返回 true，否则返回 false
 */
export const hasDuplicates = <T>(arr: T[]): boolean => {
    return new Set(arr).size !== arr.length
}

/**
 * 判断数组中是否包含特定字符串（不区分大小写）
 * @param arr 要搜索的数组
 * @param searchString 要查找的字符串
 * @returns 如果找到返回 true，否则返回 false
 */
export const containsStringIgnoreCase = (arr: string[], searchString: string): boolean => {
    return arr.some(item => item.toLowerCase() === searchString.toLowerCase())
}

/**
 * 判断数组中是否包含特定字符串（区分大小写）
 * @param arr 要搜索的数组
 * @param searchString 要查找的字符串
 * @returns 如果找到返回 true，否则返回 false
 */
export const containsString = (arr: string[], searchString: string): boolean => {
    return arr.includes(searchString)
}

/**
 * 判断数组中是否包含特定元素（使用严格相等）
 * @param arr 要搜索的数组
 * @param element 要查找的元素
 * @returns 如果找到返回 true，否则返回 false
 */
export const containsElement = <T>(arr: T[], element: T): boolean => {
    return arr.includes(element)
}

export default {
    hasDuplicates,
    containsStringIgnoreCase,
    containsString,
    containsElement
}