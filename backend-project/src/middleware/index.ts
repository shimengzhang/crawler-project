import path from 'path'
import Koa from 'koa';
import bodyParser from 'koa-bodyparser'
import miSend from './mi-send'

export default (app:Koa) => {
  app.use(bodyParser())
  app.use(miSend())
}