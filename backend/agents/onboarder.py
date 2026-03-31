"""
OnboarderAgent — Groove Media's client onboarding automation

Reasoning Loop:
  1. Analyze  — extract client data from Stripe event
  2. Decide   — determine which actions to run based on plan tier
  3. Execute  — call GHL and other tools
  4. Report   — notify Stephen via Telegram

Triggered by: POST /api/webhooks/stripe (checkout.session.completed)
"""

import logging
from agents.tools import ghl_tools, telegram_tools

logger = logging.getLogger(__name__)

# Plan detection by price (in dollars)
PLAN_MAP = [
    (500, "Dominator"),
    (350, "Growth"),
    (150, "Starter"),
]

# Per-plan feature config
# aria_style  — complexity hint passed to the welcome email & Telegram checklist
# includes    — human-readable feature list shown in Telegram and welcome email
# manual_steps — what Stephen still needs to do manually after automation
PLAN_CONFIG = {
    "Starter": {
        "aria_style": "basic",
        "includes": [
            "GBP optimization",
            "AI receptionist (Aria) — basic greeting",
            "Local phone number",
            "A2P registration",
        ],
        "website": None,
        "review_automation": False,
        "reporting": False,
        "manual_steps": [
            "Configure Aria basic greeting",
            "Submit A2P (use their Business Tax ID)",
            "Optimize GBP listing",
        ],
    },
    "Growth": {
        "aria_style": "custom",
        "includes": [
            "GBP optimization",
            "AI receptionist (Aria) — custom script",
            "Local phone number",
            "A2P registration",
            "1-page professional website",
            "Review automation",
        ],
        "website": "1-page",
        "review_automation": True,
        "reporting": False,
        "manual_steps": [
            "Configure Aria custom script",
            "Submit A2P (use their Business Tax ID)",
            "Build 1-page website",
            "Set up review automation workflow in GHL",
            "Optimize GBP listing",
        ],
    },
    "Dominator": {
        "aria_style": "full_persona",
        "includes": [
            "GBP optimization",
            "AI receptionist (Aria) — full persona",
            "Local phone number",
            "A2P registration",
            "Multi-page professional website",
            "Review automation",
            "Monthly reporting dashboard",
        ],
        "website": "multi-page",
        "review_automation": True,
        "reporting": True,
        "manual_steps": [
            "Configure Aria full persona",
            "Submit A2P (use their Business Tax ID)",
            "Build multi-page website",
            "Set up review automation workflow in GHL",
            "Configure monthly reporting dashboard",
            "Optimize GBP listing",
        ],
    },
}


class OnboarderAgent:

    # ── Step 1: Analyze ──────────────────────────────────────────────────────

    def analyze(self, session: dict) -> dict:
        """Extract structured client data from a Stripe checkout session."""

        amount = (session.get("amount_total") or 0) / 100

        # Determine plan tier by amount
        plan = "Starter"
        for threshold, name in PLAN_MAP:
            if amount >= threshold:
                plan = name
                break

        # Split full name into first/last
        full_name = (session.get("customer_details") or {}).get("name") or ""
        parts = full_name.strip().split(" ", 1)
        first_name = parts[0] if parts else "New"
        last_name = parts[1] if len(parts) > 1 else "Client"

        customer = session.get("customer_details") or {}

        client = {
            "first_name": first_name,
            "last_name": last_name,
            "email": customer.get("email", ""),
            "phone": customer.get("phone", ""),
            "plan": plan,
            "plan_config": PLAN_CONFIG.get(plan, PLAN_CONFIG["Starter"]),
            "amount": amount,
            "stripe_session_id": session.get("id", ""),
        }

        logger.info(f"Analyzed Stripe session: {client['email']} — {plan} (${amount})")
        return client

    # ── Step 2: Decide ───────────────────────────────────────────────────────

    def decide(self, client: dict) -> list:
        """
        Return the ordered list of actions. All tiers share the same
        automation steps — plan_config drives the content differences.
        """
        actions = [
            "create_ghl_subaccount",
            "provision_phone_number",
            "create_ghl_contact",
            "create_ghl_opportunity",
            "send_welcome_email",
            "send_gbp_access_request",
            "notify_telegram",
        ]
        logger.info(f"Decided actions for {client['plan']} plan: {actions}")
        return actions

    # ── Step 3: Execute ──────────────────────────────────────────────────────

    async def execute(self, actions: list, client: dict) -> dict:
        """Run each tool in sequence, collecting results."""
        results = {}

        if "create_ghl_subaccount" in actions:
            results["subaccount"] = await ghl_tools.create_subaccount(client)

        if "provision_phone_number" in actions:
            sub_location_id = results.get("subaccount", {}).get("id", "")
            area_code = ghl_tools._extract_area_code(client.get("phone", ""), fallback="410")
            results["phone"] = await ghl_tools.provision_phone_number(sub_location_id, area_code)

        if "create_ghl_contact" in actions:
            results["contact"] = await ghl_tools.create_contact(client)

        if "create_ghl_opportunity" in actions:
            contact_id = results.get("contact", {}).get("id", "")
            results["opportunity"] = await ghl_tools.create_opportunity(client, contact_id)

        if "send_welcome_email" in actions:
            contact_id = results.get("contact", {}).get("id", "")
            results["welcome_email"] = await ghl_tools.send_welcome_email(contact_id, client)

        if "send_gbp_access_request" in actions:
            contact_id = results.get("contact", {}).get("id", "")
            results["gbp_email"] = await ghl_tools.send_gbp_access_request(contact_id, client)

        return results

    # ── Step 4: Report ───────────────────────────────────────────────────────

    async def report(self, client: dict, results: dict) -> None:
        """Send Telegram notification with results and tier-specific checklist."""
        await telegram_tools.send_onboarding_alert(client, results)

    # ── Main Loop ────────────────────────────────────────────────────────────

    async def run(self, session: dict) -> None:
        """
        Full reasoning loop: Analyze → Decide → Execute → Report
        Called by the Stripe webhook handler in server.py
        """
        try:
            client = self.analyze(session)
            actions = self.decide(client)
            results = await self.execute(actions, client)
            await self.report(client, results)
            logger.info(f"Onboarding complete for {client['email']}")

        except Exception as e:
            logger.error(f"OnboarderAgent.run failed: {e}")
            await telegram_tools.send_error_alert(
                error=str(e),
                context=f"Session: {session.get('id', 'unknown')}"
            )
