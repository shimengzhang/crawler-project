import {midFunc} from '../../myTypes';

const miSend:midFunc = async function (ctx, next) {
  ctx.send = (json:{})=>{
    ctx.set("Content-Type", "application/json")
    ctx.body = JSON.stringify(json)
  }
  await next()
}

export default () => {
  return miSend
}