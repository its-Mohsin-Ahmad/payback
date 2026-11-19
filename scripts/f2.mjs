import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless:"new", args:["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 320, height: 720, isMobile: true, hasTouch: true });
await p.goto("http://localhost:4173/payback/", { waitUntil: "networkidle2" });
await new Promise(x=>setTimeout(x,1600));
const o = await p.evaluate(() => {
  const f = document.querySelector("footer");
  const grid = f.querySelector("div.grid");
  const dets = Array.from(f.querySelectorAll("details")).map(d => {
    const rc = d.getBoundingClientRect();
    const sum = d.querySelector("summary").getBoundingClientRect();
    return { h: Math.round(rc.height), sumH: Math.round(sum.height), open: d.open };
  });
  return {
    footerH: Math.round(f.getBoundingClientRect().height),
    gridCls: grid.className.slice(0,80),
    gridGap: getComputedStyle(grid).rowGap,
    dets,
    bannerH: Math.round(document.querySelector("header").previousElementSibling?.getBoundingClientRect().height ?? 0),
    headerH: Math.round(document.querySelector("header").getBoundingClientRect().height),
  };
});
console.log(JSON.stringify(o, null, 1));
await b.close();
