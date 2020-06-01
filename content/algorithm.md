# 数据结构与算法之美

## 时间复杂度和空间复杂度

我们说空间复杂度的时候，是指除了原本的数据存储空间外，算法运行还需要额外的存储空间。

均摊时间复杂度一般都等于最好情况时间复杂度。

## 数组

数组（Array）是一种**线性表**数据结构。它用一组**连续的内存空间**，来存储一组具有**相同类型的数据**。

除了数组，链表、队列、栈等也是线性表结构。

第二个是连续的内存空间和相同类型的数据。正是因为这两个限制，它才有了一个堪称“杀手锏”的特性：“随机访问”。但有利就有弊，这两个限制也让数组的很多操作变得非常低效，比如要想在数组中删除、插入一个数据，为了保证连续性，就需要做大量的数据搬移工作。

计算机会给每个内存单元分配一个地址，计算机通过地址来访问内存中的数据。当计算机需要随机访问数组中的某个元素时，它会首先通过下面的寻址公式，计算出该元素存储的内存地址：

`a[i]_address = base_address + i * data_type_size`

二分查找，时间复杂度也是 O(logn)

数组支持随机访问，根据下标随机访问的时间复杂度为 O(1)

- 低效的“插入”和“删除”
- 数组的访问越界问题

## 链表

不需要一块连续的内存空间，它通过“指针”将一组零散的内存块串联起来使用

链表通过指针将一组零散的内存块串联在一起。其中，我们把内存块称为链表的`结点`。为了将所有的结点串起来，每个链表的结点除了存储数据之外，还需要记录链上的下一个结点的地址。如图所示，我们把这个记录下个结点地址的指针叫作`后继指针 next`。

我们习惯性地把第一个结点叫作头结点，把最后一个结点叫作尾结点。其中，头结点用来记录链表的基地址。而尾结点特殊的地方是：指针不是指向下一个结点，而是指向一个`空地址 NULL`，表示这是链表上最后一个结点。

- 单链表
- 双向链表
  - 后继指针 next
  - 前驱指针 prev
  - 数据
- 循环链表

## 栈

特定的数据结构是对特定场景的抽象，而且，数组或链表暴露了太多的操作接口，操作上的确灵活自由，但使用时就比较不可控，自然也就更容易出错。

不管是顺序栈还是链式栈，我们存储数据只需要一个大小为 n 的数组就够了。在入栈和出栈过程中，只需要一两个临时变量存储空间，所以空间复杂度是 O(1)。

不管是顺序栈还是链式栈，入栈、出栈只涉及栈顶个别数据的操作，所以时间复杂度都是 O(1)。

- 顺序栈

  ```js
  class ArrayStack<T> {
    private items: T[];
    private count: number;
    public size: number;
    constructor(size) {
      this.items = new Array(n);
      this.size = size;
      this.count = 0;
    }

    public push(item: T): boolean {
      if (count === n) return false;

      items[count] = item;
      ++count;
      return true;
    }

    public pop(): T | null {
      if (count === 0) return null;

      const tmp: T = items[count - 1];
      --count;
      return tmp;
    }
  }
  ```

- 链式栈

  ```js
  class Stack<T> {
    private node: LinkedNode<T> | null  = null
    public size: number = 0;

    public push(value: T) {
      if(!value) return ;
      const newNode = new LinkedNode<T>(value);
      if(!this.node) {
        this.node = newNode;
      } else {
        newNode.next = this.node;
        this.node = newNode;
      }
      this.size++;
    }

    public pop(): T | null {
      if(!this.node) return null;
      const value = this.node.value;
      this.node = this.node.next;
      this.size--;
      return value;
    }
  }

  class linkedNode<T> {
    value: T;
    next: LinkedNode<T> | null;

    constructor(value: T, next: LinkedNode<T> | null = null) {
      this.value = value;
      this.next = next;
    }
  }
  ```

- 支持动态扩容的顺序栈

出栈的时间复杂度仍然是 O(1)。

对于入栈操作来说，最好情况时间复杂度是 O(1)，最坏情况时间复杂度是 O(n)。

这个入栈操作的平均情况下的时间复杂度可以用摊还分析法来分析。

前提假设：

    - 栈空间不够时，我们重新申请一个是原来大小两倍的数组；
    - 为了简化分析，假设只有入栈操作没有出栈操作；
    - 定义不涉及内存搬移的入栈操作为 simple-push 操作，时间复杂度为 O(1)。

如果当前栈大小为 K，并且已满，当再有新的数据要入栈时，就需要重新申请 2 倍大小的内存，并且做 K 个数据的搬移操作，然后再入栈。但是，接下来的 K-1 次入栈操作，我们都不需要再重新申请内存和搬移数据，所以这 K-1 次入栈操作都只需要一个 simple-push 操作就可以完成。

![入栈的时间复杂度](../imgs/algorithm/入栈的时间复杂度.jpg)

这 K 次入栈操作，总共涉及了 K 个数据的搬移，以及 K 次 simple-push 操作。将 K 个数据搬移均摊到 K 次入栈操作，那每个入栈操作只需要一个数据搬移和一个 simple-push 操作。以此类推，入栈操作的均摊时间复杂度就为 O(1)。

- 栈在函数调用中的应用 -- 函数调用栈

  操作系统给每个线程分配了一块独立的内存空间，这块内存被组织成“栈”这种结构, 用来存储函数调用时的临时变量。每进入一个函数，就会将临时变量作为一个栈帧入栈，当被调用函数执行完成，返回之后，将这个函数对应的栈帧出栈。

  其实，我们不一定非要用栈来保存临时变量，只不过如果这个函数调用符合后进先出的特性，用栈这种数据结构来实现，是最顺理成章的选择。

  从调用函数进入被调用函数，对于数据来说，变化的是什么呢？是作用域。所以根本上，只要能保证每进入一个新的函数，都是一个新的作用域就可以。而要实现这个，用栈就非常方便。在进入被调用函数的时候，分配一段栈空间给这个函数的变量，在函数结束的时候，将栈顶复位，正好回到调用函数的作用域内。

- 栈在表达式求值中的应用 -- 表达式求值

  编译器就是通过两个栈来实现的。其中一个保存操作数的栈，另一个是保存运算符的栈。从左向右遍历表达式，当遇到数字，我们就直接压入操作数栈；当遇到运算符，就与运算符栈的栈顶元素进行比较。

  如果比运算符栈顶元素的优先级高，就将当前运算符压入栈；如果比运算符栈顶元素的优先级低或者相同，从运算符栈中取栈顶运算符，从操作数栈的栈顶取 2 个操作数，然后进行计算，再把计算完的结果压入操作数栈，继续比较。

  ![栈在表达式求值中的应用](../imgs/algorithm/栈在表达式求值中的应用.jpg)

- 栈在括号匹配中的应用 -- 检查表达式中的括号是否匹配

  假设表达式中只包含三种括号，圆括号 ()、方括号[]和花括号{}，并且它们可以任意嵌套。

  用栈来保存未匹配的左括号，从左到右依次扫描字符串。当扫描到左括号时，则将其压入栈中；当扫描到右括号时，从栈顶取出一个左括号。如果能够匹配，比如“(”跟“)”匹配，“[”跟“]”匹配，“{”跟“}”匹配，则继续扫描剩下的字符串。如果扫描的过程中，遇到不能配对的右括号，或者栈中没有数据，则说明为非法格式。

- 实现浏览器的前进、后退功能

  使用两个栈 X 和 Y，我们把首次浏览的页面依次压入栈 X，当点击后退按钮时，再依次从栈 X 中出栈，并将出栈的数据依次放入栈 Y。当我们点击前进按钮时，我们依次从栈 Y 中取出数据，放入栈 X 中。当栈 X 中没有数据时，那就说明没有页面可以继续后退浏览了。当栈 Y 中没有数据，那就说明没有页面可以点击前进按钮浏览了。跳转到新的页面 d 了，页面 c 就无法再通过前进、后退按钮重复查看了，所以需要清空栈 Y。

  ```js
    class Browser<T> {
      private backStack: Stack<T>;
      private forwardStack: Stack<T>;
      private current: T;

      constructor(current: T) {
        this.backStack = new Stack<T>();
        this.forwardStack = new Stack<T>();
        this.current = current;
      }

      public back(): T | null {
        if(this.backStack.size > 0) {
          this.forwardStack.push(this.current);
          this.current = this.backStack.pop();
          return this.getCurrentPage();
        }
        return null;
      }

      public forward(): T | null {
        if(this.forwardStack.size > 0) {
          this.backStack.push(this.current);
          this.current = this.forwardStack.pop();
          return this.getCurrentPage();
        }
        return null;
      }

      /**
       * 在网页点击链接
       * @params value
       */
      public linkUrl(value: T) {
        this.current && this.backStack.push(this.current);
        this.current = value;
      }

      public getCurrentPage(): T {
        return this.current;
      }
    }

    const browser = new Browser('www.baidu.com');
    browser.linkUrl('www.yuanzhoucehui.com');
    browser.linkUrl('www.github.com/jsrdxzw');
    // browser.back()
    // www.github.com/jsrdxzw
    console.log(browser.getCurrentPage())
    browser.back()
    // www.yuanzhucehui.com
    console.log(browser.getCurrentPage())
    browser.back()
    // www.baidu.com
    console.log(browser.getCurrentPage())
    browser.back()
    // www.baidu.com
    console.log(browser.getCurrentPage())
    browser.forward()
    // www.yuanzhucehui.com
    console.log(browser.getCurrentPage())
    browser.forward()
    // www.github.com/jsrdxzw
    console.log(browser.getCurrentPage())
  ```

- 内存中的栈和数据结构中的栈是不是一回事呢？

## 队列

CPU 资源是有限的，任务的处理速度与线程个数并不是线性正相关。相反，过多的线程反而会导致 CPU 频繁切换，处理性能下降。所以，线程池的大小一般都是综合考虑要处理任务的特点和硬件环境，来事先设置的。

当我们向固定大小的线程池中请求一个线程时，如果线程池中没有空闲资源了，这个时候线程池如何处理这个请求？是拒绝请求还是排队请求？各种处理策略又是怎么实现的呢？

我们一般有两种处理策略。第一种是非阻塞的处理方式，直接拒绝任务请求；另一种是阻塞的处理方式，将请求排队，等到有空闲线程时，取出排队的请求继续处理。那如何存储排队的请求呢？

我们希望公平地处理每个排队的请求，先进者先服务，所以队列这种数据结构很适合来存储排队请求。我们前面说过，队列有基于链表和基于数组这两种实现方式。这两种实现方式对于排队请求又有什么区别呢？

基于链表的实现方式，可以实现一个支持无限排队的无界队列（unbounded queue），但是可能会导致过多的请求排队等待，请求处理的响应时间过长。所以，针对响应时间比较敏感的系统，基于链表实现的无限排队的线程池是不合适的。

而基于数组实现的有界队列（bounded queue），队列的大小有限，所以线程池中排队的请求超过队列大小时，接下来的请求就会被拒绝，这种方式对响应时间敏感的系统来说，就相对更加合理。不过，设置一个合理的队列大小，也是非常有讲究的。队列太大导致等待的请求太多，队列太小会导致无法充分利用系统资源、发挥最大性能。

除了前面讲到队列应用在线程池请求排队的场景之外，队列可以应用在任何有限资源池中，用于排队请求，比如数据库连接池等。实际上，对于大部分资源有限的场景，当没有空闲资源时，基本上都可以通过“队列”这种数据结构来实现请求排队。

先进者先出，这就是典型的“队列”。最基本的操作也是两个：入队 enqueue()，放一个数据到队列尾部；出队 dequeue()，从队列头部取一个元素。

队列跟栈一样，也是一种操作受限的线性表数据结构。

- 顺序队列

  ```ts
  class ArrayQueue<T> {
    private items: Array<T>;
    private size: number;
    private head: number = 0;
    private tail: number = 0;

    constructor(size: number) {
      this.items = new Array<T>(size);
      this.size = size;
    }

    public enqueue(item: T): boolean {
      // 队列末尾没有空间了
      if (this.tail === this.size) {
        // 整个队列都沾满了
        if (this.head === 0) return false;

        // 数据迁移
        for (let i = this.head; i < this.tail; ++i) {
          // 迁移 this.head 个位置
          this.items[i - this.head] = this.items[i];
        }
        // 重新调整 head 和 tail
        this.tail -= this.head;
        this.head = 0;
      }

      this.items[this.tail] = item;
      ++this.tail;
      return true;
    }

    public dequeue(): T | null {
      if (this.head === this.tail) return null;
      const tmp = this.items[this.head];
      ++this.head;
      return tmp;
    }
  }
  ```

- 链式队列

  ```ts
  class Queue<T> {
    private head: LinkedNode<T> | null = null;
    private tail: LinkedNode<T> | null = null;

    public enqueue(value: T) {
      if (!this.tail) {
        this.head = this.tail = new LinkedNode<T>(value);
      } else {
        const newNode = new LinkedNode<T>(vlaue);
        this.tail.next = newNode;
        this.tail = newNode;
      }
    }

    public dequeue(): T | null {
      if (!this.head) return null;
      const value = this.head.value;
      this.head = this.head.next;
      return value;
    }

    public printAll(): string {
      let p = this.head;
      let res = "";
      while (p) {
        res = `${res} ${p.value}`;
        p = p.next;
      }
      return res;
    }
  }

  class LinkedNode<T> {
    value: T;
    next: LinkedNode<T> | null;

    constructor(value: T, next: LinkedNode<T> | null = null) {
      this.value = value;
      this.next = next;
    }
  }

  const queue = new SimpleQueue();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  queue.dequeue();
  queue.dequeue();
  console.log(queue.printAll());
  ```

- 循环队列

  - 队空

    `this.tail === this.head`

  - 队满

    `( this.tail + 1 ) % this.size === this.head`

    队满时 `this.tail` 指向的地址实际上是没有存储数据的，所有循环队列会浪费一个数据的存储空间。

  - 循环队列的长度设定需要对并发数据有一定的预测，否则会丢失太多请求。

  ```ts
  class CircularQueue<T> {
    private items: Array<T>;
    private size: number;
    private head: number = 0;
    private tail: number = 0;

    constructor(size: number) {
      this.items = new Array<T>(size);
      this.size = size;
    }

    public enqueue(item: T) {
      if ((this.tail + 1) % this.size === this.head) return false;

      this.items[this.tail] = item;
      this.tail = (this.tail + 1) / this.size;
      return true;
    }

    public dequeue(): T | null {
      if (this.head === this.tail) return null;
      const tmp = this.items[this.head];
      this.head = (this.head + 1) % this.size;
      return tmp;
    }
  }
  ```

- 阻塞队列(生产者--消费者)

  阻塞队列其实就是在队列基础上增加了阻塞操作。

  简单来说，就是在队列为空的时候，从队头取数据会被阻塞。因为此时还没有数据可取，直到队列中有了数据才能返回；如果队列已经满了，那么插入数据的操作就会被阻塞，直到队列中有空闲位置后再插入数据，然后再返回。

- 并发队列

  在多线程情况下，会有多个线程同时操作队列，这个时候就会存在线程安全问题，那如何实现一个线程安全的队列呢？

  线程安全的队列我们叫作并发队列。

  最简单直接的实现方式是直接在 enqueue()、dequeue() 方法上加锁，但是锁粒度大并发度会比较低，同一时刻仅允许一个存或者取操作。实际上，基于数组的循环队列，利用 CAS 原子操作，可以实现非常高效的并发队列。这也是循环队列比链式队列应用更加广泛的原因。

  - 如何实现无锁并发队列

    cas + 数组

## 递归

## 排序

[十大经典排序算法（动图演示）](https://www.cnblogs.com/onepixel/articles/7674659.html)

- 冒泡

  比较相邻的两个数。一次冒泡会让至少一个元素移动到它应该在的位置。

  最好时间复杂度 O(n), 最坏时间复杂度 O(n²), 平均时间复杂度 O(n²)。

  ```js
  function bubbleSort(
    arr: Array<number>,
    compare: (a: number, b: number): number
  ) {
    const { length: len } = arr;
    if (len < 2) return;

    // 从前往后排序
    // for (let i = 0; i < len - 1; i++) {
    //   let flag: boolean = false;
    //   // 最后一个元素下标 len - 1, 每循环一次就绪一个数，内层循环上限 - 1（即第i次循环 - i）
    //   for (let j = 0; j < len - 1 - i; j++) {
    //     if (compare(arr[j], arr[j + 1]) > 0) {
    //       swap(arr, j, j+1);
    //       flag = true; // 有数据交换
    //     }
    //   }

    //   if (!flag) break;
    // }

    // 从后往前排序
    for(let i = 0; i < len - 1; i++) {
      let flag = false;
      for(let j = len - 1; j > i; j--) {
        if(compare(arr[j-1], arr[j])>0) {
          swap(arr, j-1, j);
          flag = true;
        }
      }
      if(!flag) break;
    }

    function swap(arr, i, j) {
      let tmp = arr[j];
      arr[j] = arr[i];
      arr[i] = tmp;

      // [arr[i], arr[j]] = [arr[j], arr[i]];
    }

  }

  ```

- 插入排序

  将数组中的数据分为两个区间，已排序区间和未排序区间。初始已排序区间是数组中的第一个元素。取未排序元素在已排序区间中找到合适的位置插入，并保证已排序区间的数据一直有序。重复步骤，直到未排序区间中元素为空。

  最好时间复杂度 O(n), 最坏时间复杂度 O(n²), 平均时间复杂度 O(n²)。

  ```js
  function insertionSort(arr: Array<number>) {
    const { length: len } = arr;
    if (len < 2) return;
    for (let i = 1; i < len; i++) {
      const target = a[i]; //待插入的值
      let j = i - 1;
      for (; j >= 0; j--) {
        if (a[j] > target) {
          a[j + 1] = a[j]; // 数据后移
        } else {
          break; //前面已经有序，所以 break 循环
        }
      }
      a[j + 1] = target; // 插入数据
    }
  }
  ```

  ```js
  function insertionSort(arr: Array<number>) {
    const { length: len } = arr;
    if (len < 2) return;
    for (let i = 1; i < len; i++) {
      const target = a[i]; //待插入的值
      let j = i - 1;
      while (j >= 0 && a[j] > target) {
        a[j + 1] = a[j]; // 数据后移
        j--;
      }
      a[j + 1] = target; // 插入数据
    }
  }
  ```

- 希尔排序（Shell sort)

  第一个突破 O(n2)的排序算法，是简单插入排序的改进版。它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫缩小增量排序。

  先计算 gap（间隔），如 10 个数，gap 就是 5，依次比较 `a[0]和a[5]`,`a[1]和a[6]`, `a[2]和a[7]`...如果`a[5]<a[0]`,那么`a[0]=a[5]`,继续向前间隔比较

  一轮比较结束后，重新计算间隔 gap = Math.floor(gap/2), 依次比较`a[0]和a[2]`,`a[1]和a[3]`, `a[2]和a[4]`...如果`a[4]<a[2]`,那么`a[2]=a[4]`，继续向前间隔比较， 如果`a[2]<a[0]`,那么`a[0]=a[2]`，继续向前间隔比较

  直到间隔为 0 时，退出比较，排序结束

  ```js
  function shellSort(arr) {
    const { length: len } = arr;
    for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < len; i++) {
        let j = i;
        const current = arr[i];
        while (j - gap >= 0 && current < arr[j - gap]) {
          // swap
          arr[j] = arr[j - gap];
          j = j - gap;
        }
        arr[j] = current;
      }
    }
    return arr;
  }
  ```

- 选择排序

  将数据分为已排序区间和未排序区间。初始已排序区间为空。每次从未排序区间中选出最小的元素插入已排序区间的末尾，直到未排序区间为空。

  最好时间复杂度 O(n²), 最坏时间复杂度 O(n²), 平均时间复杂度 O(n²)。

  ```js
  function selectionSort(arr: Array<number>) {
    const { length: len } = arr;
    if (len < 2) return;

    let minIndex; // 存储最小数索引
    // 跑 len - 1 次就可就绪
    for (let i = 0; i < len - 1; i++) {
      minIndex = i;
      for (let j = i + 1; j < len; j++) {
        // 寻找最小数
        if (arr[j] < arr[minIndex]) {
          minIndex = j; // 将最小数的索引保存
        }
      }
      if (minIndex !== i) {
        swap(arr, i, minIndex);
      }
    }

    function swap(arr, i, j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  ```

- 归并排序(分治思想)

  我们先把数组从中间分成前后两部分，然后对前后两部分分别排序，再将排好序的两部分合并在一起，这样整个数组就都有序了。

  最好情况、最坏情况，还是平均情况，时间复杂度都是 O(nlogn)。非原地排序，空间复杂度 O(n)。稳定排序

  ```js
  function mergeSort(arr: Array<number>) {
    const { length: len } = arr;
    if (len < 2) return arr;

    const middle = Math.floor(len / 2),
      left = arr.slice(0, middle),
      right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));

    function merge(left: Array<number>, right: Array<number>) {
      let result = [];
      while (left.length > 0 && right.length > 0) {
        if (left[0] <= right[0]) {
          result.push(left.shift());
        } else {
          result.push(right.shift());
        }
      }

      while (left.length) {
        result.push(left.shift());
      }

      while (right.length) {
        result.push(right.shift());
      }
      return result;
    }
  }
  ```

- 快速排序(分治思想)

  非稳定排序

  ```js
  /**
   * 1. 选择一个“基准”（pivot）元素
   * 2. 将所有小于基准值的元素放在基准值的左边，所有大于基准值的元素放在基准值的右边
   * 3. 对分割后的两个子序列重复上述步骤
   */
  function quickSort(arr: Array<T>, compare: (a: T, b: T): number): Array<T> {
    if (arr.length < 2) return arr;
    let left: Array<T> = [],
      right: Array<T> = [],
      current: T = arr.splice(0, 1); // 取第一个作为基准

    for (let i = 0, len = arr.length; i < len; i++) {
      if (compare(arr[i], current)> 0) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }

    return quickSort(left, compare).concat(current, quickSort(right, compare));
  }
  ```

  ```js
  /**
   * 原地快排
   **/
  function quickSort(arr: Array<T>, left?: number, right?: number) {
    const { length: len } = arr;
    if (len < 2) return arr;
    let partitionIndex,
      left = typeof left !== "number" ? 0 : left,
      right = typeof right !== "number" ? len - 1 : right;

    if (left < right) {
      partitionIndex = partition(arr, left, right);
      quickSort(arr, left, partitionIndex - 1);
      quickSort(arr, partitionIndex + 1, right);
    }

    function partition(arr: Array<T>, left?: number, right?: number) {
      let pivot = left,
        index = pivot + 1; // 记录小于基准值的右界线（不包括index）

      // 循环找到所有小于基准值的数据，依次放到基准值后面
      for (let i = index; i <= right; i++) {
        if (arr[i] < arr[pivot]) {
          swap(arr, i, index);
          index++;
        }
      }

      swap(arr, pivot, index - 1); // 交换基准值和最后一个小于基准值的位置
      return index - 1; // 基准值位置
    }

    function swap(arr, i, j) {
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  }
  ```

- 桶排序（Bucket sort)

  假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排）。

  将要排序的数据分到几个有序的桶里，每个桶里的数据再单独进行排序。桶内排完序之后，再把每个桶里的数据按照顺序依次取出，组成的序列就是有序的了。

  如果要排序的数据有 n 个，我们把它们均匀地划分到 m 个桶内，每个桶里就有 k=n/m 个元素。每个桶内部使用快速排序，时间复杂度为 `O(k _ logk)`。m 个桶排序的时间复杂度就是 `O(m _ k * logk)`，因为`k=n/m`，所以整个桶排序的时间复杂度就是`O(n*log(n/m))`。当桶的个数 m 接近数据个数 n 时，`log(n/m)` 就是一个非常小的常量，这个时候桶排序的时间复杂度接近 O(n)。

  ![桶排序（Bucket sort）](../imgs/algorithm/桶排序.png)

  要排序的数据需要很容易就能划分成 m 个桶，并且，桶与桶之间有着天然的大小顺序。这样每个桶内的数据都排序完之后，桶与桶之间的数据不需要再进行排序。

  其次，数据在各个桶之间的分布是比较均匀的。如果数据经过桶的划分之后，有些桶里的数据非常多，有些非常少，很不平均，那桶内数据排序的时间复杂度就不是常量级了。在极端情况下，如果数据都被划分到一个桶里，那就退化为 O(nlogn) 的排序算法了。

  **桶排序比较适合用在外部排序中。所谓的外部排序就是数据存储在外部磁盘中，数据量比较大，内存有限，无法将数据全部加载到内存中。**

  ```js
  function bucketSort(arr, bucketSize) {
    const { length: len } = arr;
    if (len === 0) return arr;

    let minValue = arr[0],
      maxValue = arr[0];
    // 找出最大最小值
    for (let i = 1; i < len; i++) {
      if (arr[i] < minValue) {
        minValue = arr[i];
      } else if (arr[i] > maxValue) {
        maxValue = arr[i];
      }
    }

    // 桶初始化
    let DEFAULT_BUCKET_SIZE = 5;
    bucketSize = bucketSize || DEFAULT_BUCKET_SIZE; // 桶容量
    const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1; // 桶数量
    const buckets = new Array(bucketCount);
    for (let i = 0; i < bucketCount; i++) {
      buckets[i] = [];
    }

    // 利用映射函数将数据分配到各个桶中
    for (let i = 0; i < len; i++) {
      buckets[math.floor((arr[i] - minValue) / bucketSize)].push(arr[i]);
    }

    for (let i = 0; i < buckets.length; i++) {
      insertionSort(buckets[i]); // 对每个桶进行排序，这里使用了插入排序
      for (let j = 0; j < buckets[i].length; j++) {
        arr.push(buckets[i][j]);
      }
    }

    return arr;
  }
  ```

- 计数排序（Counting Sort）

  不是基于比较的排序算法，核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。

  作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

  > 场景：考生的满分是 900 分，最小是 0 分，这个数据的范围很小，所以我们可以分成 901 个桶，对应分数从 0 分到 900 分。根据考生的成绩，我们将这 50 万考生划分到这 901 个桶里。桶内的数据都是分数相同的考生，所以并不需要再进行排序。我们只需要依次扫描每个桶，将桶内的考生依次输出到一个数组中，就实现了 50 万考生的排序。因为只涉及扫描遍历操作，所以时间复杂度是 O(n)。

  > 计数排序只能用在数据范围不大的场景中，如果数据范围 k 比要排序的数据 n 大很多，就不适合用计数排序了。而且，计数排序只能给非负整数排序，如果要排序的数据是其他类型的，要将其在不改变相对大小的情况下，转化为非负整数。

  ```js
  /**
   * 1. 找出待排序的数组中最大和最小的元素；
   * 2. 统计数组中每个值为i的元素出现的次数，存入数组C的第i项；
   * 3. 对所有的计数累加（从C中的第一个元素开始，每一项和前一项相加）；
   * 4. 反向填充目标数组：将每个元素i放在新数组的第C(i)项，每放一个元素就将C(i)减去1。
   */
  function countingSort(arr: Array<number>) {
    const { length: len } = arr;
    if (len === 0) return arr;

    // 计算最大值
    let maxValue = arr[0];
    for(let i=1; i< len; i++) {
      if(maxValue < arr[i]) {
        maxValue = arr[i];
      }
    }

    const bucketCount = maxValue + 1;
    let buckets = new Array(bucketCount),

    // 统计数组中每个值为arr[i]的元素出现的次数
    for (let i = 0; i < len; i++) {
      const value = arr[i];
      if (!buckets[value]) {
        buckets[value] = 0; // 初始化计数
      }
      buckets[value]++;
    }

    // 依次累加
    for(let i=1; i< bucketCount; i++) {
      buckets[i] = buckets[i-1]+ buckets[i];
    }

    // 临时数组 r, 存储排序之后的结果
    let r = new Array(len)
    for(let i = len - 1; i >=0; i--) {
      const value = arr[i];
      const index = buckets[value] - 1; // 计算位置
      r[index] = value; //值存储到相应的位置
      buckets[value]--; // 值放到相应位置后，计数减一
    }

    // 将结果拷贝给 arr 数组
    for(let i=0; i< len; i++) {
      arr[i] = r[i];
    }

    return arr;
  }
  ```

- 基数排序（Radix Sort）

  按照低位先排序，然后收集；再按照高位排序，然后再收集；依次类推，直到最高位。有时候有些属性是有优先级顺序的，先按低优先级排序，再按高优先级排序。最后的次序就是高优先级高的在前，高优先级相同的低优先级高的在前。

  时间复杂度: 最好 O(n), 最坏 O(nlogn), 平均 O(n)

  空间复杂度: O(n+k)，其中 k 为桶的数量。一般来说 n>>k，因此额外空间需要大概 n 个左右

  稳定排序。

  > 场景： 有 10 万个手机号码，希望将这 10 万个手机号码从小到大排序

  > 场景： 排序牛津字典中的 20 万个英文单词，最短的只有 1 个字母，最长的有 45 个字母。我们可以把所有的单词补齐到相同长度，位数不够的可以在后面补“0”，因为根据 ASCII 值，所有字母都大于“0”，所以补“0”不会影响到原有的大小顺序。

  基数排序对要排序的数据是有要求的，需要可以分割出独立的“位”来比较，而且位之间有递进的关系，如果 a 数据的高位比 b 数据大，那剩下的低位就不用比较了。除此之外，每一位的数据范围不能太大，要可以用线性排序算法来排序，否则，基数排序的时间复杂度就无法做到 O(n) 了。

  ```js
  /**
   *
   * @params {maxDigit} 最大位数
   */
  function radixSort(arr, maxDigit) {
    let mod = 10,
      dev = 1;
    // 从低位到高位排序
    for (let i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
      // 桶排序
      let counter = [];
      for (let j = 0; j < arr.length; j++) {
        const value = arr[j];
        // value % mod 得到后 i 位数， 再除以 dev 得到 倒数 i 位置的数
        const bucket = parseInt((value % mod) / dev);
        if (!counter[bucket]) {
          counter[bucket] = [];
        }
        counter[bucket].push(value);
      }
      // 回填基于低位排序后的数据，回填完成后继续循环高位排序
      let pos = 0;
      for (let j = 0, len = counter.length; j < len; j++) {
        let value = null;
        if (counter[j]) {
          while (!!(value = counter[j].shift())) {
            arr[pos++] = value;
          }
        }
      }
    }
    return arr;
  }
  ```

- 堆排序(Heap sort)

  - 构建大顶堆
  - 交换堆顶元素和最后一个叶子节点
  - 继续构建次大顶堆

  ```js
  function heapSort(arr) {
    let { length: len } = arr;

    buildMaxHeap(arr); // 构建大顶堆

    for (let i = len - 1; i > 0; i--) {
      swap(arr, 0, i); // 交换堆顶元素和最后一个叶子节点
      len--;
      heapify(arr, 0); // 继续构建次大顶堆
    }

    function buildMaxHeap(arr) {
      // 建立大顶堆
      for (let i = Math.floor(len / 2); i >= 0; i--) {
        heapify(arr, i);
      }
    }

    function heapify(arr, i) {
      // 堆调整
      const left = 2 * i + 1,
        right = 2 * i + 2;
      let largest = i;

      if (left < len && arr[left] > arr[largest]) {
        largest = left;
      }

      if (right < len && arr[right] > arr[largest]) {
        largest = right;
      }

      if (largest !== i) {
        swap(arr, i, largest);
        heapify(arr, largest);
      }
    }

    function swap(arr, i, j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }
  ```
