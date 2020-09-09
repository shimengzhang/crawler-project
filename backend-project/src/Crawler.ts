import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export interface Analyze {
  analyze:(html:string, filePath:string) => any
}

export default class Crawler{
  constructor(public url: string, public filePath: string, public analyzer: Analyze){
  }

  async init(){
    const html = await this.getRawHtml();
    if(html){
      const result = this.analyzer.analyze(html, this.filePath)
      this.writeFile(result)
      return result;
    }
  }

  writeFile(content: string){
    fs.writeFileSync(this.filePath, content)
  }

  async getRawHtml(): Promise<string|undefined> {
    try {
      const result = await axios.get(this.url);
      return result.data;
    } catch (error) {
      console.log('获取失败')
    }
  }
}
