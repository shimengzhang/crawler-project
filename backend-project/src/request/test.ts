import qs from 'qs';

const data = {
  name: 'zhangsan',
  age: 40,
  score:[58,39,90,100]
}

const str = qs.stringify(data)
console.log(str)

const obj = qs.parse(str)
console.log(obj)