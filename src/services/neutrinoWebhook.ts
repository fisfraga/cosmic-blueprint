/**
 * Neutrino Platform Webhook Handler
 *
 * This service handles incoming webhook events from Neutrino Platform.
 * When Neutrino generates a chart, it can send the data to your webhook endpoint.
 *
 * Setup:
 * 1. Configure your webhook URL in Neutrino Platform dashboard
 * 2. Deploy a serverless function to handle the webhook (see api/neutrino-webhook.ts)
 * 3. Process the chart data and update your profile
 *
 * This file provides types and utilities for processing Neutrino webhook data.
 */

/**
 * Neutrino Chart Data - Structure received from webhooks
 * Note: This is an estimated structure based on common HD chart data.
 * Update once you have actual webhook response samples.
 */
export interface NeutrinoChartData {
  // Chart identification
  chartId?: string;
  createdAt?: string;

  // Birth data
  birthData: {
    date: string;
    time: string;
    location: {
      latitude: number;
      longitude: number;
      city?: string;
      country?: string;
    };
    timezone: string;
  };

  // Human Design calculations
  type?: string;
  strategy?: string;
  authority?: string;
  profile?: string;
  incarnationCross?: string;
  definition?: string;

  // Centers
  centers?: {
    id: string;
    name: string;
    defined: boolean;
  }[];

  // Gates (personality = conscious, design = unconscious)
  personalityGates?: {
    gate: number;
    line: number;
    planet: string;
  }[];

  designGates?: {
    gate: number;
    line: number;
    planet: string;
  }[];

  // Channels
  channels?: {
    id: string;
    gate1: number;
    gate2: number;
    name?: string;
  }[];

  // Variables (arrows)
  variables?: {
    digestion?: string;
    environment?: string;
    perspective?: string;
    awareness?: string;
  };

  // Raw planetary positions (if provided)
  natalPositions?: {
    [planet: string]: {
      longitude: number;
      sign: string;
      degree: number;
      minute: number;
    };
  };

  designPositions?: {
    [planet: string]: {
      longitude: number;
      sign: string;
      degree: number;
      minute: number;
    };
  };
}

/**
 * Neutrino Webhook Event
 */
export interface NeutrinoWebhookEvent {
  event: 'chart.created' | 'chart.updated' | 'transit.calculated';
  timestamp: string;
  data: NeutrinoChartData;
}

/**
 * Process incoming webhook data and convert to our HumanDesignProfile format
 */
export function processNeutrinoChartData(data: NeutrinoChartData) {
  const humanDesignProfile = {
    type: data.type || 'Unknown',
    strategy: data.strategy || 'Unknown',
    authority: data.authority || 'Unknown',
    profile: data.profile || '0/0',
    incarnationCross: data.incarnationCross || 'Unknown',
    definition: data.definition || 'Unknown',

    definedCenterIds: data.centers
      ?.filter(c => c.defined)
      .map(c => c.id) || [],

    definedChannelIds: data.channels?.map(c => c.id) || [],

    personalityGates: data.personalityGates?.map(g => ({
      gateId: `gate-${g.gate}`,
      gateNumber: g.gate,
      line: g.line,
      planet: g.planet,
    })) || [],

    designGates: data.designGates?.map(g => ({
      gateId: `gate-${g.gate}`,
      gateNumber: g.gate,
      line: g.line,
      planet: g.planet,
    })) || [],
  };

  return humanDesignProfile;
}

/**
 * Verify webhook signature (implement based on Neutrino's security docs)
 * @param _payload - The webhook payload body
 * @param _signature - The signature header from the webhook request
 * @param _secret - The shared secret for HMAC verification
 */
export function verifyWebhookSignature(
  // Parameters prefixed with _ indicate intentionally unused for now
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _payload: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _signature: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _secret: string
): boolean {
  // TODO: Implement signature verification based on Neutrino's documentation
  // Common approaches:
  // 1. HMAC-SHA256 of payload with secret
  // 2. Compare with provided signature header

  // Placeholder - always returns true until we have Neutrino's security docs
  console.warn('Webhook signature verification not implemented');
  return true;
}

/**
 * Example serverless function handler (for Vercel/Netlify)
 *
 * Deploy this as api/neutrino-webhook.ts for Vercel
 * or as netlify/functions/neutrino-webhook.ts for Netlify
 */
export const exampleServerlessHandler = `
// api/neutrino-webhook.ts (Vercel)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processNeutrinoChartData, verifyWebhookSignature } from '../src/services/neutrinoWebhook';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify signature
    const signature = req.headers['x-neutrino-signature'] as string;
    const secret = process.env.NEUTRINO_WEBHOOK_SECRET || '';

    if (!verifyWebhookSignature(JSON.stringify(req.body), signature, secret)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Process the chart data
    const event = req.body;
    const profile = processNeutrinoChartData(event.data);

    // TODO: Save to database or send to client via WebSocket
    console.log('Received Neutrino chart:', profile);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
`;

/**
 * Store chart data locally (for development/testing)
 */
const chartCache = new Map<string, NeutrinoChartData>();

export function cacheChartData(chartId: string, data: NeutrinoChartData): void {
  chartCache.set(chartId, data);
}

export function getCachedChart(chartId: string): NeutrinoChartData | undefined {
  return chartCache.get(chartId);
}

export function clearChartCache(): void {
  chartCache.clear();
}
