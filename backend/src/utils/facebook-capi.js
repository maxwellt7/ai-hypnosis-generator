import crypto from 'crypto';
import bizSdk from 'facebook-nodejs-business-sdk';
import { logger } from './logger.js';

const { ServerEvent, EventRequest, UserData, CustomData } = bizSdk;

function sha256(value) {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function getConfig() {
  const pixelId = process.env.FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_CAPI_TOKEN;
  if (!pixelId || !accessToken) return null;
  return { pixelId, accessToken };
}

async function sendEvent(eventName, email, extraData = {}) {
  const config = getConfig();
  if (!config) {
    logger.warn('[FB CAPI] Skipping — FACEBOOK_PIXEL_ID or FACEBOOK_CAPI_TOKEN not set');
    return;
  }

  try {
    const userData = new UserData().setEmail(sha256(email));

    const customData = new CustomData();
    if (extraData.value !== undefined) customData.setValue(extraData.value);
    if (extraData.currency) customData.setCurrency(extraData.currency);

    const event = new ServerEvent()
      .setEventName(eventName)
      .setEventTime(Math.floor(Date.now() / 1000))
      .setEventId(`${eventName}-${Date.now()}-${Math.random().toString(36).slice(2)}`)
      .setUserData(userData)
      .setCustomData(customData)
      .setActionSource('website');

    await new EventRequest(config.accessToken, config.pixelId)
      .setEvents([event])
      .execute();

    logger.info(`[FB CAPI] ${eventName} event sent for ${email}`);
  } catch (err) {
    logger.error(`[FB CAPI] Failed to send ${eventName} event:`, err.message);
  }
}

export async function sendPurchaseEvent(email) {
  return sendEvent('Purchase', email, { value: 29, currency: 'USD' });
}

export async function sendLeadEvent(email) {
  return sendEvent('Lead', email, {});
}
