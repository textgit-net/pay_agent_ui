
// noinspection JSUnusedLocalSymbols



export const useQuestions=defineStore("useQuestions",()=>{
    const tags=shallowRef<string[]>([])

    //获取标签
    const getTags=async ()=>{
        let { data} =await  useGet<any[]>("/cms/questions/tags")
        if(data){
            tags.value=data.map(value => value.name)
        }
    }

    /**
     * 添加标签
     * @param tag
     */
    const addTag=async (tag:string)=>{
        await usePost("/cms/questions/tags",{"tag":tag})
        tags.value.push(tag)
    }

    return{
        tags,
        getTags,
        addTag
    }
})
