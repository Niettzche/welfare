import json
import os
import re
import uuid
import requests
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from werkzeug.utils import secure_filename
from openai import OpenAI

from db import get_conn

load_dotenv()

app = Flask(__name__)
allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",") if o.strip()]
CORS(app, resources={r"/*": {"origins": allowed_origins if allowed_origins else "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# OpenAI Config
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

ALLOWED_DISCOUNTS = {"5%", "10%", "15%", "20%", "25%", "30%", "40%", "50%"}
ALLOWED_IMAGE_EXT = {"png", "jpg", "jpeg"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024
SKIP_DB_WRITE = os.getenv("SKIP_DB_WRITE", "").lower() in {"1", "true", "yes"}

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


def strip_html(text: str) -> str:
    return re.sub(r"<[^>]*>", "", text or "")


def sanitize_text(text: str, max_len: int = 255) -> str:
    cleaned = strip_html(text)
    cleaned = re.sub(r'[^\w\s.,;:!?\'"()-]', "", cleaned, flags=re.UNICODE)
    return cleaned.strip()[:max_len]


def validate_email(email: str) -> bool:
    return bool(re.match(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", email or ""))

def validate_phone(phone: str) -> bool:
    return bool(re.match(r"^[0-9+()\s-]{7,20}$", phone or ""))

def validate_discount(discount: str) -> bool:
    return discount in ALLOWED_DISCOUNTS

def validate_website(url: str) -> bool:
    if not url:
        return True
    return bool(re.match(r"^https?://", url))

def build_public_url(filename: str) -> str:
    host = request.host_url.rstrip("/")
    return f"{host}/uploads/{filename}"

def mock_businesses():
    now = datetime.utcnow().isoformat()
    return [
        {
            "id": str(uuid.uuid4()),
            "surname": "MasterCreators",
            "email": "contacto@mastercreators.work",
            "show_email": True,
            "phone": "+1 000 000 0000",
            "show_phone": False,
            "business_name": "Master Creators",
            "category": "Professional Services",
            "discount": "20%",
            "description": "Desarrollo de software, diseño y automatización para comunidades y negocios. Soluciones a medida para tu proyecto.",
            "website": "https://mastercreators.work/",
            "logo_url": None,
            "tags": json.dumps(["Development", "Design", "Automation"]),
            "status": "approved",
            "created_at": now,
            "updated_at": now,
        },
        {
            "id": str(uuid.uuid4()),
            "surname": "Familia López",
            "email": "hola@greenleaf.example",
            "show_email": False,
            "phone": "+1 555 222 3333",
            "show_phone": True,
            "business_name": "GreenLeaf Market",
            "category": "Retail & Shopping",
            "discount": "10%",
            "description": "Productos orgánicos, frutas y verduras frescas, y artículos eco-friendly para el hogar.",
            "website": "https://greenleaf.example",
            "logo_url": None,
            "tags": json.dumps(["Organic", "Local", "Eco-friendly"]),
            "status": "approved",
            "created_at": now,
            "updated_at": now,
        },
    ]

# Helper for videos
def fetch_oembed_data(url: str):
    if not url: return None
    if "youtube.com" not in url and "youtu.be" not in url:
        return {"title": "External Video", "thumbnail_url": None}
    try:
        res = requests.get(f"https://noembed.com/embed?url={url}", timeout=5)
        if res.status_code == 200:
            d = res.json()
            return {"title": d.get("title", "Untitled"), "thumbnail_url": d.get("thumbnail_url")}
    except Exception as e:
        print(f"OEmbed Error: {e}")
    return {"title": "Untitled Video", "thumbnail_url": None}


# --- AI & KNOWLEDGE BASE LOGIC ---

def build_knowledge_base():
    """
    Convierte la base de datos SQL en un contexto de texto 'digerible' para OpenAI.
    """
    if SKIP_DB_WRITE:
        businesses = mock_businesses()
    else:
        try:
            with get_conn() as conn:
                with conn.cursor() as cur:
                    # Solo obtenemos lo necesario para ahorrar tokens
                    cur.execute("""
                        SELECT business_name, category, description, discount, email, phone, website 
                        FROM businesses 
                        WHERE status != 'rejected'
                    """)
                    businesses = cur.fetchall()
        except Exception:
            # Fallback a mock si la DB falla
            businesses = mock_businesses()

    context_text = "Directorio de Negocios de Welfare School:\n\n"
    for b in businesses:
        # Si es un dict (mock) o row (real db), manejamos ambos
        name = b.get('business_name') if isinstance(b, dict) else b['business_name']
        cat = b.get('category') if isinstance(b, dict) else b['category']
        desc = b.get('description') if isinstance(b, dict) else b['description']
        disc = b.get('discount') if isinstance(b, dict) else b['discount']
        
        context_text += f"- **{name}** ({cat}): {desc}. [Descuento: {disc}]\n"
    
    return context_text

@socketio.on('chat_message')
def handle_chat(data):
    user_query = data.get('message', '')
    
    if not user_query:
        return

    try:
        # 1. Construir el contexto (La base de conocimientos)
        knowledge_context = build_knowledge_base()

        # 2. Configurar el Prompt del Sistema
        system_prompt = f"""
        Eres 'Welfare AI', un asistente útil para la comunidad de Welfare School.
        
        TU BASE DE CONOCIMIENTOS:
        {knowledge_context}

        INSTRUCCIONES:
        1. Responde solo basándote en la lista de negocios anterior.
        2. Si te preguntan por un servicio (ej. "dentista"), busca en la lista y recomienda las opciones disponibles.
        3. Sé amable, conciso y profesional.
        4. Si no encuentras información en la lista, di que no hay negocios registrados en esa categoría aún.
        """

        # 3. Llamar a OpenAI
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo", # O gpt-4-turbo si prefieres
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            temperature=0.7,
            max_tokens=300
        )

        ai_reply = response.choices[0].message.content

        # 4. Enviar respuesta al cliente
        emit('chat_response', {'message': ai_reply})

    except Exception as e:
        print(f"Error en AI Socket: {e}")
        emit('chat_response', {'message': "Lo siento, tuve un problema procesando tu solicitud. Por favor intenta de nuevo."})


# --- ROUTES ---

@app.route("/ai/optimize", methods=["POST"])
def optimize_profile():
    data = request.get_json(silent=True) or {}
    description = data.get("description", "")
    category = data.get("category", "General")
    name = data.get("business_name", "A business")

    if not description:
        return jsonify({"error": "Description is required"}), 400

    try:
        system_prompt = """
        You are an expert copywriter for a community business directory. 
        Your task is to improve a business description to be more professional, engaging, and trustworthy.
        Keep the description concise (max 450 characters).
        Also generate 3-5 relevant short tags.
        
        Output strictly valid JSON with this format:
        {
            "optimizedDescription": "The improved text...",
            "tags": ["Tag1", "Tag2", "Tag3"]
        }
        """

        user_prompt = f"Business Name: {name}\nCategory: {category}\nDraft Description: {description}"

        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=400
        )

        content = response.choices[0].message.content
        # Clean potential markdown code blocks if GPT adds them
        content = content.replace("```json", "").replace("```", "").strip()
        
        result = json.loads(content)
        return jsonify(result), 200

    except Exception as e:
        print(f"AI Error: {e}")
        # Fallback if AI fails
        return jsonify({
            "optimizedDescription": description, 
            "tags": [category, "Community"]
        }), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/videos", methods=["GET"])
def list_videos():
    if SKIP_DB_WRITE: return jsonify([]), 200
    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, url, title, thumbnail_url FROM videos ORDER BY created_at DESC")
                rows = cur.fetchall()
        return jsonify([{"id": r["id"], "url": r["url"], "title": r["title"], "thumbnail": r["thumbnail_url"]} for r in rows]), 200
    except Exception:
        return jsonify([]), 200


@app.route("/videos", methods=["POST"])
def add_video():
    data = request.get_json(silent=True) or {}
    url = data.get("url", "").strip()
    if not url: return jsonify({"error": "URL required"}), 400
    
    meta = fetch_oembed_data(url)
    if SKIP_DB_WRITE: return jsonify({"id": 999, "url": url, "title": meta.get("title"), "thumbnail": meta.get("thumbnail_url")}), 201

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO videos (url, title, thumbnail_url) VALUES (%s, %s, %s) RETURNING id",
                (url, meta.get("title"), meta.get("thumbnail_url"))
            )
            new_id = cur.fetchone()["id"]
            
    return jsonify({"id": new_id, "url": url, "title": meta.get("title"), "thumbnail": meta.get("thumbnail_url")}), 201


@app.route("/businesses", methods=["GET"])
def list_businesses():
    if SKIP_DB_WRITE:
        return jsonify(mock_businesses()), 200
    limit = min(int(request.args.get("limit", 50)), 200)
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, surname, email, show_email, phone, show_phone,
                       business_name, category, discount, description, website,
                       logo_url, tags, status, created_at, updated_at
                FROM businesses
                ORDER BY created_at DESC
                LIMIT %s
                """,
                (limit,),
            )
            rows = cur.fetchall()
    return jsonify(rows), 200


@app.route("/businesses", methods=["POST"])
def create_business():
    data = request.get_json(silent=True) or {}

    required_fields = ["surname", "email", "phone", "business_name", "category", "discount", "description"]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    surname = sanitize_text(data.get("surname"), 120)
    business_name = sanitize_text(data.get("business_name"), 160)
    category = sanitize_text(data.get("category"), 120)
    discount = data.get("discount", "")
    description = sanitize_text(data.get("description"), 500)
    website = strip_html(data.get("website", "")).strip()
    email = strip_html(data.get("email", "")).replace(" ", "").lower()
    phone = strip_html(data.get("phone", ""))
    show_email = bool(data.get("show_email"))
    show_phone = bool(data.get("show_phone"))
    logo_url = strip_html(data.get("logo_url", "")).strip() or None

    tags = data.get("tags", [])
    if not isinstance(tags, list):
        return jsonify({"error": "tags must be an array"}), 400
    cleaned_tags = [sanitize_text(str(tag), 40) for tag in tags if sanitize_text(str(tag), 40)]
    tags_json = json.dumps(cleaned_tags) if cleaned_tags else None

    if not validate_email(email):
        return jsonify({"error": "Invalid email format"}), 400
    if not validate_phone(phone):
        return jsonify({"error": "Invalid phone format"}), 400
    if not validate_discount(discount):
        return jsonify({"error": "Invalid discount option"}), 400
    if not validate_website(website):
        return jsonify({"error": "Website must start with http:// or https://"}), 400

    business_id = str(uuid.uuid4())

    if SKIP_DB_WRITE:
        return jsonify({"id": business_id, "status": "pending", "note": "DB write skipped (dev mode)"}), 200

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO businesses (
                    id, surname, email, show_email, phone, show_phone,
                    business_name, category, discount, description, website,
                    logo_url, tags, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending')
                """,
                (
                    business_id,
                    surname,
                    email,
                    show_email,
                    phone,
                    show_phone,
                    business_name,
                    category,
                    discount,
                    description,
                    website or None,
                    logo_url,
                    tags_json,
                ),
            )
    return jsonify({"id": business_id, "status": "pending"}), 201


@app.route("/upload-logo", methods=["POST"])
def upload_logo():
    file = request.files.get("logo")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = secure_filename(file.filename or "")
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_IMAGE_EXT:
        return jsonify({"error": "Only PNG and JPG files are allowed"}), 400

    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > MAX_IMAGE_BYTES:
        return jsonify({"error": "File too large (max 5MB)"}), 400

    safe_name = f"{uuid.uuid4()}.{ext}"
    dest = UPLOAD_DIR / safe_name
    file.save(dest)

    return jsonify({"logo_url": build_public_url(safe_name)}), 201


@app.route("/uploads/<path:filename>", methods=["GET"])
def serve_upload(filename):
    return send_from_directory(UPLOAD_DIR, filename)


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5001"))
    is_debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    socketio.run(app, host="0.0.0.0", port=port, debug=is_debug)