"""
Telegram Tools — Notification delivery for the Onboarder Agent
Bot: Groove Media Alerts (8739048825)
"""

import os
import logging
import httpx

logger = logging.getLogger(__name__)

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "8739048825:AAEe3_6xtJ4idxopxBo4Ge8tH8lVEkXYio4")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "1404117769")
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


async def send_message(text: str) -> bool:
    """Send a plain text message to Stephen's Telegram."""
    try:
        async with httpx.AsyncClient(timeout=10) as http:
            response = await http.post(
                f"{TELEGRAM_API}/sendMessage",
                json={
                    "chat_id": TELEGRAM_CHAT_ID,
                    "text": text,
                    "parse_mode": "HTML"
                }
            )
            if response.status_code == 200:
                logger.info("Telegram notification sent successfully")
                return True
            else:
                logger.error(f"Telegram send failed: {response.status_code} — {response.text}")
                return False
    except Exception as e:
        logger.error(f"Telegram send exception: {e}")
        return False


async def send_onboarding_alert(client: dict, results: dict) -> bool:
    """
    Send a full onboarding notification with client details and checklist.
    Fires immediately after a new Stripe payment is confirmed.
    """
    plan = client.get("plan", "Unknown")
    amount = client.get("amount", 0)
    first = client.get("first_name", "")
    last = client.get("last_name", "")
    email = client.get("email", "—")
    phone = client.get("phone", "—")

    contact = results.get("contact", {})
    opportunity = results.get("opportunity", {})
    subaccount = results.get("subaccount", {})

    contact_status = "✅ Created" if contact.get("success") else f"❌ Failed: {contact.get('error', '')}"
    opp_status = "✅ Created" if opportunity.get("success") else f"❌ Failed: {opportunity.get('error', '')}"

    if subaccount.get("success"):
        sub_status = f"✅ Created (ID: <code>{subaccount.get('id', '')}</code>)"
    elif subaccount.get("error") == "GHL_COMPANY_ID not configured":
        sub_status = "⚠️ Skipped (set GHL_COMPANY_ID in env)"
    else:
        sub_status = f"❌ Failed: {subaccount.get('error', 'not attempted')}"

    # Plan-specific Aria voice name suggestions
    aria_suggestion = f"Hi, you've reached {first}'s {plan.lower()} service line. How can I help you today?"

    message = f"""🎉 <b>NEW PAYING CLIENT!</b>

👤 <b>{first} {last}</b> — {plan} Plan (${amount}/mo)
📧 {email}
📞 {phone or '— (collect during onboarding)'}

<b>Automation Results:</b>
GHL Sub-account: {sub_status}
GHL Contact: {contact_status}
GHL Opportunity: {opp_status}

<b>📋 YOUR 7-DAY ONBOARDING CHECKLIST:</b>
□ Configure Aria in new sub-account — suggested intro:
  <i>"{aria_suggestion}"</i>
□ Provision phone number in GHL
□ Submit A2P registration (use their Tax ID)
□ Build/update their website
□ Request GBP Manager access
□ Send welcome email to {email}

⚡ <b>Start here →</b> app.gohighlevel.com/dashboard"""

    return await send_message(message)


async def send_error_alert(error: str, context: str = "") -> bool:
    """Send an error notification if something goes wrong during onboarding."""
    message = f"""⚠️ <b>Onboarder Error</b>

Context: {context}
Error: <code>{error}</code>

Check the backend logs for details."""
    return await send_message(message)
