import Koa from 'koa';

export interface midFunc {
  (ctx: Koa.Context, next:Koa.Next):Promise<any>
}