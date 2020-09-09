import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import {Analyze} from './Crawler';

interface productInfo {
  href?: string,
  title: string,
  price: number
}

interface jsonInfo {
  [propName:number]: productInfo[]
}

export default class RecommondAnalyzer implements Analyze{
  analyze(html:string, filePath:string):string{
    const result = this.getRecommendInfo(html)
    return JSON.stringify(this.generateJson(result, filePath))
  }

  generateJson(content:Array<productInfo>, filePath:string){
    let fileContent:Array<jsonInfo> = []
    if(fs.existsSync(filePath)){
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }
    fileContent.push({
      [new Date().getTime()]:content
    })
    return fileContent
  }

  getRecommendInfo(html:string){
    const $ = cheerio.load(html)
    const recommendList = $('.Recommend_item__2FpRp')
    const productArr:Array<productInfo> = [];
    recommendList.map((index, ele)=>{
      const href = $(ele).find('a').attr('href')
      const title = $(ele).find('.Recommend_name__2Ia9e').text()
      const price = parseInt($(ele).find('.Recommend_sellPrice__hiovE em').text(), 10)
      productArr.push({
        href,
        title,
        price
      })
    })
    return productArr;
  }
}