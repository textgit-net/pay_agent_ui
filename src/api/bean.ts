/**
 * 广告报表数据
 */
export  interface AdReport{
    //每天打开应用的独立用户数(API)
    apiDau:number
    //每天打开应用的独立用户数
    dau:number
    //通过Report API统计的ARPDAU
    apiArPuDau:number
    //人均收益, ARPDAU=收益/DAU
    arPuDau:number
    apiCtr:number
    //收益(Api)
    apiRevenue:number
    //预估收益
    revenue:number
    //点击率(API)
    apiClickGapRate:number
    //点击率
    clickGapRate:number
    //点击量(API)
    apiClickCnt:number
    //点击量
    clickCnt:number
    //ecpm
    ecPm:number
    //ecpm(API)
    apiEcPm:number
    //展示/DAU<人均展示次数，IPU=展示/DAU>
    apiIPU:number
    //流量请求量
    waterfallReqCnt:number
    //流量填充率
    waterfallSr:number
    //流量展示率
    waterfallSSR:number
    //广告请求量
    reqCnt?:number
    //广告填充率
    fillRate:number
    //展示量
    ipmCnt:number
    //展示率
    mediaMSsr:number
    //渗透率<观看过广告的用户占比，渗透率=DEU/DAU>
    appEngagementRate:number
}