# Process

Master-Worker 模式，又称主从模式。具备较好的可伸缩性和稳定性。

主进程不负责具体的业务处理，而是负责调度或管理工作进程，他是趋于稳定的

工作进程负责具体的业务处理。

通过 fork() 复制的进程都是一个独立的进程，这个进程中有着独立而全新的 V8 实例。它需要至少 30 毫秒的启动时间和至少 10MB 的内存。

## 子进程（child_process)

- 创建子进程的四种方式

  - spawn(command, [args], [options])
    - 启动一个子进程来执行命令。异步生成子进程，而不阻塞 Node.js 事件循环
    - spawnSync
  - exec(command, [options], [callback])
    - callback(err, stdout, stderr)
    - 生成一个 shell 并在该 shell 中运行命令， 在完成时将 stdout 和 stderr 传递给回调函数。
    - 可以指定 timeout 属性设置超时时间，一旦创建的进程运行超时将会被杀死
    - 适合执行已有的命令
  - execFile(file, [args], [option], [callback])
    - callback(err, stdout, stderr)
    - 启动一个子进程来执行可执行文件(它直接生成命令，默认情况下它不会衍生 shell。)
    - 可以指定 timeout 属性设置超时时间，一旦创建的进程运行超时将会被杀死
    - 适合执行文件
    - 执行 JS 文件时，要在首行添加 `#!/usr/bin/env node`
  - fork(modulePath, [args], [options])
    - 生成一个新的 Node.js 进程并调用指定的模块，该模块建立了 IPC 通信通道，允许在父进程和子进程之间发送消息。
    - 通过 fork()复制的进程都是一个独立的进程，这个进程中有着独立而全新的 V8 实例。
    - 需要至少 30 毫秒的启动时间和至少 10MB 的内存
    - fork()进程是昂贵的

  | 类型       | 回调/异常 | 进程类型 | 执行类型   | 可设置超时 |
  | :--------- | :-------- | :------- | :--------- | :--------- |
  | spawn()    | x         | 任意     | 命令       | x          |
  | exec()     | ✔️        | 任意     | 命令       | ✔️         |
  | execFile() | ✔️        | 任意     | 可执行文件 | ✔️         |
  | fork()     | x         | node     | JS 文件    | x          |

- 进程间通信

  通过 fork()或者其他 API 创建子进程后，父进程和子进程之间会创建 IPC 通道。通过 message 事件和 send() 传递消息

  - 进程间通信原理

    实现进程间通信技术： 命名管道、匿名管道、socket、信号量、共享内存、消息队列、Domain socket 等。

    Node 中实现 IPC 通道的是管道（pipe）技术。Node 中管道是个抽象层面的东西，具体实现细节由 libuv 提供，在 windows 下由命名管道实现，\*nix 系统则采用 Unix Domain Socket 实现。

    父进程在实际创建子进程之前，会创建 IPC 通道并监听它，然后才真正的创建子进程，并通过环境变量（NODE_CHANNEL_FD）告诉子进程这个 IPC 通道的文件描述符。子进程在启动的过程中，根据文件描述符去连接这个已存在的 IPC 通道。

    IPC 通道属于双向通信。他在系统内核中就完成了进程间的通信。

    Node 中，IPC 通道被抽象为 Stream 对象。

- 句柄传递

  > 通过代理（主进程和子进程监听不同的端口，主进程对外接收所有的网络请求，再将这些请求分别代理到不同的端口的进程中），可以避免端口不能重复监听的问题，甚至可以在代理进程上做适当的负载均衡。由于进程每接收一个连接，将会用掉一个文件描述符，因此代理方案中客户端连接到代理进程，代理进程连接到工作进程的过程需要用掉两个文件描述符。  
  > Node 进程间可以发送句柄，可以解决这个问题。

  - 句柄
    - 一种可以用来标识资源的引用。他的内部包含了指向对象的文件描述符。
    - 比如句柄可以用来标识一个服务端 socket 对象，一个客户端 socket 对象，一个 UDP 套接字、一个管道等。
  - 句柄发送与还原

    - 子进程对象 send() 方法可以发送的句柄类型：

      - net.Socket。TCP 套接字。
      - net.Server。TCP 服务器。
      - net.Native。C++ 层面的 TCP 套接字或 IPC 管道。
      - dgram.Socket。UDP 套接字。
      - dgram.Native。C++ 层面的 UDP 套接字。

    - 发送和还原

      send() 方法在将消息发送到 IPC 管道前，将消息封装成两个对象， 一个 handle，一个 message.

      - message:
        ```js
        {
          cmd: 'NODE_HANDLE',
          type: 'net.Server',
          msg: message
        }
        ```

      发送到 IPC 管道的实际是我们要发送的句柄的文件描述符，文件描述符实际上是一个整数值。message 对象在写入 IPC 管道时也会通过 JSON.stringify()进行序列化。所以最终发送到 IPC 管道的信息都是字符串。
      消息 message.cmd 如果是以 NODE 为前缀，将响应一个内部事件 internalMessage。
      如果 message.cmd 的值为 NODE_HANDLE，将取出 message.type 值和得到的文件描述符一起还原出一个对应的对象。

      Node 进程之间只有消息传递，不会真正的传递对象。

    - 端口共同监听

      独立启动的进程中，TPC 服务器端 socket 套接字的文件描述符并不相同，导致监听到相同的端口时会抛出异常。
      Node 底层对每个端口监听度设置了 SO_REUSEADDR 选项，这个选项的含义是不同进程可以就相同的网卡和端口进行监听，这个服务端套接字可以被不同的进程复用。
      对于 send() 发送的句柄还原出来的服务而言，它们的文件描述符是相同的，所以监听相同端口不会引起异常。
      多个应用监听相同的端口时，文件描述符同一时间只能被某个进程所用。这些进程服务是抢占式的。

- 子进程对象事件和方法

  - 方法
    - send(msg, handle)
    - child.kill([signal])：并不能真正的将通过 IPC 相连的子进程杀死，他只是给子进程发送了一个系统信号（默认 SIGTERM 信号）
    - process.kill(pid, [signal])
  - 事件
    - message
    - error: 子进程无法被复制创建、无法被杀死、无法发送消息时会触发
    - exit： 子进程退出时触发
    - close：子进程标准输入输出流中止时触发
    - disconnect：在父进程或子进程中调用 disconnect()方法时会触发改事件，在调用该方法时将关闭监听 IPC 通道。

- 负载均衡

  - Node 默认提供的机制是采用操作系统的抢占式策略。
  - Round-Robin（轮询调度）
    - 启用：cluster.schedulingPolicy = cluster.SCHED_RR
    - 禁用：cluster.schedulingPolicy = cluster.SCHED_NONE
    - 或者在环境变量中设置 NODE_CLUSTER_SCHED_POLICY 值
      - export NODE_CLUSTER_SCHED_POLICY=rr
      - export NODE_CLUSTER_SCHED_POLICY=none

- Cluster 模块

  - 在进程中判断是主进程还是工作进程，主要是取决于环境变量中是否有 NODE_UNIQUE_ID：

    ```js
    cluster.isWorker = 'NODE_UNIQUE_ID' in process.env;
    ```

  - cluster.fork()子进程时，将这个 TCP 服务端 socket 文件描述符发给工作进程。通过 cluster.fork() 复制的进程，环境变量就存在 NODE_UNIQUE_ID。
