Portfolio de Salva
Web personal donde publico writeups de retos de ciberseguridad (HackTheBox, TryHackMe, CTF), proyectos y apuntes de estudio. Está hecha a mano con HTML, CSS y JavaScript, sin frameworks, y se publica con GitHub Pages en https://salvadn.github.io.
Es un proyecto personal. Lo hice para aprender y para tener mis cosas ordenadas en un sitio.

La plantilla es de elaboración propia: el diseño, el código y el sistema de publicaciones están hechos desde cero, sin partir de ningún tema ni plantilla de terceros. Me inspiré en el aspecto de otros blogs de ciberseguridad, pero no copié su código, sus textos ni sus imágenes.

Cómo está organizado
```
index.html          Portada con "Últimos posts", filtros y paginación
css/style.css       Estilos de toda la web
js/main.js          Pinta la lista de publicaciones
js/posts.js         Lista de publicaciones (se genera sola, no se edita)
py/build-posts.py   Script que genera js/posts.js
retos/              Writeups de retos
proyectos/          Proyectos personales
estudios/           Apuntes y estudios
sobremi/            Página de perfil
img/                Imágenes
.github/workflows/  Despliegue automático
```

Cómo funciona
Cada página (un reto, un proyecto, un estudio) lleva sus datos en unas etiquetas `<meta name="post:...">` dentro del `<head>`: título, fecha, resumen, etiquetas, dificultad, etc.
Al hacer commit, GitHub Actions ejecuta `py/build-posts.py`, que lee esas etiquetas, genera `js/posts.js` y despliega la web. La portada lee esa lista, la ordena por fecha y la reparte en páginas de 5. El menú filtra por tipo (`?tipo=Reto`, `?tipo=Proyecto`, `?tipo=Estudio`).

Añadir una publicación
Copia `plantilla.html` de la carpeta que corresponda (`retos/`, `proyectos/` o `estudios/`) con el nombre de la publicación.
Rellena las etiquetas `post:` del `<head>` y el contenido de la página.
Haz commit. En un par de minutos aparece en la portada.
Para ocultar una página mientras la preparas, añade `<meta name="post:borrador" content="si">`.

Probarlo en local
El archivo `js/posts.js` solo lo genera GitHub al desplegar. En local hay que lanzar el script a mano y servir la carpeta:
```
python py/build-posts.py
python -m http.server 8000
```

Uso de la plantilla
Puedes usar la estructura y el código de este repositorio como base para tu propio portfolio o proyecto personal, siempre sin ánimo de lucro.
No está permitido venderla, incluirla en un producto o servicio de pago, ni usarla para trabajos de clientes o con fines comerciales. Si la usas, mantén el aviso de licencia y un enlace a este repositorio.
Esto solo cubre el código y la plantilla. Mis textos, writeups, imágenes y datos personales no forman parte de lo que se puede reutilizar: cámbialos por los tuyos.

Licencia
Código y plantillas: PolyForm Noncommercial 1.0.0. Uso no comercial permitido. El texto completo está en el archivo `LICENSE`.
Contenido (writeups, textos e imágenes): CC BY-NC-ND 4.0. Se puede compartir con crédito, sin fines comerciales y sin modificarlo.

© Salvador Navarro :)
