const colores = {"Very Easy":"#8fd14f","Easy":"#8fd14f","Medium":"#ffb82e","Hard":"#ff6b4a","Insane":"#d14fff"};
const coloresTipo = {"Proyecto":"#4fa3ff","Estudio":"#ffb82e"};
const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = iso => { const [y,m,d] = iso.split("-").map(Number); return `${d} ${meses[m-1]} ${y}`; };

const ICON = {
  cube:'<svg class="i" viewBox="0 0 16 16"><path d="M8.2.2a.5.5 0 0 0-.4 0l-6 2.6A.5.5 0 0 0 1.5 3.3v9.4c0 .2.1.4.3.5l6 2.6c.1.1.3.1.4 0l6-2.6c.2-.1.3-.3.3-.5V3.3a.5.5 0 0 0-.3-.5ZM8 1.3l4.8 2.1L8 5.5 3.2 3.4Zm-5.5 3 5 2.2v7.3l-5-2.2Zm6 9.5V6.5l5-2.2v7.3Z"/></svg>',
  cal:'<svg class="i" viewBox="0 0 16 16"><path d="M4.5 0a.5.5 0 0 1 .5.5V1h6V.5a.5.5 0 0 1 1 0V1h1.5A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11A1.5 1.5 0 0 1 2.5 1H4V.5a.5.5 0 0 1 .5-.5ZM2 6v7.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V6Z"/></svg>',
  doc:'<svg class="i" viewBox="0 0 16 16"><path d="M3 1h6.5L13 4.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Zm6 .8V5h3.2ZM4.500 8v1h7V8Zm0 2.500v1h7v-1Z"/></svg>',
  tag:'<svg class="i" viewBox="0 0 16 16"><path d="M2 1h5.2a1 1 0 0 1 .7.3l6.8 6.8a1 1 0 0 1 0 1.4l-4.9 4.9a1 1 0 0 1-1.4 0L1.6 8.6A1 1 0 0 1 1.3 8V2a1 1 0 0 1 1-1Zm2 2.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
};

const POR_PAGINA = 5;
let pagina = 1;
let activo = null;

const list = document.getElementById("list");
const filter = document.getElementById("filter");
const pager = document.getElementById("paginacion");

/* Filtro por tipo desde el menú: index.html?tipo=Proyecto, ?tipo=Estudio, ?tipo=Sherlock */
const NOMBRES = {"Retos":"Retos","Proyecto":"Proyectos","Estudio":"Estudios"};
const tipoPagina = new URLSearchParams(location.search).get("tipo");
if(tipoPagina){
  const h = document.querySelector("#posts h1");
  if(h) h.textContent = NOMBRES[tipoPagina] || tipoPagina;
}

function pintar(){
  if(typeof posts === "undefined" || !Array.isArray(posts)){
    list.innerHTML = "<p>No se han podido cargar las publicaciones. Comprueba que existe js/posts.js y que no tiene errores.</p>";
    return;
  }
  const todos = posts
    .filter(p => !tipoPagina || (p.tipo || "Retos") === tipoPagina)
    .filter(p => !activo || p.tags.includes(activo))
    .sort((a,b) => b.fecha.localeCompare(a.fecha));

  const total = Math.max(1, Math.ceil(todos.length / POR_PAGINA));
  pagina = Math.min(pagina, total);
  const datos = todos.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  filter.style.display = activo ? "block" : "none";
  document.getElementById("filter-name").textContent = activo || "";

  if(!datos.length){
    list.innerHTML = activo ? "<p>No hay posts con ese tag.</p>"
      : tipoPagina ? `<p>Todavía no hay ${(NOMBRES[tipoPagina] || tipoPagina).toLowerCase()}.</p>`
      : "<p>Todavía no hay publicaciones.</p>";
    if(pager) pager.innerHTML = "";
    return;
  }

  list.innerHTML = datos.map(p => {
    const tipo = p.tipo || "Sherlock";
    const esSh = tipo === "Sherlock";
    const c = esSh ? (colores[p.dificultad] || "#8fd14f") : (coloresTipo[tipo] || "#9fb0c6");
    const nombre = esSh ? p.titulo.split(" - ")[0] : tipo;
    const sub = esSh ? p.dificultad : tipo;
    const filas = esSh
      ? `<div><span>OS:</span><em>${esc(p.os)}</em></div>
          <div><span>Dificultad:</span><em>${esc(p.dificultad)}</em></div>
          <div><span>Puntos:</span><em>${esc(p.puntos)}</em></div>`
      : `<div><span>Tipo:</span><em>${esc(tipo)}</em></div>` + (p.estado ? `<div><span>Estado:</span><em>${esc(p.estado)}</em></div>` : "");
    const miniatura = p.imagen
      ? `<img src="${esc(p.imagen)}" alt="${esc(p.titulo)}" style="width:100%;display:block">`
      : `${p.icono ? `<div class="badge img"><img src="${esc(p.icono)}" alt=""></div>` : `<div class="badge">${esc(nombre)}</div>`}
        <div class="meta"><b>${esc(esSh ? nombre : p.titulo)}</b>${filas}</div>`;
    return `
    <article class="post">
      <div>
        <h2><a href="${esc(p.url)}">${esc(p.titulo)}</a><span class="cube">${esSh ? ICON.cube : ICON.doc}</span></h2>
        <div class="date">${ICON.cal} ${fmt(p.fecha)} <span>· ${esc(sub)}</span></div>
        <p>${esc(p.resumen)}</p>
        <div class="tags"><span class="ico">${ICON.tag}</span>${p.tags.map(t => `<button data-tag="${esc(t)}">${esc(t)}</button>`).join("")}</div>
      </div>
      <a class="thumb" href="${esc(p.url)}" style="--c:${c}" aria-label="${esc(p.titulo)}">${miniatura}</a>
    </article>`;
  }).join("");

  if(pager){
    pager.innerHTML = total > 1 ? `
      <button data-p="${pagina - 1}" ${pagina === 1 ? "disabled" : ""}>← Anteriores</button>
      <span>Página ${pagina} de ${total}</span>
      <button data-p="${pagina + 1}" ${pagina === total ? "disabled" : ""}>Siguientes →</button>` : "";
  }
}

list.addEventListener("click", e => {
  const b = e.target.closest("button[data-tag]");
  if(b){ activo = b.dataset.tag; pagina = 1; pintar(); }
});
document.getElementById("clear").addEventListener("click", () => { activo = null; pagina = 1; pintar(); });
if(pager){
  pager.addEventListener("click", e => {
    const b = e.target.closest("button[data-p]");
    if(b && !b.disabled){
      pagina = Number(b.dataset.p);
      pintar();
      document.getElementById("posts").scrollIntoView();
    }
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
pintar();
