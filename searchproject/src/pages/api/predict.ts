import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.AZURE_ML_API_KEY;
  const endpoint = 'https://thulasiraman2882020-2972-gjdeh.eastus2.inference.ml.azure.com/score';

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'azureml-model-deployment': 'thulasiraman2882020-2972-gjdeh'
      },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();

    res.status(response.status).json(result);
  } catch (err) {
    console.error('Azure ML request failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
