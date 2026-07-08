const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    
    await page.goto('http://localhost:8000/', { waitUntil: 'networkidle0' });
    
    // Select candidate and start game
    await page.click('.faction-btn'); // click any faction
    await page.click('.candidate-card'); // select candidate
    await page.click('#start-game-btn'); // begin campaign
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Try to click ads button
    console.log('Clicking Ads button...');
    await page.click('.ads-map-btn');
    
    await new Promise(r => setTimeout(r, 1000));
    
    const isVisible = await page.$eval('#ads-modal', el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
    console.log('Is Ads Modal visible?', isVisible);
    
    const rect = await page.$eval('#ads-modal', el => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    console.log('Ads Modal rect:', rect);
    
    const innerRect = await page.$eval('.ads-modal-box', el => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    console.log('Inner Ads Modal Box rect:', innerRect);
    
    await browser.close();
})();
