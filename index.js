const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/api/claude', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        messages: req.body.messages
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const key = process.env.FINNHUB_KEY;
    if (!key) { res.json([]); return; }
    const cats = ['forex', 'general'];
    let news = [];
    for (const cat of cats) {
      const r = await fetch(`https://finnhub.io/api/v1/news?category=${cat}&token=${key}`);
      const d = await r.json();
      if (Array.isArray(d)) news = [...news, ...d.slice(0, 15)];
    }
    news.sort((a, b) => b.datetime - a.datetime);
    res.json(news.slice(0, 40));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('APEX FX running on port ' + PORT));
