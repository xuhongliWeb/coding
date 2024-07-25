class SuperTask {
    constructor(max = 2) {
        this.tasks = [];
        this.max = max; // 最大并发数
        this.runningCount = 0;
    }

    add (task) {
            return new Promise((resolve, reject) => {
                //  保存promise状态
                this.tasks.push({
                    task,
                    resolve,
                    reject
                })
                this.run()
            })

    }

    run() {
        while (this.runningCount<this.max && this.tasks.length) {
            const {task, resolve, reject } = this.tasks.shift();
            this.runningCount++;
            task().then(resolve, reject).finally(() => {
                this.runningCount--;
                this.run();
            })
        }
    }
}

function timeout(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time);
    })
}

const superTask = new SuperTask();

function addTask(time, order) {
    // console.log(`任务${order}开始`);
    superTask.add(() => timeout(time).then(() => {
        console.log(`任务${order}结束`);
    }))
}

// EXAMPLE


// addTask(10000, 1)
// addTask(5000,2)
// addTask(3000,3)
// addTask(4000,4)
// addTask(5000,5)


addTask(1111, 1)
addTask(1111,2)
addTask(1111,3)
addTask(1111,4)
addTask(1111,5)