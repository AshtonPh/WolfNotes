/**
 * semaphore.js
 * 
 * Provides a synchronization solution for async-based JS environments
 */

export class Semaphore {
    promiseQueue = [];

    /**@type {number} */
    count;
    /**
     * @param {number} initCount 
     */
    constructor(initCount) {
        count = initCount;
    }

    async aquire() {
        count--;
        if (count < 0) {
            await new Promise((res, _rej) => this.promiseQueue.push(res));
        }
    }

    release() {
        count++;
        let res = this.promiseQueue.shift();
        if (res)
            res();
    }
}