import { Injectable } from "@nestjs/common";
import { readFile , writeFile } from "fs/promises";

@Injectable()
export class PackRepository {
    
    async findOne(id: string) {
       const data = await readFile('./packs.json', 'utf-8');
       const packs = JSON.parse(data);

       return packs[id];
    }

    async findAll() {
       const data = await readFile('./packs.json', 'utf-8');
       const packs = JSON.parse(data);
          return Object.values(packs);
    }

    async create(content: any) {
       const datas = await readFile('./packs.json', 'utf-8');
       const packs = JSON.parse(datas);

       const id = Math.floor(Math.random() * 10000);

       packs[id] = { id, content };

         await writeFile('./packs.json', JSON.stringify(packs));

    }
}