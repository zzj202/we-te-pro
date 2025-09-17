// utils/numberUtils.ts

/**
 * 判断字符串数字是否在01-49范围内
 * @param numStr 要检查的字符串数字，如"01"、"49"等
 * @returns 如果在01-49范围内返回true，否则返回false
 */
export const isNumberInRange01to49 = (numStr: string): boolean => {
  // 检查是否为有效的两位数格式
  if (!/^\d{2}$/.test(numStr)) {
    return false
  }

  // 转换为数字
  const num = parseInt(numStr, 10)

  // 检查是否在1-49范围内
  return num >= 1 && num <= 49
}

/**
 * 判断字符串数字是否在01-49范围内（允许一位数前面不加0）
 * @param numStr 要检查的字符串数字，如"1"、"01"、"49"等
 * @returns 如果在1-49范围内返回true，否则返回false
 */
export const isNumberInRange1to49 = (numStr: string): boolean => {
  // 检查是否为有效数字格式
  if (!/^\d{1,2}$/.test(numStr)) {
    return false
  }

  // 转换为数字
  const num = parseInt(numStr, 10)

  // 检查是否在1-49范围内
  return num >= 1 && num <= 49
}
/**
 * 判断字符串数组中的所有数字是否都在01-49范围内（严格两位数格式）
 * @param numArray 要检查的字符串数字数组，如["01", "02", ..., "49"]
 * @returns 如果所有元素都在01-49范围内返回true，否则返回false
 */
export const isAllNumbersInRange01to49 = (numArray: string[]): boolean => {
  if (!Array.isArray(numArray)) {
    return false
  }

  return numArray.every(num => {
    // 检查是否为有效的两位数格式
    if (!/^\d{2}$/.test(num)) {
      return false
    }

    // 转换为数字
    const numInt = parseInt(num, 10)

    // 检查是否在1-49范围内
    return numInt >= 1 && numInt <= 49
  })
}

/**
 * 判断字符串数组中的所有数字是否都在1-49范围内（宽松格式）
 * @param numArray 要检查的字符串数字数组，如["1", "02", "49"]
 * @returns 如果所有元素都在1-49范围内返回true，否则返回false
 */
export const isAllNumbersInRange1to49 = (numArray: string[]): boolean => {
  if (!Array.isArray(numArray)) {
    return false
  }

  return numArray.every(num => {
    // 检查是否为有效数字格式
    if (!/^\d{1,2}$/.test(num)) {
      return false
    }

    // 转换为数字
    const numInt = parseInt(num, 10)

    // 检查是否在1-49范围内
    return numInt >= 1 && numInt <= 49
  })
}

/**
 * 判断字符串数组中的所有数字是否都在1-49范围内，并返回无效数字
 * @param numArray 要检查的字符串数字数组
 * @returns { valid: boolean; invalidNumbers: string[] } 包含验证结果和无效数字数组
 */
export const validateNumbersInRange1to49WithDetails = (numArray: string[]): { valid: boolean; invalidNumbers: string[] } => {
  if (!Array.isArray(numArray)) {
    return { valid: false, invalidNumbers: [] }
  }

  const invalidNumbers: string[] = []

  numArray.forEach(num => {
    if (!/^\d{1,2}$/.test(num)) {
      invalidNumbers.push(num)
      return
    }

    const numInt = parseInt(num, 10)
    if (numInt < 1 || numInt > 49) {
      invalidNumbers.push(num)
    }
  })

  return {
    valid: invalidNumbers.length === 0,
    invalidNumbers
  }
}

export default {
  isNumberInRange01to49,
  isNumberInRange1to49,
  isAllNumbersInRange01to49,
  isAllNumbersInRange1to49,
  validateNumbersInRange1to49WithDetails
}