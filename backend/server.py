from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import asyncio
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 8  # 8h
REFRESH_TOKEN_DAYS = 7

# Resend
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
NOTIFICATION_EMAIL = os.environ.get("NOTIFICATION_EMAIL", "")
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI(title="Hardtek API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    service: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=3000)


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    service: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminUser(BaseModel):
    id: str
    email: str
    name: str
    role: str


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_DAYS),
        "type": "refresh",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=ACCESS_TOKEN_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=REFRESH_TOKEN_DAYS * 24 * 3600,
        path="/",
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.admin_users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Hardtek API is running"}


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(payload: ContactMessageCreate):
    obj = ContactMessage(
        name=payload.name.strip(),
        email=payload.email.strip(),
        service=(payload.service or "").strip() or None,
        message=payload.message.strip(),
    )
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)

    # Fire-and-forget email notification (do not break form if it fails)
    asyncio.create_task(_notify_new_contact(obj))

    return obj


async def _notify_new_contact(msg: ContactMessage) -> None:
    if not RESEND_API_KEY or not NOTIFICATION_EMAIL:
        return
    try:
        service_line = msg.service or "Non précisé"
        safe_message = (msg.message or "").replace("\n", "<br>")
        html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#0d0907; padding:32px; color:#faf4ec;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px; margin:0 auto; background:#18120e; border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden;">
            <tr>
              <td style="padding:24px 28px; background:linear-gradient(135deg,#ea580c,#f97316); color:#ffffff;">
                <div style="font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:700; opacity:0.85;">Hardtek · Nouveau message</div>
                <div style="font-size:22px; font-weight:800; margin-top:4px;">{msg.name}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px; color:#d4d4d8;">
                  <tr><td style="padding:6px 0; color:#a1a1aa; width:110px;">Email</td><td><a href="mailto:{msg.email}" style="color:#fb923c; text-decoration:none;">{msg.email}</a></td></tr>
                  <tr><td style="padding:6px 0; color:#a1a1aa;">Service</td><td style="color:#fafafa;">{service_line}</td></tr>
                  <tr><td style="padding:6px 0; color:#a1a1aa; vertical-align:top;">Reçu le</td><td style="color:#fafafa;">{msg.created_at.strftime('%d/%m/%Y %H:%M UTC')}</td></tr>
                </table>
                <div style="margin-top:18px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.08);">
                  <div style="font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#a1a1aa; font-weight:700;">Message</div>
                  <div style="margin-top:10px; font-size:14px; line-height:1.6; color:#fafafa; white-space:pre-wrap;">{safe_message}</div>
                </div>
                <div style="margin-top:24px;">
                  <a href="mailto:{msg.email}" style="display:inline-block; background:#ea580c; color:#fff; padding:10px 18px; border-radius:999px; text-decoration:none; font-weight:600; font-size:13px;">Répondre à {msg.name}</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 28px; background:#0d0907; color:#71717a; font-size:11px; text-align:center;">
                Envoyé automatiquement depuis le site Hardtek — Rue des Terreaux 11, 1350 Orbe
              </td>
            </tr>
          </table>
        </div>
        """
        params = {
            "from": f"Hardtek Site <{SENDER_EMAIL}>",
            "to": [NOTIFICATION_EMAIL],
            "reply_to": msg.email,
            "subject": f"[Hardtek] Nouveau message de {msg.name}",
            "html": html,
        }
        email = await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Resend notification sent for contact {msg.id}: {email}")
    except Exception as e:
        logging.error(f"Failed to send notification email: {e}")


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact_messages(_: dict = Depends(get_current_admin)):
    items = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for it in items:
        if isinstance(it.get('created_at'), str):
            try:
                it['created_at'] = datetime.fromisoformat(it['created_at'])
            except Exception:
                it['created_at'] = datetime.now(timezone.utc)
    return items


@api_router.delete("/contact/{message_id}")
async def delete_contact_message(message_id: str, _: dict = Depends(get_current_admin)):
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"ok": True, "deleted_id": message_id}


# ---------- Auth routes ----------
@api_router.post("/auth/login", response_model=AdminUser)
async def login(payload: LoginRequest, response: Response):
    email = payload.email.strip().lower()
    user = await db.admin_users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Identifiants invalides")

    access_token = create_access_token(user["id"], user["email"])
    refresh_token = create_refresh_token(user["id"])
    set_auth_cookies(response, access_token, refresh_token)

    return AdminUser(
        id=user["id"],
        email=user["email"],
        name=user.get("name", "Admin"),
        role=user.get("role", "admin"),
    )


@api_router.post("/auth/logout")
async def logout(response: Response, _: dict = Depends(get_current_admin)):
    clear_auth_cookies(response)
    return {"ok": True}


@api_router.get("/auth/me", response_model=AdminUser)
async def me(user: dict = Depends(get_current_admin)):
    return AdminUser(
        id=user["id"],
        email=user["email"],
        name=user.get("name", "Admin"),
        role=user.get("role", "admin"),
    )


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")

    user = await db.admin_users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access = create_access_token(user["id"], user["email"])
    response.set_cookie(
        key="access_token",
        value=new_access,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=ACCESS_TOKEN_MINUTES * 60,
        path="/",
    )
    return {"ok": True}


# ---------- Startup ----------
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@hardtek.ch").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Hardtek2026!")
    existing = await db.admin_users.find_one({"email": admin_email})
    if existing is None:
        await db.admin_users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logging.info(f"Seeded admin {admin_email}")
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        await db.admin_users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logging.info(f"Rehashed admin password for {admin_email}")


@app.on_event("startup")
async def on_startup():
    await db.admin_users.create_index("email", unique=True)
    await db.contact_messages.create_index("created_at")
    await seed_admin()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
