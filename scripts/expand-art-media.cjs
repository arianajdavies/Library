// Download the additional curriculum examples and preserve their source records.
const fs=require('node:fs/promises'),sharp=require('sharp');
const root='apps/assets/art-studio/';
(async()=>{
 const sources=JSON.parse(await fs.readFile(root+'online-sources.json','utf8'));
 const additions=[{id:'apollo',title:'Landscape with Apollo Guarding the Herds of Admetus and Mercury Stealing Them',url:'https://upload.wikimedia.org/wikipedia/commons/b/b4/Claude_Lorrain_014.jpg',page:'https://commons.wikimedia.org/wiki/File:Claude_Lorrain_014.jpg',credit:'Public-domain painting reproduction, The Yorck Project / Wikimedia Commons; Galleria Doria Pamphilj.'},
 {id:'morisot-drawing',title:'Seated Girl (Julie Manet)',url:'https://www.artic.edu/iiif/2/4358f1d4-8894-da00-3cf5-af3902fb9b61/full/400,/0/default.jpg',page:'https://www.artic.edu/artworks/9483',credit:'Art Institute of Chicago, public-domain image. Colored pencils over touches of graphite.'},
 {id:'matisse-snail',title:'The Snail',url:'https://upload.wikimedia.org/wikipedia/en/7/7d/Matissesnail.jpg',page:'https://www.tate.org.uk/art/artworks/matisse-the-snail-t00540',credit:'Tate collection; image via Wikimedia; © Succession H. Matisse / ARS'}];
 const d=(await (await fetch('https://api.artic.edu/api/v1/artworks/7556?fields=id,title,artist_title,date_display,image_id,medium_display')).json()).data;
 additions.push({id:'claude-drawing',title:d.title,url:`https://www.artic.edu/iiif/2/${d.image_id}/full/843,/0/default.jpg`,page:'https://www.artic.edu/artworks/7556',credit:'Art Institute of Chicago, public-domain image. '+d.medium_display});
 for(const a of additions){const r=await fetch(a.url,{signal:AbortSignal.timeout(30000),headers:{'User-Agent':'Mozilla/5.0'}});if(!r.ok)throw Error(r.status+' '+a.url);await sharp(Buffer.from(await r.arrayBuffer())).resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).jpeg({quality:88}).toFile(root+a.id+'.jpg');const index=sources.findIndex(x=>x.id===a.id);if(index<0)sources.push(a);else sources[index]=a;}
 const style=JSON.parse(await fs.readFile(root+'artist-galleries.json','utf8')).find(g=>g.artist==='Georges Seurat').works[0];
 await fs.copyFile(root+style.file,root+'circus.jpg');
 const seurat={id:'circus',title:style.title,url:style.url,page:style.source,credit:style.credit};const i=sources.findIndex(x=>x.id==='circus');if(i<0)sources.push(seurat);else sources[i]=seurat;
 await fs.writeFile(root+'online-sources.json',JSON.stringify(sources,null,2));await fs.writeFile(root+'online-sources.js','const IMAGE_SOURCES = '+JSON.stringify(sources,null,2)+';\n');
 console.log('Saved Apollo landscape, Claude ink drawing, and Seurat Circus.');
})().catch(e=>{console.error(e);process.exitCode=1;});
