// 1. 执行队列里的异步请求打到6个的时候，把他们放到Promise.all() 
// 或Promise.allSettled()里去执行, 执行完成后情况队列，继续往里面追加6个，直到结束



class Task {
    constructor() {
        this.max = 6 // 并发请求数
        this.taskPool = [] // 存放任务
        this.total = 12 // 总任务数
        this.index = 0 // 当前任务数
    }

    async run (task) {
        while(this.index<this.total) {
            if (this.taskPool.length<this.max) {
                this.taskPool.push(task(this.index))
            }
            if (this.taskPool.length === this.max) {
              await  Promise.allSettled(this.taskPool).then((res) => {
                    console.log(res)
                    this.taskPool = []
                })
            }
            this.index++
        }
    }
}

const asyncGet = (index) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`第${index}个任务执行完成`)
        }, 1000);
    })
}


const task = new Task()

 task.run(asyncGet)



 // 2.  递归方式。 在执行的数组中加入6个请求， 只要有一个请求获得了结果，那就把他从数组中清除掉，然后在加入一个新的异步请求进来。


 let arr = []
 function addTask () {
    for (let i = 0; i < 100; i++) {
        arr.push(asyncGet(i))
    }
 }
 function runTask(arr,max) {
    const taskPool = [] 

    while (taskPool.length < max && arr.length) {
        taskPool.push(arr.shift())
    }

    while(taskPool.length) {
      taskPool.shift().then(res => {
        console.log(res)
        runTask(arr,max)
      })
    }
 }