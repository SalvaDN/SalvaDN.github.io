#!/usr/bin/env python3
"""Genera js/posts.js leyendo las páginas de retos/, proyectos/ y estudios/.

Cada página declara sus datos con etiquetas <meta name="post:..."> en el <head>.
Se ejecuta solo en GitHub Actions cada vez que subes algo, pero también
puedes lanzarlo en local:  python3 py/build-posts.py
"""
import html
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CARPETAS = {"retos": "Reto", "proyectos": "Proyecto", "estudios": "Estudio"}
META = re.compile(r'<meta\s+name="post:([a-z]+)"\s+content="([^"]*)"\s*/?>', re.I)
FECHA = re.compile(r"^\d{4}-\d{2}-\d{2}$")
OPCIONALES = ["plataforma", "dificultad", "os", "puntos", "estado", "icono", "imagen"]


def aviso(msg):
    print(f"::warning::{msg}")


def leer(ruta, carpeta):
    texto = ruta.read_text(encoding="utf-8")
    d = {k.lower(): html.unescape(v).strip() for k, v in META.findall(texto)}

    if d.get("borrador", "").lower() in ("si", "sí", "true", "1"):
        print(f"  borrador, se omite: {ruta.name}")
        return None

    faltan = [c for c in ("titulo", "fecha", "resumen") if not d.get(c)]
    if faltan:
        aviso(f"{carpeta}/{ruta.name}: faltan {', '.join(faltan)}; no aparece en la portada")
        return None
    if not FECHA.match(d["fecha"]):
        aviso(f"{carpeta}/{ruta.name}: la fecha debe ser AAAA-MM-DD (tiene '{d['fecha']}')")
        return None

    post = {
        "titulo": d["titulo"],
        "tipo": d.get("tipo") or CARPETAS[carpeta],
        "fecha": d["fecha"],
        "url": f"{carpeta}/{ruta.name}",
        "resumen": d["resumen"],
        "tags": [t.strip() for t in d.get("tags", "").split(",") if t.strip()],
    }
    for campo in OPCIONALES:
        if d.get(campo):
            post[campo] = int(d[campo]) if campo == "puntos" and d[campo].isdigit() else d[campo]
    return post


def main():
    posts = []
    for carpeta in CARPETAS:
        base = RAIZ / carpeta
        if not base.is_dir():
            continue
        for ruta in sorted(base.glob("*.html")):
            if ruta.name.lower().startswith("plantilla"):
                continue
            p = leer(ruta, carpeta)
            if p:
                posts.append(p)

    posts.sort(key=lambda p: p["fecha"], reverse=True)
    salida = (
        "/* ARCHIVO GENERADO AUTOMÁTICAMENTE por py/build-posts.py.\n"
        "   No lo edites: los datos salen de las etiquetas <meta name=\"post:...\"> de cada página. */\n"
        "const posts = " + json.dumps(posts, ensure_ascii=False, indent=2) + ";\n"
    )
    (RAIZ / "js").mkdir(exist_ok=True)
    (RAIZ / "js" / "posts.js").write_text(salida, encoding="utf-8")
    print(f"posts.js generado con {len(posts)} publicaciones")


if __name__ == "__main__":
    sys.exit(main())

