# README

## 1 为什么不 xx

1.  > 为什么不重写一套前端？

   1.  跨域问题。我自己建个站挂上新的前端，对论坛后端的访问是跨域的。显然我没法解决这个问题（得让论坛的后端工程师把我的站点加入允许的 origin）或者不想解决这个问题（自己搭个后端服务来转发请求）。
   2.  我的目的并不是重写整个论坛，也不想阅读很多的文档。这当然是个雄心勃勃的计划，但是我对我个人的生产力水平而言是不现实的。只想调整一下显示的效果而已，不必为了摘个果子去种一片森林。
   3.  论坛的重构不是一个技术问题，经过管事的大佬的暗示。

2.  > 为什么不用论坛的接口？

   1.  不想抓包/读文档。论坛的前端和开放的 RESTful 接口是无关的，论坛的前端已经很老了，走的是另一套接口。如果用老前端的接口，就要抓包自己分析；如果用RESTful接口，我需要向管理组提出申请，why bother?


