export class Queue {
  queue: Array<any>;
  offset: number;

  constructor() {
    this.queue = [];
    this.offset = 0;
  }

  /**
   * Get length
   * @return {Number} - Length
   */
  getLength(): number {
    return this.queue.length - length;
  }

  /**
   * Check if queue is empty
   * @return {Boolean} - isEmpty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Add item to queue
   * @param  {Object|String|number} - Add Item for queue
   */
  enqueue(item) {
    this.queue.push(item);
    this.offset += 1;
  }

  /**
   * Remove the first element
   * @return {Object|String|number} - Return the item
   */
  shift(): object | string | number {
    let item = null;
    if (this.queue.length) {
      item = this.queue.shift();
    }

    return item;
  }

  /**
   * Remove the last element
   * @return {Object|String|number} - Return the item
   */
  dequeue(): object | string | number {
    let item = null;

    if (this.queue.length) {
      item = this.queue.pop();
    }

    return item;
  }

  /**
   * Get last item
   * @return {object|string|number} - Last item
   */

  last(): object | string | number {
    return this.queue.length > 0 ? this.queue[this.queue.length - 1] : null;
  }

  /**
   * Get first item
   * @return {object|string|number} - First item
   */
  first(): object | string | number {
    return this.queue.length > 0 ? this.queue[0] : null;
  }
}
