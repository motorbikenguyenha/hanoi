const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // phục vụ index.html & sitemap.xml

const SITEMAP = path.join(__dirname, 'sitemap.xml');

app.post('/sitemap/append', async (req,res)=>{
  try{
    const urls = Array.isArray(req.body?.urls) ? req.body.urls : [];
    if(!urls.length) return res.status(400).json({ok:false, error:'No URLs'});
    // đọc sitemap cũ
    let old = '';
    try{ old = fs.readFileSync(SITEMAP,'utf8'); }catch{ old=''; }
    // tập hợp URL cũ
    const oldLocs = new Set();
    if (old){
      const m = [...old.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);
      m.forEach(u=>oldLocs.add(u));
    }
    // gộp mới
    urls.forEach(u=>oldLocs.add(u));
    const today = new Date().toISOString().split('T')[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const u of oldLocs){
      xml += `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;
    }
    xml += `</urlset>\n`;
    fs.writeFileSync(SITEMAP, xml, 'utf8');
    res.json({ok:true, count: oldLocs.size});
  }catch(e){
    res.status(500).json({ok:false, error:e.message});
  }
});

app.listen(3000, ()=>console.log('http://localhost:3000'));
