const {chromium}=require('playwright');
const assert=require('node:assert/strict'),path=require('node:path'),os=require('node:os');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))errors.push(r.status()+' '+r.url());});
 const go=async hash=>{await page.goto('http://127.0.0.1:4173/apps/art-studio.html#'+hash);await page.locator('main h1').waitFor();};
 await go('home');assert.equal(await page.locator('[href="#lesson/patterns"]').count(),0);
 await go('lesson/mix');await page.locator('.mix-chart img').evaluate(i=>i.decode());assert.ok(await page.locator('.mix-chart img').evaluate(i=>i.naturalWidth>=1500));
 for(const [a,b,result] of [['Blue','Yellow','Green'],['Red','Blue','Violet'],['Yellow','Red','Orange'],['Blue','Blue','Blue']]){
  await page.locator('#mixA').selectOption(a);await page.locator('#mixB').selectOption(b);
  assert.equal(await page.locator('#mixASwatch').textContent(),a);assert.equal(await page.locator('#mixBSwatch').textContent(),b);assert.equal(await page.locator('#mixed').textContent(),result);
  const same=await page.locator('#mixASwatch').evaluate(e=>getComputedStyle(e).backgroundColor)===await page.locator('#mixBSwatch').evaluate(e=>getComputedStyle(e).backgroundColor);assert.equal(same,a===b);
 }
 await page.screenshot({path:path.join(os.tmpdir(),'art-mixing-desktop.png'),fullPage:true});
 await go('artists');assert.equal(await page.locator('.artist-study [data-more-artist]').count(),22);
 const ids=await page.evaluate(()=>ART.map(a=>a.id));
 for(const id of ids){
  await page.locator(`.artist-study [data-more-artist="${id}"]`).click();await page.locator('#artDialog').waitFor();
  if(id==='totem'){assert.equal(await page.locator('.style-example').count(),0);assert.match(await page.locator('#artDetail').textContent(),/does not identify this maker/);}
  else{assert.equal(await page.locator('.style-example').count(),2);const missing=await page.locator('.style-example img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>i.decode().catch(()=>{})));return imgs.filter(i=>!i.naturalWidth).map(i=>i.src);});assert.deepEqual(missing,[]);}
  if(id==='gourmet'){assert.match(await page.locator('#artDetail').textContent(),/Cubist/);await page.screenshot({path:path.join(os.tmpdir(),'art-picasso-desktop.png')});}
  await page.locator('#closeArt').click();
 }
 await page.locator('#artistPool').selectOption('famous');await page.locator('#startArtists').click();
 for(let n=0;n<6;n++){
  const right=await page.evaluate(()=>quiz.qs[quiz.index].choices.findIndex(c=>c.right));await page.locator(`[data-choice="${right}"]`).click();
  const button=page.locator('#feedback [data-more-artist]');await button.click();assert.equal(await page.locator('.style-example').count(),2);await page.locator('#closeArt').click();await page.locator('#nextQuestion').click();
 }
 await page.locator('#quizFinish').click();await page.locator('.artist-study [data-more-artist]').first().click();assert.ok(await page.locator('#artDialog').isVisible());await page.locator('#closeArt').click();
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:844});await go('lesson/mix');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('#mixA').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(os.tmpdir(),`art-mixing-controls-${width}.png`)});
  await go('artists');await page.locator('.artist-study [data-more-artist="gourmet"]').click();assert.equal(await page.locator('#artDialog').evaluate(e=>e.scrollWidth>e.clientWidth),false);await page.screenshot({path:path.join(os.tmpdir(),`art-artist-style-${width}.png`)});await page.locator('#closeArt').click();
 }
 assert.deepEqual(errors,[]);console.log('PASS: removed module, supplied chart, color swatches, all 22 artwork style buttons and 38 additional images, quiz feedback and replay, mobile/desktop layouts.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
