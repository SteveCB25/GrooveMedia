"""
Vercel serverless entry point for the Groove Media FastAPI backend.
All /api/* requests are routed here via vercel.json rewrites.
"""

import sys
import os

# Make the backend package importable from this directory
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from server import app  # noqa: F401 — Vercel picks up `app` as the ASGI handler
