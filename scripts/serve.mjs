import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}let info;try{info=await stat(file)}catch{}if(info?.isDirectory())file=path.join(file,'index.html');if(!info&&path.basename(file).startsWith('__next.')&&file.endsWith('.txt')){const parts=path.basename(file,'.txt').split('.');file=path.join(path.dirname(file),parts.slice(0,2).join('.'),...parts.slice(2))+'.txt';}const content=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(content)}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});try{res.end(await readFile(path.join(root,'404.html')))}catch{res.end('Not found')}}}).listen(3000,'127.0.0.1',()=>console.log('Portfolio preview: http://127.0.0.1:3000'));

