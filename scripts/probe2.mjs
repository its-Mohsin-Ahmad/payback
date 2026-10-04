import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: "new", args:["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 320, height: 900, isMobile: true, hasTouch: true });
await p.goto("http://localhost:4173/payback/", { waitUntil: "networkidle2" });
await new Promise(r=>setTimeout(r,1500));
const out = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const clipped = (el) => {
    let n = el.parentElement;
    while (n && n !== document.body) {
      const s = getComputedStyle(n);
      if (["hidden","clip","auto","scroll"].includes(s.overflowX)) return true;
      n = n.parentElement;
    }
    return false;
  };
  const rows = [];
  for (const el of Array.from(document.querySelectorAll("body *"))) {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.position === "fixed") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    if (r.right > vw + 1 && !clipped(el)) {
      rows.push({ tag: el.tagName.toLowerCase(), cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0,100),
        w: Math.round(r.width), right: Math.round(r.right), text: (el.textContent||"").trim().slice(0,40) });
    }
  }
  return rows.slice(0, 8);
});
console.log(JSON.stringify(out, null, 1));
await b.close();
