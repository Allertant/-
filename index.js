const fs = require('fs')

const sourceList = []
const maxList = []
const allocationList = []
const needList = []
const requestList = []


getData()



// 获取来自文件中的数据
function getData(){
    new Promise((resolve,reject)=>{
        fs.readFile('./data.txt',(error,data)=>{
            if(error) {
                reject(error)
            }
            resolve(data)
        })
    }).then(value=>{
        manufactureData(value.toString().replaceAll('\r\n',' ').replaceAll('\n',' ').replaceAll(' ',''))
    },reason=>{
        console.log('文件有问题')
    }).then(value=>{
        otherManufact()
    })
}

// 对字符串类型的数据进行分割处理
function manufactureData(value){
    const dataArr = value.split('')
    m = dataArr[0]
    n = dataArr[1]
    // 资源分配情况输入
    for(var i = 0 ; i < m ; i++){
        sourceList.push([dataArr[2*i+2],parseInt(dataArr[2*i+3])])
    }
    // 最大需求矩阵的输入
    for(var i = 0 ;i < n ; i++){
        var miniArr = []
        for(var j = 0 ; j < m ; j++){
            miniArr.push(parseInt(dataArr[2+2*m+m*i+j]))
        }
        maxList.push(miniArr)
    }
    // 已分配矩阵的输入
    for(var i = 0 ;i < n ; i++){
        var miniArr = []
        for(var j = 0 ; j < m ; j++){
            miniArr.push(parseInt(dataArr[2+2*m+m*n+m*i+j]))
        }
        allocationList.push(miniArr)
    }
    // 需求矩阵的输入
    for(var i = 0 ;i < n ; i++){
        var miniArr = []
        for(var j = 0 ; j < m ; j++){
            miniArr.push(parseInt(maxList[i][j]) - parseInt(allocationList[i][j]))
        }
        needList.push(miniArr)
    }
    // requestList的初始化
    for(var i=0;i<sourceList.length;i++){
        requestList.push(0)
    }
}

function otherManufact(){
    displayData()
    safe()
    confirmSolution()
}

// 展示数据
function displayData(){
    console.log('此时刻的资源分配情况为：')
    console.log('\tMax\t\tAllocation\tNeed\t\tAvaliable')
    let titleStr = ''
    titleStr += '进程名\t'
    for(var i=0;i<4;i++){
        for(var j=0;j<sourceList.length;j++){
            titleStr += sourceList[j][0]+' '
        }
        titleStr += '\t\t'
    }
    for(var i=0;i<maxList.length;i++){
        itemStr = ''
        itemStr += i
        itemStr += '\t'
        for(var j=0;j<maxList[i].length;j++){
            itemStr += maxList[i][j]+' '
        }
        itemStr +='\t\t'
        for(var j=0;j<allocationList[i].length;j++){
            itemStr += allocationList[i][j]+' '
        }
        itemStr += '\t\t'
        for(var j=0;j<needList[i].length;j++){
            itemStr += needList[i][j]+' '
        }
        if(i == 0){
            itemStr += '\t\t'
            for(var j=0;j<sourceList.length;j++){
                itemStr += sourceList[j][1] +' '
            }
        }
        console.log(itemStr)
    }
}

function safe(){
    console.log('安全性检查')
    console.log('\tWork\t\tNeed\t\tAllocation\tWork+Allocation\t\tFinish')
    let titleStr = ''
    titleStr += '进程名\t'
    for(var i=0;i<4;i++){
        for(var j=0;j<sourceList.length;j++){
            titleStr += sourceList[j][0]+' '
        }
        if(i==3){
            titleStr += '\t\t\t'
        }else{
            titleStr += '\t\t'
        }
        
    }
    console.log(titleStr)
    // work数组，存放系统可以提供的资源
    let workList = []
    // 初始时等于sourceList数组
    for(var i=0;i<sourceList.length;i++){
        workList.push(sourceList[i][1])
    }
    // finish数组，存放任务是否被执行
    let finishList = []
    for(var i=0;i<workList.length;i++){
        finishList.push(0)
    }
    // temp数组，记录安全序列
    let tempList = []
    // 遍历各个任务
    for(var i=0;i<maxList.length;i++){
        // apply变量，标识资源列表是否被遍历完成
        let apply = 0
        // 遍历各个资源
        for(var j=0;j<sourceList.length;j++){
            if(!finishList[i] && needList[i][j]<=workList[j]){
                apply++
                if(apply === sourceList.length){
                    // 说明资源足够
                    let outputStr = ''
                    outputStr += i
                    outputStr += '\t'
                    // 遍历work列
                    for(var k=0;k<workList.length;k++){
                        outputStr += workList[k]+' '
                    }
                    outputStr += '\t\t'
                    // 遍历need列
                    for(var k=0;k<needList[i].length;k++){
                        outputStr += needList[i][k]+' '
                    }
                    outputStr += '\t\t'
                    // 遍历Allocation列
                    for(var k=0;k<allocationList[i].length;k++){
                        outputStr += allocationList[i][k]+' '
                    }
                    outputStr += '\t\t'
                    // 遍历更新后的work列
                    for(var k=0;k<workList.length;k++){
                        workList[k] += allocationList[i][k]
                        outputStr += workList[k] +' '
                    }
                    outputStr += '\t\t\t'
                    // 更新finishList中的信息
                    finishList[i] = 1
                    tempList.push(i)
                    outputStr += 'true'
                    // 打印
                    console.log(outputStr)
                    // 重置i的值，重新进行遍历
                    i = -1
                }
            }
        }
    }
    for(var i=0;i<maxList.length;i++){
        if(finishList[i] === 0){
            // 为失败资源，应当归还
            for(var j=0;j<sourceList.length;j++){
                sourceList[j][1] += requestList[j]
                allocationList[i][j] -=  requestList[j]
                needList[i][j] += requestList[j]
            }
            console.log('系统进入不安全状态！此时系统不分配资源！')
            return 
        }
    }
    console.log('此时系统是安全的!')
    let returnStr = ''
    returnStr += '安全序列为:'
    for(var i=0;i<tempList.length;i++){
        returnStr += tempList[i]
        if(i<tempList.length-1){
            returnStr += '->'
        }
    }
    console.log(returnStr)
}

// 分配资源进行银行家算法验证
function confirmSolution(){
    console.log('\n利用银行家算法进行预分配资源')
    new Promise((resolve,reject)=>{
        fs.readFile('./request.txt',(error,data)=>{
            if(error) {
                reject(error)
            }
            resolve(data)
        })
    }).then(value=>{
        let inputList = value.toString().replaceAll('\r\n',' ').replaceAll('\n',' ').replaceAll(' ','').split('')
        // 将字符串转换为数字
        for(var i=0;i<inputList.length;i++){
            inputList[i] = parseInt(inputList[i])
        }
        let numIndex =inputList[0]
        // 判断输入数据是否合法
        let ch = 'y'
        for(var i=0;i<sourceList.length;i++){
            if(inputList[i+1] > needList[numIndex][i]){
                let returnStr = ''
                returnStr += '进程'+numIndex+'申请的资源大于它需要的资源 分配不合理，不予分配！'
                console.log(returnStr)
                ch = 'n'
                break
            }
            if(inputList[i+1] > sourceList[i][1]){
                returnStr += '进程'+numIndex+'申请的资源大于系统现在可利用的资源 分配不合理，不予分配！'
                console.log(returnStr)
                ch = 'n'
                break
            }
        }
        // 将数据迁移到requestList身上
        if(ch === 'y'){
            for(var i=0;i<requestList.length;i++){
                requestList[i] = inputList[i+1]
            }
            // 资源重新分配
            for(var j=0;j<sourceList.length;j++){
                sourceList[j][1] -= requestList[j]
                allocationList[numIndex][j] +=  requestList[j]
                needList[numIndex][j] -= requestList[j]
            }
            // 
            displayData();
            safe()
        }
    },reason=>{
        console.log('文件有问题')
    })
        
    
}