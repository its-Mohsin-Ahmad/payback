import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless:"new", args:["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 320, height: 900, isMobile: true, hasTouch: true });
await p.goto("http://localhost:4173/payback/", { waitUntil: "networkidle2" });
await new Promise(x=>setTimeout(x,1800));
for (const r of ["/", "/app/cards", "/app/transactions", "/app/accounts"]) {
  await p.evaluate((x)=>{ history.pushState({},"","/payback"+x); dispatchEvent(new PopStateEvent("popstate")); }, r);
  await new Promise(x=>setTimeout(x,1100));
  const o = await p.evaluate(() => {
    const res = [];
    for (const el of document.querySelectorAll("body *")) {
      const s = getComputedStyle(el);
      if (!["auto","scroll"].includes(s.overflowX)) continue;
      if (el.scrollWidth > el.clientWidth + 1) {
        const rc = el.getBoundingClientRect();
        res.push({ cls:(el.className?.baseVal??el.className??"").toString().slice(0,58), clientW: el.clientWidth, scrollW: el.scrollWidth, over: el.scrollWidth - el.clientWidth, w: Math.round(rc.width) });
      }
    }
    return res.slice(0,5);
  });
  console.log("==", r, o.length ? "" : "(no inner scrollers)");
  o.forEach(x=>console.log("   ", JSON.stringify(x)));
}
await b.close();
