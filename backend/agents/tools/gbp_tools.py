"""
GBP Tools — Google Business Profile post generation and publishing
Handles weekly content rotation and optional direct API posting.

Phase 1: Generate post → send to Telegram for manual posting (live now)
Phase 2: Direct GBP API posting (requires business.manage OAuth scope)
"""

import os
import logging
import httpx
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# ── GBP API config (Phase 2 — set in Vercel env vars when ready) ─────────────
GBP_ACCOUNT_ID  = os.environ.get("GBP_ACCOUNT_ID", "")   # e.g. accounts/123456789
GBP_LOCATION_ID = os.environ.get("GBP_LOCATION_ID", "")  # e.g. locations/987654321
GBP_ACCESS_TOKEN = os.environ.get("GBP_ACCESS_TOKEN", "") # OAuth access token

GBP_API_BASE = "https://mybusiness.googleapis.com/v4"

# ── 8-week post rotation ──────────────────────────────────────────────────────
# Covers 2 full months; repeats after week 8.
# Each entry: (topic_label, post_text, cta_type, cta_url)
# GBP post limit: 1500 characters. CTA types: LEARN_MORE, CALL, BOOK
POST_ROTATION = [
    (
        "Missed Calls = Lost Money",
        (
            "📞 Did you know the average contractor misses 3–5 calls a week?\n\n"
            "At $300–500 per job, that's thousands of dollars walking out the door every month "
            "— just because no one answered.\n\n"
            "We set up an AI receptionist that texts back every missed caller within 90 seconds. "
            "They stay warm. You don't lose the job.\n\n"
            "No contracts. Live in 7 days. Starts at $150/mo.\n\n"
            "👇 See how it works"
        ),
        "LEARN_MORE",
        "https://thegroovemedia.com",
    ),
    (
        "Google Business Profile Tip",
        (
            "📍 Quick GBP tip for contractors:\n\n"
            "Listings with 10+ photos get 42% more direction requests and 35% more website clicks "
            "than listings with fewer photos.\n\n"
            "If your Google listing has less than 10 photos, add these today:\n"
            "✅ Your logo\n"
            "✅ A photo of your truck or van\n"
            "✅ Before/after job photos\n"
            "✅ Your team at work\n\n"
            "GBP optimization is included in every Groove Media plan — we handle it for you."
        ),
        "LEARN_MORE",
        "https://thegroovemedia.com",
    ),
    (
        "Social Proof — Missed Call Stat",
        (
            "💰 One stat that changes how contractors think about marketing:\n\n"
            "The average contractor loses $126,000/year from missed calls and slow follow-up.\n\n"
            "Not from bad reviews. Not from no website. Just from not answering fast enough.\n\n"
            "Our system fixes that automatically — AI text-back in under 90 seconds, "
            "2-way SMS inbox, and a quote form so leads can reach you 24/7.\n\n"
            "Maryland contractors: see what's included 👇"
        ),
        "LEARN_MORE",
        "https://thegroovemedia.com",
    ),
    (
        "No Contracts Differentiator",
        (
            "🤝 We don't do long-term contracts. Here's why:\n\n"
            "Most marketing agencies lock you in for 6–12 months before you see a single result. "
            "That's backwards.\n\n"
            "At The Groove Media, you can cancel anytime. We keep clients by delivering results, "
            "not by making it painful to leave.\n\n"
            "Month 1: your system is live.\n"
            "Month 2: you're getting more leads.\n"
            "Month 3: you wonder why you waited.\n\n"
            "Plans start at $150/mo. No contracts. No risk."
        ),
        "LEARN_MORE",
        "https://thegroovemedia.com",
    ),
    (
        "Website Importance for Contractors",
        (
            "🌐 Contractors without a website lose jobs every day — here's proof:\n\n"
            "When a homeowner finds you on Google, 70% of them will visit your website before calling. "
            "If you don't have one, they call the next contractor on the list.\n\n"
            "Every Groove Media plan includes a professional website built for you — "
            "optimized for Google, fast on mobile, and designed to turn visitors into calls.\n\n"
            "Setup takes 7 days. You don't have to write a single word.\n\n"
            "👇 See what's included in your plan"
        ),
        "LEARN_MORE",
        "https://thegroovemedia.com",
    ),
    (
        "Review Automation Tip",
        (
            "⭐ The fastest way to rank higher on Google Maps:\n\n"
            "More reviews. Consistently.\n\n"
            "Contractors with 50+ reviews get 3x more profile views than those with under 10 — "
            "and Google's algorithm rewards businesses that collect reviews regularly, not all at once.\n\n"
            "Our Growth and Dominator plans include automated review requests. "
            "After every job, your customer gets a text asking for a review. "
            "Most people say yes when you ask at the right moment.\n\n"
            "Build your reputation on autopilot 👇"
        ),
        "LEARN_MORE",
        "https://thegroovemedia.com",
    ),
    (
        "FAQ — How the System Works",
        (
            "❓ Most common question we get from contractors:\n\n"
            "\"How does the missed call text-back actually work?\"\n\n"
            "Here's the short version:\n"
            "1️⃣ Someone calls you while you're on a job\n"
            "2️⃣ You miss the call\n"
            "3️⃣ Within 90 seconds, they get an automatic text:\n"
            "   \"Hey! Sorry I missed you — I'm with a client right now. "
            "What can I help you with?\"\n"
            "4️⃣ They reply, you get notified, you respond when you're free\n\n"
            "The caller stays engaged instead of calling your competitor.\n\n"
            "That's it. Simple, automated, and it works 24/7."
        ),
        "LEARN_MORE",
        "https://thegroovemedia.com",
    ),
    (
        "Local SEO Tip for Contractors",
        (
            "📊 Want to show up in the top 3 on Google Maps (the Local Pack)?\n\n"
            "Here are the 3 biggest ranking factors for contractors:\n\n"
            "1️⃣ Proximity — how close you are to the searcher\n"
            "2️⃣ Relevance — how well your GBP matches what they searched\n"
            "3️⃣ Prominence — reviews, website authority, and activity\n\n"
            "You can't control #1, but #2 and #3 are fully in your control.\n\n"
            "We handle both for Maryland contractors — GBP optimization, "
            "weekly posts, and review collection all included.\n\n"
            "👇 See our plans"
        ),
        "LEARN_MORE",
        "https://thegroovemedia.com",
    ),
]


def get_this_weeks_post() -> dict:
    """
    Returns the post for the current week based on ISO week number.
    Rotates through POST_ROTATION (8 weeks) then repeats.
    """
    week_num = datetime.now(timezone.utc).isocalendar()[1]
    index = (week_num - 1) % len(POST_ROTATION)
    topic, text, cta_type, cta_url = POST_ROTATION[index]

    return {
        "topic": topic,
        "text": text,
        "cta_type": cta_type,
        "cta_url": cta_url,
        "week": week_num,
        "rotation_index": index + 1,
        "total_rotations": len(POST_ROTATION),
    }


async def publish_to_gbp(post: dict) -> dict:
    """
    Publish a post directly to Google Business Profile via API.
    Requires GBP_ACCOUNT_ID, GBP_LOCATION_ID, and GBP_ACCESS_TOKEN env vars.
    Returns {"success": True/False, "posted": True/False, "reason": str}
    """
    if not all([GBP_ACCOUNT_ID, GBP_LOCATION_ID, GBP_ACCESS_TOKEN]):
        missing = [k for k, v in {
            "GBP_ACCOUNT_ID": GBP_ACCOUNT_ID,
            "GBP_LOCATION_ID": GBP_LOCATION_ID,
            "GBP_ACCESS_TOKEN": GBP_ACCESS_TOKEN,
        }.items() if not v]
        logger.info(f"GBP direct posting skipped — missing: {missing}")
        return {"success": False, "posted": False, "reason": f"Missing env vars: {missing}"}

    payload = {
        "languageCode": "en-US",
        "summary": post["text"],
        "callToAction": {
            "actionType": post.get("cta_type", "LEARN_MORE"),
            "url": post.get("cta_url", "https://thegroovemedia.com"),
        },
        "topicType": "STANDARD",
    }

    url = f"{GBP_API_BASE}/{GBP_ACCOUNT_ID}/{GBP_LOCATION_ID}/localPosts"
    headers = {
        "Authorization": f"Bearer {GBP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=15) as http:
            response = await http.post(url, headers=headers, json=payload)
            data = response.json()

            if response.status_code in (200, 201):
                logger.info(f"GBP post published: {data.get('name', '')}")
                return {"success": True, "posted": True, "id": data.get("name", "")}
            else:
                logger.error(f"GBP post failed: {response.status_code} — {data}")
                return {"success": False, "posted": False, "reason": str(data)}

    except Exception as e:
        logger.error(f"publish_to_gbp exception: {e}")
        return {"success": False, "posted": False, "reason": str(e)}
