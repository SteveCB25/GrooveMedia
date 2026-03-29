"""
GHL Tools — GoHighLevel API calls for the Onboarder Agent
Location: GSk4D9ffTVB1SOqwLQcV (The Groove Media)
"""

import os
import logging
import httpx

logger = logging.getLogger(__name__)

GHL_API_KEY = os.environ.get("GHL_API_KEY", "pit-f7aaf747-e865-4697-9ba3-54dbcee4f449")
GHL_LOCATION_ID = os.environ.get("GHL_LOCATION_ID", "GSk4D9ffTVB1SOqwLQcV")
GHL_PIPELINE_ID = os.environ.get("GHL_PIPELINE_ID", "Ozi1ok3AstGt3U6V0xnY")
GHL_STAGE_ID = os.environ.get("GHL_STAGE_ID", "2d34b0e7-3237-4c31-86bf-c1fbc61f63ca")

GHL_BASE_URL = "https://services.leadconnectorhq.com"
GHL_HEADERS = {
    "Authorization": f"Bearer {GHL_API_KEY}",
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
