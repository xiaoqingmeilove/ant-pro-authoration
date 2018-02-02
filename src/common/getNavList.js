export const getNavList = (value,menusData,count=0) => {
    for(let i=0;i<menusData.length;i++){
        if(count == value.length - 1){
            if(value[count] == menusData[i].path){
                console.log(menusData[i].name)
                const title = menusData[i].name
                return title
            }
        }
        else if(value[count] == menusData[i].path){           
            count = count+1
            let temp = menusData[i].children.slice(0)        
            return getNavList(value,temp,count)
        }
    }
}