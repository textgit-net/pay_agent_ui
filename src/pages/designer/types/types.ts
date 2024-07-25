import {uuid} from "vue-uuid";

export enum WidgetType{
    TEXT=1,
    IMAGE=2,
    TITLE=3,
    BUTTON=4,
    SWIPER=5,
    NOTICE=6,
    PRODUCT_LIST=7,
    VIDEO=8,
    COMBO=9
}

export const getWidgetName=(type:WidgetType)=>{
    switch (type){
        case WidgetType.BUTTON:
            return "按钮"
        case WidgetType.COMBO:
            return "添加组合"
        case WidgetType.IMAGE:
            return "图片"
        case WidgetType.NOTICE:
            return "公告"
        case WidgetType.PRODUCT_LIST:
            return "商品列表"
        case WidgetType.SWIPER:
            return "轮播"
        case WidgetType.TEXT:
            return "文本"
        case WidgetType.TITLE:
            return "标题"
        case WidgetType.VIDEO:
            return "视频"
    }
}

export const basicWidgets=[
    WidgetType.TEXT,
    WidgetType.IMAGE,
    WidgetType.BUTTON,
    WidgetType.TITLE,
    WidgetType.PRODUCT_LIST,
    WidgetType.VIDEO,
    WidgetType.SWIPER,
    WidgetType.NOTICE,
    WidgetType.COMBO
]

/**
 *对其
 */
export enum StyleAlignment{
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    CENTER_LEFT,
    CENTER,
    CENTER_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT
}

/**
 * 位置
 */
export enum StylePosition{
    LEFT,
    TOP,
    RIGHT,
    BOTTOM
}
/**
 * 边框样试
 */
export enum StyleBorderType{
    NONE="none",
    /**
     * 实钱
     */
    SOLID="solid",
    /**
     * 点
     */
    DOTTED="dotted",
    /**
     * 虚线
     */
    DASHED="dashed"
}

/**
 * 边框大小
 */
export class StyleBorderSize{
    public left:number=0
    public top:number=0
    public right:number=0
    public bottom:number=0

    static all(size:number):StyleBorderSize{
        return {
            left:size,
            top:size,
            right:size,
            bottom:size
        }
    }
}

/**
 * 边框圆角
 */
export class StyleBorderRadius{
    /**
     * 左上
     */
    topLeft:number=0
    /**
     * 右上
     */
    topRight:number=0
    /**
     * 左下
     */
    bottomLeft:number=0
    /**
     * 右下
     */
    bottomRight:number=0

    static all(size:number):StyleBorderRadius{
        return {
        topLeft:size,
        topRight:size,
        bottomLeft:size,
        bottomRight:size
    }
    }
}

/**
 * 边框属性
 */
export class StyleBorder{
    public borderStyle:StyleBorderType=StyleBorderType.NONE
    public borderSize:StyleBorderSize=StyleBorderSize.all(0)
    public borderRadius:StyleBorderRadius=StyleBorderRadius.all(0)
    public borderColor:String="#00000000"
}

export class StyleMargin{
    public left?:number=undefined
    public top:number=0
    public right?:number=undefined
    public bottom:number=0

    static all(size:number):StyleMargin{
        return {
            left:size,
            top:size,
            right:size,
            bottom:size
        }
    }
}
/**
 * 基础组件样式
 */
export class BaseComponentStyleAttribute{
   public border:StyleBorder=new StyleBorder()
   public height:Number=25
   public width:Number=Number.MAX_VALUE
   public margin:StyleMargin=new StyleMargin()
   public backgroundColor:String="#fffff"


   getWidth(){
       return this.width==Number.MAX_VALUE?320:this.width
   }

   getHeight(){
       return this.height==Number.MAX_VALUE?320:this.height
   }
}

/**
 * 组件基类
 */
export class BaseComponent<S extends BaseComponentStyleAttribute>{
    /**
     * 组件类型
     */
    public type:WidgetType
    /**
     * 组件Id
     */
    public id:string
    /**
     *组件样式
     */
    public style:S

    constructor(type:WidgetType,style:S) {
        this.type=type
        this.id=uuid.v4()
        this.style=style
    }
}


export class TextComponentStyle extends BaseComponentStyleAttribute{
    textAlignment:StyleAlignment=StyleAlignment.BOTTOM_LEFT
    public fontSize:Number=14;
    public fontColor:String="#404040"
    public fontWeight:Number=400;
    constructor(props) {
        super(props)
        this.height=25
    }

}

export class ImageComponent extends BaseComponent<BaseComponentStyleAttribute>{
    public src:String="data:image/png;base64,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";
    constructor() {
        super(WidgetType.IMAGE,new BaseComponentStyleAttribute());
        this.style.height=140;
    }
}
export class TextComponent extends BaseComponent<TextComponentStyle>{
    public content:String=""
    constructor(content:String) {
       super(WidgetType.TEXT,new TextComponentStyle())
       this.content=content
    }
}