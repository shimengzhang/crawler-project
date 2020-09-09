import Router from 'koa-router';
import Koa from 'koa'; // 可以导入其他类型给参数使用 { Next }
import path from 'path';
import Crawler from './Crawler';
import RecommondAnalyzer from './recommondAnalyzer'
import {midFunc} from './myTypes';

const router = new Router()

export default (app: Koa)=>{
  router.get('/', async (ctx, next)=>{
    ctx.body = 'hello'
  })

  const getData:midFunc = async (ctx, next)=>{
    const recommondAnalyzer = new RecommondAnalyzer()
    const remd_url = 'http://business.autohome.com.cn/hotproduct'
    const remd_filePath = path.resolve(__dirname, '../data/products.json')
    const crawler = new Crawler(remd_url, remd_filePath, recommondAnalyzer)
    const result = await crawler.init()
    ctx.send(result)
  }

  // Koa.Context 类型的 ctx 不会报 send 属性不存在
  router.get('/getData', getData)

  app.use(router.routes())
    .use(router.allowedMethods())
}