import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env.js';

// Client is created once — API key stays server-side
const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

// ── Property recommendations ──────────────────────────────────────────────────
// Takes user preferences and a list of available properties.
// Returns a ranked list with reasoning for each recommendation.
export const getPropertyRecommendations = async (preferences, properties) => {
  const propertyList = properties
    .slice(0, 20) // Cap to avoid token overload
    .map((p, i) => `
      ${i + 1}. ID: ${p._id}
         Title: ${p.title}
         Price: $${p.price.toLocaleString()}
         Type: ${p.type} | Category: ${p.category}
         Bedrooms: ${p.bedrooms} | Bathrooms: ${p.bathrooms}
         Area: ${p.area}m² | City: ${p.address.city}
         Amenities: ${p.amenities?.join(', ') || 'none'}
    `).join('\n');

  const prompt = `You are a helpful real estate advisor. Based on the user's preferences, 
rank the following properties and explain why each one is or isn't a good match.

User preferences:
- Budget: $${preferences.minPrice || 0} - $${preferences.maxPrice || 'unlimited'}
- Type: ${preferences.type || 'any'}
- Minimum bedrooms: ${preferences.bedrooms || 'any'}
- City: ${preferences.city || 'any'}
- Must-have amenities: ${preferences.amenities?.join(', ') || 'none specified'}
- Additional notes: ${preferences.notes || 'none'}

Available properties:
${propertyList}

Respond with a JSON array (no markdown) of the top 5 matches in this exact format:
[
  {
    "propertyId": "the MongoDB _id",
    "rank": 1,
    "matchScore": 95,
    "reasons": ["reason 1", "reason 2"],
    "concerns": ["any concern if applicable"]
  }
]`;

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();
  return JSON.parse(text);
};

// ── Mortgage advice ───────────────────────────────────────────────────────────
export const getMortgageAdvice = async ({ propertyPrice, downPayment, income, question }) => {
  const prompt = `You are a helpful mortgage advisor. Answer the user's question concisely.

Property details:
- Property price: $${propertyPrice?.toLocaleString() || 'not specified'}
- Down payment: $${downPayment?.toLocaleString() || 'not specified'} (${downPayment && propertyPrice ? Math.round((downPayment / propertyPrice) * 100) : '?'}%)
- Annual income: $${income?.toLocaleString() || 'not specified'}

User question: ${question}

Provide practical, clear advice in 2-3 short paragraphs. Do not provide specific legal or financial advice — recommend they consult a licensed mortgage broker for personalised guidance.`;

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text;
};
