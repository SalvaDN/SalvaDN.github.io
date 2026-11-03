#!/usr/bin/env python3
"""Genera js/posts.js (y opcionalmente sitemap.xml) leyendo las páginas de
retos/, proyectos/ y estudios/.
 
Cada página declara sus datos con etiquetas <meta name="post:..."> en el <head>.
Se ejecuta solo en GitHub Actions cada vez que subes algo, pero también
puedes lanzarlo en local:  python py/build-posts.py
"""
import json
import re
import sys
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote
from xml.sax.saxutils import escape
 
RAIZ = Path(__file__).resolve().parent.parent
BASE_URL = "https://salvadn.github.io"
GENERAR_SITEMAP = False   # False = no se crea sitemap.xml (la web no quiere ser indexada). Pon True para activarlo.
PAGINAS_FIJAS = ["", "sobremi/sobremi.html"]   # portada y Sobre mí (solo si existen)
CARPETAS = {"retos": "Reto", "proyectos": "Proyecto", "estudios": "Estudio"}
FECHA = re.compile(r"^\d{4}-\d{2}-\d{2}$")
OPCIONALES = ["plataforma", "dificultad", "os", "puntos", "estado", "icono", "imagen"]
 
 
class _Metas(HTMLParser):
    """Lee las etiquetas <meta name="post:..."> reales (los comentarios se ignoran)."""
 
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.datos = {}
 
    def handle_starttag(self, tag, attrs):
        if tag != "meta":
            return
        a = {k.lower(): (v or "") for k, v in attrs}
        nombre = a.get("name", "").strip()
        if nombre.lower().startswith("post:"):
            self.datos[nombre[5:].lower()] = a.get("content", "").strip()
 
 
def aviso(msg):
    print(f"::warning::{msg}")
 
 
def leer(ruta, carpeta):
    lector = _Metas()
    lector.feed(ruta.read_text(encoding="utf-8"))
    d = lector.datos
 
    if d.get("borrador", "").lower() in ("si", "sí", "true", "1"):
        print(f"  borrador, se omite: {carpeta}/{ruta.name}")
        return None
 
    faltan = [c for c in ("titulo", "fecha", "resumen") if not d.get(c)]
    if faltan:
        aviso(f"{carpeta}/{ruta.name}: faltan {', '.join(faltan)}; no aparece en la portada")
        return None
    try:
        if not FECHA.match(d["fecha"]):
            raise ValueError
        date.fromisoformat(d["fecha"])
    except ValueError:
        aviso(f"{carpeta}/{ruta.name}: la fecha debe ser una fecha real AAAA-MM-DD (tiene '{d['fecha']}')")
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
 
 
def escribir_sitemap(posts):
    """Genera sitemap.xml con la portada, Sobre mí y todas las publicaciones."""
    entradas = []
    for ruta in PAGINAS_FIJAS:
        if ruta == "" or (RAIZ / ruta).is_file():
            entradas.append((f"{BASE_URL}/{quote(ruta)}", None))
    for p in posts:
        entradas.append((f"{BASE_URL}/{quote(p['url'])}", p["fecha"]))
 
    lineas = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url, fecha in entradas:
        lineas.append("  <url>")
        lineas.append(f"    <loc>{escape(url)}</loc>")
        if fecha:
            lineas.append(f"    <lastmod>{fecha}</lastmod>")
        lineas.append("  </url>")
    lineas.append("</urlset>")
    (RAIZ / "sitemap.xml").write_text("\n".join(lineas) + "\n", encoding="utf-8")
    print(f"sitemap.xml generado con {len(entradas)} direcciones")
 
 
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
    if GENERAR_SITEMAP:
        escribir_sitemap(posts)
 
 
if __name__ == "__main__":
    sys.exit(main())
