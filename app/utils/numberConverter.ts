//处理加注输入
export function convertChineseNumbers(text: string) {
    const chineseToArabic: any = {
        '一': '1',
        '二': '2',
        '三': '3',
        '四': '4',
        '五': '5',
        '六': '6',
        '七': '7',
        '八': '8',
        '九': '9',

    };

    const excludedCharacters = ['百', '千', '万', '亿'];

    if (text.includes('野肖')) {
        text = text.replace(/野肖/g, '龙虎蛇鼠兔猴');
    }
    if (text.includes('家肖')) {
        text = text.replace(/家肖/g, '牛马羊鸡狗猪');
    }

    // 检查文本是否包含排除字符中的任何一个，不转换
    if (excludedCharacters.some(char => text.includes(char))) {
        return text;
    }
    //遇到 一个  三个  九个 的情况直接返回
    if (/[一二三四五六七八九]个/.test(text)) {
        return text
    }
    //处理 十的情况
    if (text.includes('十')) {
        console.log(convertChineseNumber十(text))
        return convertChineseNumber十(text)
    }
    //不处理 百 的情况 数太大

    // 前后不是数字则转换
    return text.replace(
        /(?<!\d)[一二三四五六七八九](?!\d)/g,
        match => chineseToArabic[match]
    );
}

export default convertChineseNumbers;

const chineseToArabic: any = {
    '一': '1',
    '二': '2',
    '三': '3',
    '四': '4',
    '五': '5',
    '六': '6',
    '七': '7',
    '八': '8',
    '九': '9',
};

const chineseNumbersString = Object.keys(chineseToArabic).join(''); // "一二三四五六七八九"
function convertChineseNumber十(text: string): string {
    const index = text.indexOf('十');
    if (index !== -1) {
        const beforeChar = text[index - 1] as string; // "十" 前面的字符
        const afterChar = text[index + 1] as string;  // "十" 后面的字符
        // 如果前后都是中文数字（如 "五十五"）
        if (chineseNumbersString.includes(beforeChar) &&
            chineseNumbersString.includes(afterChar)) {
            const beforeNum = chineseToArabic[beforeChar];
            const afterNum = chineseToArabic[afterChar];
            return (
                text.slice(0, index - 1) +
                beforeNum + afterNum +
                text.slice(index + 2)
            );
        } else if (chineseNumbersString.includes(beforeChar) &&
            !chineseNumbersString.includes(afterChar)) {
            //五十
            const beforeNum = chineseToArabic[beforeChar];
            return (text.slice(0, index - 1) + beforeNum + '0' + text.slice(index + 1))
        } else if (!chineseNumbersString.includes(beforeChar) &&
            chineseNumbersString.includes(afterChar)) {
            //十五
            const afterNum = chineseToArabic[afterChar];
            return (text.slice(0, index) + '1' + afterNum + text.slice(index + 2))
        } else if (!chineseNumbersString.includes(beforeChar) &&
            !chineseNumbersString.includes(afterChar)) {
            //十
            return (text.slice(0, index) + '10' + text.slice(index + 1))
        }
        return text
    }
    return text; // 如果没有 "十" 或者不符合规则，返回原字符串
}


