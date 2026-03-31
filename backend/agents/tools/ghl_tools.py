"""
GHL Tools — GoHighLevel API calls for the Onboarder Agent
Location: GSk4D9ffTVB1SOqwLQcV (The Groove Media)
"""

import os
import re
import logging
import httpx

logger = logging.getLogger(__name__)

GHL_API_KEY = os.environ.get("GHL_API_KEY", "pit-f7aaf747-e865-4697-9ba3-54dbcee4f449")
GHL_LOCATION_ID = os.environ.get("GHL_LOCATION_ID", "GSk4D9ffTVB1SOqwLQcV")
GHL_PIPELINE_ID = os.environ.get("GHL_PIPELINE_ID", "Ozi1ok3AstGt3U6V0xnY")
GHL_STAGE_ID = os.environ.get("GHL_STAGE_ID", "2d34b0e7-3237-4c31-86bf-c1fbc61f63ca")

# Agency-level credentials for sub-account creation
GHL_AGENCY_API_KEY = os.environ.get("GHL_AGENCY_API_KEY", "pit-76f2f13c-ccc7-4e1c-800a-70ef9cf296d2")
GHL_COMPANY_ID = os.environ.get("GHL_COMPANY_ID", "9SPNF61EQwXgoL26U9GM")

# Per-tier GHL snapshot IDs — set these in Vercel env vars once snapshots are created in GHL
GHL_SNAPSHOT_STARTER   = os.environ.get("GHL_SNAPSHOT_STARTER", "")
GHL_SNAPSHOT_GROWTH    = os.environ.get("GHL_SNAPSHOT_GROWTH", "")
GHL_SNAPSHOT_DOMINATOR = os.environ.get("GHL_SNAPSHOT_DOMINATOR", "")

GHL_BASE_URL = "https://services.leadconnectorhq.com"
GHL_HEADERS = {
    "Authorization": f"Bearer {GHL_API_KEY}",
    "Version": "2021-07-28",
    "Content-Type": "application/json",
}
GHL_AGENCY_HEADERS = {
    "Authorization": f"Bearer {GHL_AGENCY_API_KEY}",
    "Version": "2021-07-28",
    "Content-Type": "application/json",
}


async def create_contact(client: dict) -> dict:
    """
    Create a new GHL contact for a paying client.
    Tags: paid-client, onboarding-pending
    """
    payload = {
        "locationId": GHL_LOCATION_ID,
        "firstName": client.get("first_name", ""),
        "lastName": client.get("last_name", "Client"),
        "email": client.get("email", ""),
        "phone": client.get("phone", ""),
        "tags": ["paid-client", "onboarding-pending", f"plan-{client.get('plan', 'starter').lower()}"],
        "source": "stripe-checkout",
        "customFields": [
            {
                "id": "sOAk2cmMTyAxou4baavq",  # which_plan_did_you_purchase
                "value": client.get("plan", "")
            }
        ]
    }

    try:
        async with httpx.AsyncClient(timeout=10) as http:
            response = await http.post(
                f"{GHL_BASE_URL}/contacts/",
                headers=GHL_HEADERS,
                json=payload
            )
            data = response.json()

            if response.status_code in (200, 201):
                contact_id = data.get("contact", {}).get("id", "")
                logger.info(f"GHL contact created: {contact_id} for {client.get('email')}")
                return {"success": True, "id": contact_id, "data": data.get("contact", {})}
            else:
                logger.error(f"GHL contact creation failed: {response.status_code} — {data}")
                return {"success": False, "error": str(data)}

    except Exception as e:
        logger.error(f"GHL create_contact exception: {e}")
        return {"success": False, "error": str(e)}


async def create_opportunity(client: dict, contact_id: str) -> dict:
    """
    Create a GHL opportunity in the Marketing Pipeline at Payment Complete stage.
    """
    if not contact_id:
        logger.warning("create_opportunity called without contact_id — skipping")
        return {"success": False, "error": "No contact_id provided"}

    payload = {
        "pipelineId": GHL_PIPELINE_ID,
        "locationId": GHL_LOCATION_ID,
        "name": f"{client.get('first_name', '')} {client.get('last_name', '')} — {client.get('plan', '')} Plan",
        "pipelineStageId": GHL_STAGE_ID,
        "status": "open",
        "contactId": contact_id,
        "monetaryValue": client.get("amount", 0),
        "source": "stripe-checkout",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as http:
            response = await http.post(
                f"{GHL_BASE_URL}/opportunities/",
                headers=GHL_HEADERS,
                json=payload
            )
            data = response.json()

            if response.status_code in (200, 201):
                opp_id = data.get("opportunity", {}).get("id", "")
                logger.info(f"GHL opportunity created: {opp_id}")
                return {"success": True, "id": opp_id}
            else:
                logger.error(f"GHL opportunity creation failed: {response.status_code} — {data}")
                return {"success": False, "error": str(data)}

    except Exception as e:
        logger.error(f"GHL create_opportunity exception: {e}")
        return {"success": False, "error": str(e)}


async def create_subaccount(client: dict) -> dict:
    """
    Create a new GHL sub-account (location) for an onboarded client.
    Uses the Agency API key with locations.write scope.

    Requires GHL_COMPANY_ID to be set in environment variables.
    Optionally clones from GHL_TEMPLATE_SNAPSHOT_ID if set.
    """
    if not GHL_COMPANY_ID:
        logger.warning("GHL_COMPANY_ID not set — skipping sub-account creation")
        return {"success": False, "error": "GHL_COMPANY_ID not configured"}

    business = (
        client.get("business_name")
        or f"{client.get('first_name', '')} {client.get('last_name', '')}".strip()
        or "New Client"
    )

    payload = {
        "name": business,
        "companyId": GHL_COMPANY_ID,
        "email": client.get("email", ""),
        "phone": client.get("phone", ""),
        "address": client.get("address", ""),
        "city": client.get("city", ""),
        "state": client.get("state", ""),
        "country": "US",
        "postalCode": client.get("postal_code", ""),
        "website": client.get("website", ""),
        "timezone": "America/New_York",
        "prospectInfo": {
            "firstName": client.get("first_name", ""),
            "lastName": client.get("last_name", ""),
            "email": client.get("email", ""),
        },
    }

    # Load the tier-specific snapshot so the sub-account is pre-configured
    # for exactly what was purchased (workflows, pipelines, automations, funnels)
    snapshot_env_key = (client.get("plan_config") or {}).get("snapshot_env_key", "")
    snapshot_id = os.environ.get(snapshot_env_key, "") if snapshot_env_key else ""
    if snapshot_id:
        payload["snapshotId"] = snapshot_id
        logger.info(f"Using snapshot {snapshot_id} for {client.get('plan', 'Unknown')} plan")

    try:
        async with httpx.AsyncClient(timeout=15) as http:
            response = await http.post(
                f"{GHL_BASE_URL}/locations/",
                headers=GHL_AGENCY_HEADERS,
                json=payload,
            )
            data = response.json()

            if response.status_code in (200, 201):
                location = data.get("location", {})
                loc_id = location.get("id", "")
                logger.info(f"GHL sub-account created: {loc_id} for '{business}'")
                return {"success": True, "id": loc_id, "name": business, "data": location}
            else:
                logger.error(f"GHL sub-account creation failed: {response.status_code} — {data}")
                return {"success": False, "error": str(data)}

    except Exception as e:
        logger.error(f"GHL create_subaccount exception: {e}")
        return {"success": False, "error": str(e)}


def _extract_area_code(phone: str, fallback: str = "410") -> str:
    """Pull 3-digit area code from a US phone number string."""
    digits = re.sub(r"\D", "", phone or "")
    if digits.startswith("1") and len(digits) == 11:
        return digits[1:4]
    if len(digits) >= 10:
        return digits[:3]
    return fallback  # Baltimore default


async def provision_phone_number(sub_location_id: str, area_code: str) -> dict:
    """
    Search for an available local number and purchase it for a client sub-account.
    Uses the Agency API key so it can act on the newly created sub-account.
    """
    if not sub_location_id:
        return {"success": False, "error": "No sub_location_id provided"}

    try:
        async with httpx.AsyncClient(timeout=15) as http:
            # Step 1 — search for available numbers in the client's area code
            search = await http.get(
                f"{GHL_BASE_URL}/phone-number/search",
                headers=GHL_AGENCY_HEADERS,
                params={
                    "locationId": sub_location_id,
                    "areaCode": area_code,
                    "type": "local",
                    "limit": 5,
                },
            )
            search_data = search.json()

            if search.status_code not in (200, 201):
                logger.error(f"Phone search failed: {search.status_code} — {search_data}")
                return {"success": False, "error": f"Search failed: {search_data}"}

            # GHL returns either availableNumbers or numbers depending on API version
            available = (
                search_data.get("availableNumbers")
                or search_data.get("numbers")
                or []
            )
            if not available:
                logger.warning(f"No numbers available for area code {area_code}")
                return {"success": False, "error": f"No numbers available for area code {area_code}"}

            # Pick the first result
            number = (
                available[0].get("phoneNumber")
                or available[0].get("number")
                or available[0].get("friendlyName")
            )

            # Step 2 — purchase it
            purchase = await http.post(
                f"{GHL_BASE_URL}/phone-number/purchase",
                headers=GHL_AGENCY_HEADERS,
                json={"locationId": sub_location_id, "phoneNumber": number},
            )
            purchase_data = purchase.json()

            if purchase.status_code in (200, 201):
                logger.info(f"Phone provisioned: {number} for location {sub_location_id}")
                return {"success": True, "number": number, "data": purchase_data}
            else:
                logger.error(f"Phone purchase failed: {purchase.status_code} — {purchase_data}")
                return {"success": False, "error": str(purchase_data)}

    except Exception as e:
        logger.error(f"provision_phone_number exception: {e}")
        return {"success": False, "error": str(e)}


async def send_welcome_email(contact_id: str, client: dict) -> dict:
    """
    Send a welcome email to a new paying client via GHL conversations.
    """
    if not contact_id:
        return {"success": False, "error": "No contact_id provided"}

    first = client.get("first_name", "there")
    plan = client.get("plan", "Starter")
    email = client.get("email", "")
    config = client.get("plan_config", {})
    includes = config.get("includes", [])
    aria_style = config.get("aria_style", "basic")

    subject = f"Welcome to The Groove Media, {first}! 🎉 Here's what happens next"

    # Build what's-included list for the email
    includes_html = "".join(f"<li>{item}</li>" for item in includes)

    # Aria note — varies by tier
    aria_notes = {
        "basic": "Your AI receptionist will be set up to answer missed calls automatically and send a text-back within 90 seconds.",
        "custom": "Your AI receptionist will be configured with a custom script tailored to your business — we'll share it with you before going live.",
        "full_persona": "Your AI Voice Agent will have a full persona built around your brand — name, tone, and a complete call handling script. We'll walk you through it on your onboarding call.",
    }
    aria_note = aria_notes.get(aria_style, aria_notes["basic"])

    body = f"""<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
  <h2 style="color:#6c47ff;">Hey {first}, welcome aboard! 🎉</h2>

  <p>You're officially on the <strong>{plan} Plan</strong> with The Groove Media. Here's everything that's included and what happens next.</p>

  <h3>Your {plan} Plan includes:</h3>
  <ul style="line-height:1.8;">{includes_html}</ul>

  <h3>What happens next:</h3>
  <ol>
    <li><strong>Your dedicated account is being set up</strong> — your local phone number and automations are being configured right now.</li>
    <li><strong>AI Receptionist:</strong> {aria_note}</li>
    <li><strong>Website:</strong> Your professional website is included in your setup. We'll be in touch within 2 business days to gather your content and get it built.</li>
    <li><strong>Google Business Profile:</strong> You'll receive a separate email from us asking for Manager access to your GBP. Accepting takes 2 minutes and lets us start optimizing your listing right away.</li>
    <li><strong>Onboarding call:</strong> We'll reach out within 1 business day to schedule a quick 20-minute call to get everything dialed in.</li>
  </ol>

  <p>Questions? Just reply to this email — I personally read every one.</p>

  <p style="margin-top:32px;">Talk soon,<br>
  <strong>Stephen Butler</strong><br>
  The Groove Media<br>
  <a href="https://thegroovemedia.com" style="color:#6c47ff;">thegroovemedia.com</a></p>
</div>"""

    payload = {
        "type": "Email",
        "contactId": contact_id,
        "locationId": GHL_LOCATION_ID,
        "emailFrom": "stephen@thegroovemedia.com",
        "emailFromName": "Stephen Butler | The Groove Media",
        "emailTo": email,
        "subject": subject,
        "body": body,
        "html": body,
    }

    try:
        async with httpx.AsyncClient(timeout=10) as http:
            response = await http.post(
                f"{GHL_BASE_URL}/conversations/messages",
                headers=GHL_HEADERS,
                json=payload,
            )
            data = response.json()

            if response.status_code in (200, 201):
                logger.info(f"Welcome email sent to {email}")
                return {"success": True, "id": data.get("id", "")}
            else:
                logger.error(f"Welcome email failed: {response.status_code} — {data}")
                return {"success": False, "error": str(data)}

    except Exception as e:
        logger.error(f"send_welcome_email exception: {e}")
        return {"success": False, "error": str(e)}


async def send_gbp_access_request(contact_id: str, client: dict) -> dict:
    """
    Send an email asking the client to grant Google Business Profile Manager access.
    """
    if not contact_id:
        return {"success": False, "error": "No contact_id provided"}

    first = client.get("first_name", "there")
    email = client.get("email", "")
    gbp_url = client.get("gbp_url", "")

    subject = f"Action needed: Grant us access to your Google Business Profile"

    gbp_note = (
        f'<p>We found your listing here: <a href="{gbp_url}" style="color:#6c47ff;">{gbp_url}</a></p>'
        if gbp_url else ""
    )

    body = f"""<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
  <h2 style="color:#6c47ff;">One quick step from you, {first}</h2>

  <p>To start optimizing your Google Business Profile, we need Manager access to your listing. This takes about 2 minutes.</p>

  {gbp_note}

  <h3>Here's how to add us:</h3>
  <ol>
    <li>Go to <a href="https://business.google.com" style="color:#6c47ff;">business.google.com</a> and sign in</li>
    <li>Click your business listing</li>
    <li>Go to <strong>Business Profile Settings → Managers</strong></li>
    <li>Click <strong>Add</strong> and enter: <strong>stephen@thegroovemedia.com</strong></li>
    <li>Set the role to <strong>Manager</strong> and click <strong>Invite</strong></li>
  </ol>

  <p>That's it! Once you've done that, we'll get started on your profile right away.</p>

  <p>Any trouble? Just reply here and I'll walk you through it.</p>

  <p style="margin-top:32px;">Thanks,<br>
  <strong>Stephen Butler</strong><br>
  The Groove Media<br>
  <a href="https://thegroovemedia.com" style="color:#6c47ff;">thegroovemedia.com</a></p>
</div>"""

    payload = {
        "type": "Email",
        "contactId": contact_id,
        "locationId": GHL_LOCATION_ID,
        "emailFrom": "stephen@thegroovemedia.com",
        "emailFromName": "Stephen Butler | The Groove Media",
        "emailTo": email,
        "subject": subject,
        "body": body,
        "html": body,
    }

    try:
        async with httpx.AsyncClient(timeout=10) as http:
            response = await http.post(
                f"{GHL_BASE_URL}/conversations/messages",
                headers=GHL_HEADERS,
                json=payload,
            )
            data = response.json()

            if response.status_code in (200, 201):
                logger.info(f"GBP access request sent to {email}")
                return {"success": True, "id": data.get("id", "")}
            else:
                logger.error(f"GBP request email failed: {response.status_code} — {data}")
                return {"success": False, "error": str(data)}

    except Exception as e:
        logger.error(f"send_gbp_access_request exception: {e}")
        return {"success": False, "error": str(e)}
