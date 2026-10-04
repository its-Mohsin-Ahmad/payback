import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: "new", args:["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 320, height: 900, isMobile: true, hasTouch: true });
await p.goto("http://localhost:4173/payback/", { waitUntil: "networkidle2" });
await new Promise(r=>setTimeout(r,1500));
const out = await p.evaluate(() => {
  const rows = [];
  for (const el of Array.from(document.querySelectorAll("body *"))) {
    const s = getComputedStyle(el);
    if (s.display === "none") continue;
    // Content overflowing its OWN box = the real source.
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      const r = el.getBoundingClientRect();
      rows.push({ tag: el.tagName.toLowerCase(), cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0,95),
        clientW: el.clientWidth, scrollW: el.scrollWidth, rectW: Math.round(r.width),
        ox: s.overflowX, minW: s.minWidth });
    }
  }
  return rows.slice(0, 10);
});
console.log(JSON.stringify(out, null, 1));
await b.close();
