// const Hash=new Array(10);
// Hash.fill([])
// console.log(Hash)

// function getHash(string){
//     let hash=0;
//     for(let i=0;i<string.length;i++){
//         hash+=string.charCodeAt(i)
//     }
//     return hash%7

// }
// console.log(getHash("#w004"))
// let count =0;
// for(let i=0;i<10;i++){
//     if(Hash[i][0]==undefined){
//         count++;
//     }
// }
// console.log(count)

function convert(date){
    let dat=date.getFullYear().toString();
    if(date.getMonth()<9){
        dat+="-0"+(date.getMonth()+1)
    }
    else{
        dat+='-'+date.getMonth()
    }
    if(date.getDate()<10){
        dat+="-0"+date.getDate()
    }
    else{
        dat+="-"+date.getDate()  
    }
    console.log(dat);
}

let date=new Date()
convert(date);
let duedate=new Date(date.setDate(date.getDate()+5));
convert(duedate)
