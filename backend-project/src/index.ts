import Koa from 'koa'
import router from './router';
import middleware from './middleware';

const app = new Koa()

middleware(app)

router(app)

app.listen(7001, ()=>{
  console.log('server is running on 7001 ...')
})