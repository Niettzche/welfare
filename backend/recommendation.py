"""
recommendation_system.py
========================

This script demonstrates a simple recommendation pipeline designed to run on
very limited hardware (≈1 GB RAM, 1 CPU).  It synthesises a small dataset of
businesses, automatically derives tags from their descriptions, builds a
vector-based search index, and produces recommendations based on a user
query.  The goal is to emulate the kind of system described in the
conversation, without relying on large language models or external
services.  Instead, everything is implemented with lightweight Python
libraries (scikit‑learn) and simple heuristics.

The pipeline comprises four stages:

1. **Data preparation** – A handful of example businesses are defined in
   code.  Each business has a name, category, description, city and a
   discount.  These fields mimic the schema of the user's MariaDB table.

2. **Tag extraction** – A heuristic function scans each description for
   domain‑specific keywords and returns a list of normalised tags.  In a
   production setting this step would use a small LLM such as
   ``smollm2:360m`` via Ollama, but for this demo we avoid external
   dependencies by using simple pattern matching and accent removal.

3. **Vectorisation** – A ``TfidfVectorizer`` from scikit‑learn encodes
   each business's document (a concatenation of name, category, tags and
   description) into a TF‑IDF vector.  These vectors serve as a compact
   representation of the semantic content for similarity search.  Since
   our dataset is tiny, TF‑IDF is sufficient and very lightweight.

4. **Query handling** – When the user supplies a free‑text query, the
   system generates tags from the query (using the same heuristic),
   constructs a query vector with the trained vectoriser, and computes
   cosine similarities to all business vectors.  The top matches are
   returned as recommendations along with a short explanation based on
   overlapping tags.

To run this script and see the pipeline in action, execute it directly:

```
python recommendation_system.py --demo
```

It will print the available businesses, then prompt for a search query
and display recommendations.  You can also call it with
``--query "tu consulta"`` to avoid the prompt.  Finally, running it
without arguments will dump the dataset with extracted tags for
inspection.
"""

from __future__ import annotations

import argparse
import json
import unicodedata
from dataclasses import dataclass, field
from typing import List, Tuple, Dict

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---------------------------------------------------------------------------
# Data definitions
# ---------------------------------------------------------------------------

@dataclass
class Business:
    """Represents a single business entry."""

    id: str
    name: str
    category: str
    discount: str
    city: str
    description: str
    tags: List[str] = field(default_factory=list)

    @property
    def doc_text(self) -> str:
        """Build a single string representing the business for indexing."""
        tag_str = " ".join(self.tags)
        return f"{self.name} {self.category} {tag_str} {self.description}"


# ---------------------------------------------------------------------------
# Tag extraction logic
# ---------------------------------------------------------------------------

def normalise(text: str) -> str:
    """Convert text to lower case and strip accents and special characters."""
    text = text.lower()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    return text


def extract_tags(description: str) -> List[str]:
    """Extract a list of tags from the description using simple heuristics.

    This function searches for keywords defined in a static dictionary and
    returns normalised tags.  It is a stand‑in for a small language model
    used in production.  The returned tags are in kebab‑case (words joined
    by hyphens) and deduplicated.
    """
    text = normalise(description)
    tags: List[str] = []

    # Predefined keyword groups for different concepts
    TAG_PATTERNS: Dict[str, List[str]] = {
        "barberia": ["barberia", "peluqueria", "corte de cabello", "cabello", "corte de pelo", "pelo", "barba", "fade", "taper"],
        "cafe": ["cafe", "wifi", "postres", "trabajar", "tranquilo", "taza", "barista"],
        "restaurante": ["restaurante", "cocina", "comida", "menu", "chef"],
        "tacos": ["tacos", "pastor", "bistec", "gringas", "campesina"],
        "sushi": ["sushi", "rolls", "ramen", "japonesa"],
        "saludable": ["saludable", "vegano", "ensalada", "proteina", "light", "bowl"],
        "spa": ["spa", "masaje", "relajacion", "facial", "aromaterapia"],
        "reparacion": ["reparacion", "reparar", "celular", "laptop", "diagnostico", "garantia"],
        "gym": ["gym", "gimnasio", "pesas", "entrenamiento", "fuerza", "24 horas"],
        "farmacia": ["farmacia", "urgencia", "medicamento"],
        "entretenimiento": ["cine", "karaoke", "boliche", "entretenimiento", "diversion"],
        "panaderia": ["pan", "panaderia", "pan dulce", "horno"],
        "postres": ["postre", "helado", "malteada", "dulce"],
        "libreria": ["libreria", "libro", "papeleria", "estudio", "leer"],
        "servicios": ["servicio", "lavanderia", "para llevar", "express"],
        "barato": ["barato", "economico", "accesible", "promo", "descuento"],
        "cita": ["cita", "romantico", "pareja"],
        "tranquilo": ["tranquilo", "calmado", "relajado"],
        "rapido": ["rapido", "expres", "agil"]
    }

    for tag, patterns in TAG_PATTERNS.items():
        for pat in patterns:
            if pat in text:
                tags.append(tag)
                break

    # Deduplicate and normalise tags to kebab‑case
    unique_tags: List[str] = []
    seen: set[str] = set()
    for tag in tags:
        norm = tag.replace(" ", "-")
        if norm not in seen:
            seen.add(norm)
            unique_tags.append(norm)
    return unique_tags


# ---------------------------------------------------------------------------
# Recommendation engine
# ---------------------------------------------------------------------------

class Recommender:
    """A simple recommender using TF‑IDF vectors and cosine similarity."""

    def __init__(self, businesses: List[Business]) -> None:
        # Fit TF‑IDF on the documents
        self.vectoriser = TfidfVectorizer(stop_words=None)
        docs = [b.doc_text for b in businesses]
        self.matrix = self.vectoriser.fit_transform(docs)
        self.businesses = businesses

    def query(self, text: str, top_k: int = 3) -> List[Tuple[Business, float, List[str]]]:
        """Return top_k businesses for the given query text.

        The query is vectorised with the same TF‑IDF model.  Tags are
        extracted from the query for interpretability.  The return value
        includes the business, the cosine similarity score and the list of
        overlapping tags between the query and the business tags.
        """
        # Extract tags from the query
        query_tags = extract_tags(text)
        q_vec = self.vectoriser.transform([text])
        sims = cosine_similarity(q_vec, self.matrix).flatten()
        # Pair each business with its similarity
        results = list(enumerate(sims))
        # Sort by similarity descending
        results.sort(key=lambda x: x[1], reverse=True)
        top_results = results[:top_k]
        recommendations: List[Tuple[Business, float, List[str]]] = []
        for idx, score in top_results:
            biz = self.businesses[idx]
            overlap = sorted(set(query_tags) & set(biz.tags))
            recommendations.append((biz, float(score), overlap))
        return recommendations


# ---------------------------------------------------------------------------
# Example dataset
# ---------------------------------------------------------------------------

def build_example_dataset() -> List[Business]:
    """Construct a small dataset of example businesses."""
    examples = [
        Business(
            id="b001",
            name="Sushi Nami",
            category="sushi",
            discount="10%",
            city="Monterrey",
            description=(
                "Rolls clásicos y combos accesibles. Ambiente tranquilo y opciones para llevar. "
                "Ideal para una cita informal."
            ),
        ),
        Business(
            id="b002",
            name="Barbería Norte",
            category="barberia",
            discount="20%",
            city="Monterrey",
            description=(
                "Corte de cabello y arreglo de barba, con perfiles fade y taper. "
                "Atención rápida, cita por WhatsApp. Ambiente tranquilo y precios económicos."
            ),
        ),
        Business(
            id="b003",
            name="Café Nube",
            category="cafe",
            discount="5%",
            city="San Pedro",
            description=(
                "Café de especialidad con wifi, postres caseros y mesas cómodas. "
                "Perfecto para trabajar con laptop o platicar en pareja."
            ),
        ),
        Business(
            id="b004",
            name="Tacos El Güero",
            category="tacos",
            discount="15%",
            city="Guadalupe",
            description=(
                "Tacos al pastor y gringas con servicio rápido. Opciones baratas para cenar tarde."
            ),
        ),
        Business(
            id="b005",
            name="Spa Zen",
            category="spa",
            discount="30%",
            city="San Pedro",
            description=(
                "Masajes relajantes y faciales. Planes de pareja en un ambiente muy tranquilo. "
                "Reservación por WhatsApp."
            ),
        ),
        Business(
            id="b006",
            name="TechFix",
            category="reparacion",
            discount="25%",
            city="Apodaca",
            description=(
                "Reparación de celulares y laptops con diagnóstico rápido y garantía. "
                "Precios accesibles y servicio mismo día."
            ),
        ),
    ]
    # Generate tags for each business
    for b in examples:
        b.tags = extract_tags(b.description)
    return examples


# ---------------------------------------------------------------------------
# Command‑line interface
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Demo de sistema de recomendaciones.")
    parser.add_argument(
        "--demo", action="store_true", help="Ejecutar un demo interactivo con una consulta."
    )
    parser.add_argument(
        "--query", type=str, help="Ejecutar una consulta y mostrar recomendaciones."
    )
    args = parser.parse_args()

    businesses = build_example_dataset()
    rec = Recommender(businesses)

    if args.demo or args.query:
        query = args.query
        if not query:
            # Interactive prompt
            print("Lista de negocios disponibles:")
            for b in businesses:
                print(f"- {b.name} ({b.category}) – {b.city}")
            print()
            query = input("Ingresa tu consulta (por ejemplo: 'quiero sushi barato para una cita'): ")

        recommendations = rec.query(query, top_k=3)
        print()
        print(f"Recomendaciones para la consulta: '{query}'")
        for i, (biz, score, overlap) in enumerate(recommendations, 1):
            print(f"{i}. {biz.name} – {biz.city} (similitud={score:.3f})")
            if overlap:
                joined = ", ".join(overlap)
                print(f"   Razón: coincide en tags: {joined}")
            else:
                print(f"   Razón: coincide por contenido general de la descripción")
        print()
    else:
        # Non‑interactive mode prints the dataset with tags for inspection
        print("Businesses con tags extraídos:\n")
        for b in businesses:
            print(json.dumps({
                "id": b.id,
                "name": b.name,
                "category": b.category,
                "tags": b.tags,
                "description": b.description
            }, ensure_ascii=False, indent=2))
        print()


if __name__ == "__main__":
    main() 
