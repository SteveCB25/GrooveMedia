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
    phone_result = results.get("phone", {})
    welcome_email = results.get("welcome_email", {})
    gbp_email = results.get("gbp_email", {})

    def _status(result: dict, success_label: str = "Done") -> str:
        if not result:
            return "⏭ Skipped"
        return f"✅ {success_label}" if result.get("success") else f"❌ {result.get('error', 'Failed')[:60]}"

    if subaccount.get("success"):
        sub_status = f"✅ Created — <code>{subaccount.get('id', '')}</code>"
    elif subaccount.get("error") == "GHL_COMPANY_ID not configured":
        sub_status = "⚠️ Skipped (GHL_COMPANY_ID missing)"
    else:
        sub_status = f"❌ {subaccount.get('error', 'Failed')[:60]}"

    if phone_result.get("success"):
        phone_status = f"✅ {phone_result.get('number', 'Provisioned')}"
    else:
        phone_status = _status(phone_result, "Provisioned")

    # Plan-specific Aria voice suggestion
    aria_suggestion = f"Hi, you've reached {first}'s service line. How can I help you today?"

    message = f"""🎉 <b>NEW PAYING CLIENT!</b>

👤 <b>{first} {last}</b> — {plan} Plan (${amount}/mo)
📧 {email}
📞 {phone or '— (not provided at checkout)'}

<b>⚙️ Automation Results:</b>
Sub-account:   {sub_status}
Phone number:  {phone_status}
GHL Contact:   {_status(contact, 'Created')}
Opportunity:   {_status(opportunity, 'Created')}
Welcome email: {_status(welcome_email, 'Sent')}
GBP request:   {_status(gbp_email, 'Sent')}

<b>📋 YOUR REMAINING MANUAL STEPS:</b>
□ Configure Aria — suggested intro:
  <i>"{aria_suggestion}"</i>
□ Submit A2P (use their Business Tax ID)
□ Build/update their website

⚡ <b>Open GHL →</b> app.gohighlevel.com/dashboard"""

    return await send_message(message)


async def send_error_alert(error: str, context: str = "") -> bool:
    """Send an error notification if something goes wrong during onboarding."""
    message = f"""⚠️ <b>Onboarder Error</b>

Context: {context}
Error: <code>{error}</code>

Check the backend logs for details."""
    return await send_message(message)
