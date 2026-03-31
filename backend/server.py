from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx
import stripe
from agents.onboarder import OnboarderAgent

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging first so it's available everywhere below
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection (optional — leads storage only; Stripe webhook works without it)
mongo_url = os.environ.get('MONGO_URL', '')
if mongo_url:
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'groovemedia')]
else:
    client = None
    db = None
    logger.warning("MONGO_URL not set — MongoDB disabled; leads will not be stored")

# Formspree configuration
FORMSPREE_FORM_ID = os.environ.get('FORMSPREE_FORM_ID', '')

# Stripe configuration
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', 'whsec_PXG4c3hja1OlxeLtq6TdB69SASZd3PKI')

# Create the main app
app = FastAPI(title="Groove Media API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============ Models ============

class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    business_name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=20)
    email: EmailStr
    website: Optional[str] = Field(None, max_length=200)
    service_type: str = Field(..., min_length=2, max_length=50)

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    business_name: str
    phone: str
    email: str
    website: Optional[str] = None
    service_type: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    source: str = "website"
    ip_address: Optional[str] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    message: str


# ============ Helper Functions ============

async def submit_to_formspree(form_data: dict):
    """Submit form data to Formspree in background"""
    if not FORMSPREE_FORM_ID:
        logger.warning("Formspree form ID not configured")
        return
    
    try:
        async with httpx.AsyncClient() as client:
            formspree_url = f"https://formspree.io/f/{FORMSPREE_FORM_ID}"
            headers = {"Accept": "application/json"}
            response = await client.post(formspree_url, data=form_data, headers=headers)
            response.raise_for_status()
            logger.info(f"Successfully submitted to Formspree: {response.status_code}")
    except Exception as e:
        logger.error(f"Error submitting to Formspree: {e}")


# ============ Routes ============

@api_router.get("/")
async def root():
    return {"message": "Groove Media API", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "formspree_configured": bool(FORMSPREE_FORM_ID)
    }


# ============ Lead Routes ============

@api_router.post("/leads", response_model=Lead)
async def create_lead(lead_data: LeadCreate, request: Request):
    """Create a new lead - stores in MongoDB and submits to Formspree"""
    try:
        # Get client IP
        ip_address = request.client.host if request.client else "unknown"
        
        # Create lead object
        lead = Lead(
            name=lead_data.name,
            business_name=lead_data.business_name,
            phone=lead_data.phone,
            email=lead_data.email,
            website=lead_data.website,
            service_type=lead_data.service_type,
            ip_address=ip_address
        )
        
        # Convert to dict for MongoDB
        doc = lead.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        # Store in MongoDB (if configured)
        if db is not None:
            await db.leads.insert_one(doc)
            logger.info(f"Lead stored in MongoDB: {lead.id}")
        else:
            logger.info(f"MongoDB not configured — lead {lead.id} not stored")
        
        # Submit to Formspree (async, don't block response)
        formspree_data = {
            "name": lead_data.name,
            "business_name": lead_data.business_name,
            "phone": lead_data.phone,
            "email": lead_data.email,
            "website": lead_data.website or "",
            "service_type": lead_data.service_type
        }
        await submit_to_formspree(formspree_data)
        
        return lead
        
    except Exception as e:
        logger.error(f"Error creating lead: {e}")
        raise HTTPException(status_code=500, detail="Error processing submission")

@api_router.get("/leads", response_model=List[Lead])
async def get_leads(skip: int = 0, limit: int = 100, search: Optional[str] = None):
    """Get all leads (for admin dashboard)"""
    try:
        query = {}
        if search:
            query = {
                "$or": [
                    {"name": {"$regex": search, "$options": "i"}},
                    {"business_name": {"$regex": search, "$options": "i"}},
                    {"email": {"$regex": search, "$options": "i"}}
                ]
            }
        
        if db is None:
            return []
        leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        
        # Convert ISO string timestamps back to datetime
        for lead in leads:
            if isinstance(lead.get('created_at'), str):
                lead['created_at'] = datetime.fromisoformat(lead['created_at'].replace('Z', '+00:00'))
        
        return leads
    except Exception as e:
        logger.error(f"Error fetching leads: {e}")
        raise HTTPException(status_code=500, detail="Error fetching leads")

@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str):
    """Delete a lead by ID"""
    try:
        if db is None:
            raise HTTPException(status_code=503, detail="Database not configured")
        result = await db.leads.delete_one({"id": lead_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Lead not found")
        return {"message": "Lead deleted successfully", "id": lead_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting lead: {e}")
        raise HTTPException(status_code=500, detail="Error deleting lead")

@api_router.get("/leads/count")
async def get_leads_count():
    """Get total leads count"""
    try:
        if db is None:
            return {"count": 0}
        count = await db.leads.count_documents({})
        return {"count": count}
    except Exception as e:
        logger.error(f"Error counting leads: {e}")
        raise HTTPException(status_code=500, detail="Error counting leads")


# ============ Stripe Webhook — Onboarder ============

@api_router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    """
    Receives Stripe events and triggers the OnboarderAgent.
    Verifies signature to ensure requests are genuinely from Stripe.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        logger.warning("Stripe webhook: invalid payload")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        logger.warning("Stripe webhook: invalid signature")
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        logger.info(f"Stripe checkout complete: {session.get('id')} — triggering Onboarder")
        agent = OnboarderAgent()
        # await directly — serverless functions don't persist background tasks
        await agent.run(session)

    return {"status": "received", "type": event["type"]}


# ============ Admin Auth (Simple for MVP) ============

ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'groovemedia2024')

@api_router.post("/admin/login", response_model=AdminResponse)
async def admin_login(credentials: AdminLogin):
    """Simple admin login - returns a basic token for MVP"""
    if credentials.username == ADMIN_USERNAME and credentials.password == ADMIN_PASSWORD:
        # Simple token for MVP (in production, use proper JWT)
        token = f"admin-{uuid.uuid4()}"
        return AdminResponse(success=True, token=token, message="Login successful")
    
    raise HTTPException(status_code=401, detail="Invalid credentials")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client is not None:
        client.close()
