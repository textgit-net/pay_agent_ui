export enum DateSearchTypeEnum {
    yestoday = 'yestoday',
    today = 'today',
    last7days = 'last7days',
    last30days = 'last30days',
    last90days = 'last90days',
    customRangeDate = 'customRangeDate',
}

export const getDateSearchTypeEnumText = (type: DateSearchTypeEnum): string => {
    switch (type) {
        case DateSearchTypeEnum.yestoday:
            return '昨日'
        case DateSearchTypeEnum.today:
            return '今日'
        case DateSearchTypeEnum.last7days:
            return '最近一周'
        case DateSearchTypeEnum.last30days:
            return '最近一个月'
        case DateSearchTypeEnum.last90days:
            return '最近三个月'
        case DateSearchTypeEnum.customRangeDate:
            return '自定义时间'
    }
}