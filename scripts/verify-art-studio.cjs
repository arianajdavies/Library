// Run from the repository root with Playwright available and the library served on port 4173.
const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))errors.push(r.status()+' '+r.url());});
 let visit=0;
 const go=async hash=>{await page.goto('http://127.0.0.1:4173/apps/art-studio.html?check='+(visit++)+'#'+hash);await page.locator('main h1').waitFor();};
 await go('home');await page.evaluate(()=>{state.sound=false;save();soundLabel();});assert.equal(await page.locator('.module').count(),12);
 await go('grownups');assert.equal(await page.locator('[data-extra]:checked').count(),0);for(const c of await page.locator('[data-extra]').all())await c.check();
 await go('home');assert.equal(await page.locator('.module').count(),16);
 const ids=await page.evaluate(()=>MODULES.map(m=>m.id));
 for(const id of ids){
  await go('lesson/'+id);assert.ok(await page.locator('.lesson-intro').isVisible());
  const missing=await page.locator('.art-strip img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));return imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src);});assert.deepEqual(missing,[]);
  await page.getByRole('link',{name:'Ready to play'}).click();await page.locator('#questionHeading').waitFor();
  for(let n=0;n<4;n++){
   const choices=await page.evaluate(()=>quiz.qs[quiz.index].choices);
   if(n===0){const wrong=choices.findIndex(c=>!c.right);await page.locator(`[data-choice="${wrong}"]`).click();assert.ok(await page.getByText('Keep looking. Try another choice.').isVisible());assert.equal(await page.locator('#nextQuestion').isVisible(),false);}
   await page.locator(`[data-choice="${choices.findIndex(c=>c.right)}"]`).click();assert.ok(await page.locator('#nextQuestion').isVisible());await page.locator('#nextQuestion').click();
  }
  await page.locator('#quizFinish').click();await page.locator('#note').fill('I noticed the shapes.');await page.locator('#completeModule').click();
 }
 await page.reload();assert.equal(await page.evaluate(()=>state.done.length),16);assert.equal(await page.evaluate(()=>Object.keys(state.notes).length),16);
 await go('lesson/patterns');await page.locator('[data-shape]').first().click();await page.locator('#repeat').click();assert.equal(await page.locator('#patternOut').textContent(),'●   |   ●   |   ●');
 await go('lesson/mix');await page.locator('#mixA').selectOption('Blue');await page.locator('#mixB').selectOption('Yellow');assert.equal(await page.locator('#mixed').textContent(),'Green');
 await go('lesson/mobiles');await page.locator('#balance').fill('0');assert.match(await page.locator('#balanceText').textContent(),/Balanced!/);
 await go('lesson/lines');const canvas=page.locator('canvas');await canvas.scrollIntoViewIfNeeded();const rect=await canvas.boundingBox();await page.mouse.move(rect.x+20,rect.y+20);await page.mouse.down();await page.mouse.move(rect.x+100,rect.y+100);await page.mouse.up();assert.equal(await page.evaluate(()=>document.querySelector('canvas').getContext('2d').getImageData(0,0,1200,480).data.some((v,i)=>i%4!==3&&v<250)),true);await page.locator('#undoDraw').click();
 await go('artists');await page.locator('#artistPool').selectOption('famous');await page.locator('#startArtists').click();assert.equal(await page.evaluate(()=>quiz.qs.length),6);for(let n=0;n<6;n++){const right=await page.evaluate(()=>quiz.qs[quiz.index].choices.findIndex(c=>c.right));await page.locator(`[data-choice="${right}"]`).click();await page.locator('#nextQuestion').click();}assert.ok(await page.getByRole('heading',{name:'You practiced 6 art ideas!'}).isVisible());
 await go('projects');assert.equal(await page.locator('.project-card').count(),26);await page.locator('#onlySupplies').check();assert.equal(await page.locator('.project-card').count(),0);for(const s of ['paper','crayons'])await page.locator(`[data-supply="${s}"]`).check();assert.ok(await page.locator('.project-card').count()>0);await page.locator('[data-made]').first().check();await page.reload();assert.equal(await page.evaluate(()=>state.projects.length),1);await page.locator('#projectSearch').fill('egg');assert.equal(await page.locator('.project-card').count(),1);
 await go('gallery');assert.equal(await page.locator('.art-card').count(),22);await page.locator('#galleryPool').selectOption('family');assert.equal(await page.locator('.art-card').count(),16);await page.locator('.art-card').first().click();assert.ok(await page.locator('dialog').isVisible());await page.locator('#closeArt').click();await page.locator('#galleryPool').selectOption('all');await page.locator('#artSearch').fill('Monet');assert.equal(await page.locator('.art-card').count(),1);
 for(const size of [{width:1440,height:1000},{width:390,height:844}]){await page.setViewportSize(size);for(const route of ['home','lesson/lines','lesson/lines/play','projects','gallery','grownups']){await go(route);const over=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);assert.equal(over,false,`${route} overflows at ${size.width}`);}await go('home');await page.screenshot({path:path.join(require('node:os').tmpdir(),`art-studio-qa-${size.width}.png`),fullPage:true});}
 await page.goto('http://127.0.0.1:4173/index.html#joseph');assert.equal(await page.locator('#joseph .app-card').count(),6);assert.equal(await page.locator('[data-app-total]').textContent(),'08');await page.getByRole('link',{name:'Open app'}).last().click();assert.match(page.url(),/art-studio/);
 const html=fs.readFileSync('index.html','utf8');for(const match of html.matchAll(/href="(apps\/[^"#]+)"/g))assert.ok(fs.existsSync(path.resolve(match[1])),`Missing ${match[1]}`);
 assert.deepEqual(errors,[]);console.log('PASS: 16 lesson flows, 64 questions with retries, 6 artist questions, storage, labs, project filters, 22 gallery images, 390/1440 layouts, and homepage links.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
