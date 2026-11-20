const USDA_SEARCH_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';
const ALLOWED_DATA_TYPES = ['Foundation', 'SR Legacy', 'Survey (FNDDS)'];

function nutrientValue(food, nutrientId) {
  const nutrient = (food.foodNutrients || []).find((item) => Number(item.nutrientId) === nutrientId);
  const value = Number(nutrient?.value ?? nutrient?.amount ?? 0);
  return Number.isFinite(value) ? value : 0;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Use GET to search USDA foods.' });
  }

  const query = String(req.query?.query || '').trim().slice(0, 80);
  if (query.length < 2) return res.status(400).json({ error: 'Enter at least 2 characters.' });

  const apiKey = process.env.USDA_API_KEY || 'DEMO_KEY';
  const url = new URL(USDA_SEARCH_URL);
  url.searchParams.set('api_key', apiKey);

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        dataType: ALLOWED_DATA_TYPES,
        pageSize: 10,
        pageNumber: 1,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!upstream.ok) {
      const status = upstream.status === 429 ? 429 : 502;
      return res.status(status).json({
        error: status === 429
          ? 'USDA search limit reached. Please try again later.'
          : 'USDA FoodData Central is temporarily unavailable.',
      });
    }

    const payload = await upstream.json();
    const foods = (payload.foods || [])
      .map((food) => ({
        fdcId: Number(food.fdcId),
        name: String(food.description || '').slice(0, 180),
        dataType: ALLOWED_DATA_TYPES.includes(food.dataType) ? food.dataType : 'USDA food',
        kcal: nutrientValue(food, 1008),
        protein: nutrientValue(food, 1003),
        carbs: nutrientValue(food, 1005),
        fat: nutrientValue(food, 1004),
        fiber: nutrientValue(food, 1079),
        sodium: nutrientValue(food, 1093),
      }))
      .filter((food) => food.fdcId && food.name && food.kcal > 0)
      .slice(0, 10);

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ foods });
  } catch (error) {
    console.error('USDA food search failed:', error);
    return res.status(502).json({ error: 'Could not reach USDA FoodData Central. Please retry.' });
  }
}
