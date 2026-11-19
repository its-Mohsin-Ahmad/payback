import puppeteer from "puppeteer-core";

const b = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox"],
});

/* Hit-test must happen with the link scrolled into the viewport —
   elementFromPoint uses viewport coords and returns null otherwise. */
async function hitCheck(p, label) {
  return p.evaluate((lbl) => {
    const links = Array.from(document.querySelectorAll("footer ul a"));
    let inView = 0;
    let hittable = 0;
    for (const a of links) {
      a.scrollIntoView({ block: "center" });
      const r = a.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight || r.width === 0) continue;
      inView++;
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (hit === a || a.contains(hit)) hittable++;
    }
    return { label: lbl, links: links.length, inView, hittable };
  }, label);
}

// --- Desktop: links must be visible and clickable without any interaction ---
{
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  await p.goto("http://localhost:4173/payback/", { waitUntil: "networkidle2" });
  await new Promise((x) => setTimeout(x, 1200));
  console.log(JSON.stringify(await hitCheck(p, "desktop 1280 initial")));
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((x) => setTimeout(x, 500));
  await p.screenshot({ path: "footer-1280.png" });
  await p.close();
}

// --- Mobile: starts collapsed, opens on tap, links then clickable ---
{
  const p = await b.newPage();
  await p.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await p.goto("http://localhost:4173/payback/", { waitUntil: "networkidle2" });
  await new Promise((x) => setTimeout(x, 1200));
  console.log(JSON.stringify(await hitCheck(p, "mobile 375 initial (expect collapsed)")));

  await p.evaluate(() => document.querySelector("footer details summary").click());
  await new Promise((x) => setTimeout(x, 500));
  console.log(JSON.stringify(await hitCheck(p, "mobile 375 after 1 tap (expect 5)")));

  // Open all four columns; all 20 links must then be clickable.
  await p.evaluate(() => {
    document.querySelectorAll("footer details summary").forEach((s, i) => {
      if (i > 0) s.click();
    });
  });
  await new Promise((x) => setTimeout(x, 600));
  console.log(JSON.stringify(await hitCheck(p, "mobile 375 all open (expect 20)")));
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((x) => setTimeout(x, 500));
  await p.screenshot({ path: "footer-375.png" });
  await p.close();
}
await b.close();