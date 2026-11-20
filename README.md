# DietPlanner

DietPlanner is a static nutrition tracker deployed on Vercel, with a Vercel function for USDA FoodData Central searches.

## USDA food search

The app searches USDA Foundation, SR Legacy, and FNDDS foods. Nutrient values are normalized per 100 g and the amount slider scales calories, protein, carbohydrates, fat, fiber, and sodium by the selected grams.

The API route uses USDA's shared `DEMO_KEY` for initial use. It has a much lower quota than a personal key. For regular use, create a free FoodData Central API key and add it to the Vercel project as the `USDA_API_KEY` environment variable. The key stays server-side and should not be committed to this repository.
