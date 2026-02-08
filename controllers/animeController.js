async function rapidApiSearch(q) {
  const key = process.env.ANIME_API_KEY;
  const host = process.env.ANIME_API_HOST;

  if (!key || !host) return null;

  const url = `https://${host}/v4/anime?q=${encodeURIComponent(q)}&limit=12`;
  const resp = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host
    }
  });

  if (!resp.ok) return null;
  return resp.json();
}

async function jikanFallbackSearch(q) {
  const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=12`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Anime API error");
  return resp.json();
}

exports.searchAnime = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (q.length < 2) return res.status(400).json({ message: "Type at least 2 characters." });

    let data = await rapidApiSearch(q);
    if (!data) data = await jikanFallbackSearch(q);

    const items = (data.data || []).map(a => ({
      id: a.mal_id,
      title: a.title,
      image: a.images?.jpg?.image_url || "",
      score: a.score ?? null,
      year: a.year ?? null
    }));

    res.json({ items });
  } catch (err) {
    next(err);
  }
};
