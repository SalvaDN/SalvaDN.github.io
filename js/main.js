const colores = {"Very Easy":"#8fd14f","Easy":"#8fd14f","Medium":"#ffb82e","Hard":"#ff6b4a","Insane":"#d14fff"};
const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = iso => { const [y,m,d] = iso.split("-").map(Number); return `${d} ${meses[m-1]} ${y}`; };

const ICON = {
  cube:'<svg class="i" viewBox="0 0 16 16"><path d="M8.2.2a.5.5 0 0 0-.4 0l-6 2.6A.5.5 0 0 0 1.5 3.3v9.4c0 .2.1.4.3.5l6 2.6c.1.1.3.1.4 0l6-2.6c.2-.1.3-.3.3-.5V3.3a.5.5 0 0 0-.3-.5ZM8 1.3l4.8 2.1L8 5.5 3.2 3.4Zm-5.5 3 5 2.2v7.3l-5-2.2Zm6 9.5V6.5l5-2.2v7.3Z"/></svg>',
  cal:'<svg class="i" viewBox="0 0 16 16"><path d="M4.5 0a.5.5 0 0 1 .5.5V1h6V.5a.5.5 0 0 1 1 0V1h1.5A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11A1.5 1.5 0 0 1 2.5 1H4V.5a.5.5 0 0 1 .5-.5ZM2 6v7.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V6Z"/></svg>',
  tag:'<svg class="i" viewBox="0 0 16 16"><path d="M2 1h5.2a1 1 0 0 1 .7.3l6.8 6.8a1 1 0 0 1 0 1.4l-4.9 4.9a1 1 0 0 1-1.4 0L1.6 8.6A1 1 0 0 1 1.3 8V2a1 1 0 0 1 1-1Zm2 2.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>'
};

const list = document.getElementById("list");
const filter = document.getElementById("filter");
let activo = null;

const POR_PAGINA = 5;
let pagina = 1;
const pager = document.getElementById("paginacion");

function pintar(){
  const todos = posts
    .filter(p => !activo || p.tags.includes(activo))
    .sort((a,b) => b.fecha.localeCompare(a.fecha));

  const total = Math.max(1, Math.ceil(todos.length / POR_PAGINA));
  pagina = Math.min(pagina, total);
  const datos = todos.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  filter.style.display = activo ? "block" : "none";
  document.getElementById("filter-name").textContent = activo || "";

  if(!datos.length){ list.innerHTML = "<p>No hay posts con ese tag.</p>"; pager.innerHTML = ""; return; }

  list.innerHTML = datos.map(p => {
    const c = colores[p.dificultad] || "#8fd14f";
    const nombre = p.titulo.split(" - ")[0];
    return `
    <article class="post">
      <div>
        <h2><a href="${esc(p.url)}">${esc(p.titulo)}</a><span class="cube">${ICON.cube}</span></h2>
        <div class="date">${ICON.cal} ${fmt(p.fecha)} <span>· ${esc(p.dificultad)}</span></div>
        <p>${esc(p.resumen)}</p>
        <div class="tags"><span class="ico">${ICON.tag}</span>${p.tags.map(t => `<button data-tag="${esc(t)}">${esc(t)}</button>`).join("")}</div>
      </div>
      <a class="thumb" href="${esc(p.url)}" style="--c:${c}" aria-label="${esc(p.titulo)}">
        <div class="badge">${esc(nombre)}</div>
        <div class="meta">
          <b>${esc(nombre)}</b>
          <div><span>OS:</span><em>${esc(p.os)}</em></div>
          <div><span>Dificultad:</span><em>${esc(p.dificultad)}</em></div>
          <div><span>Puntos:</span><em>${esc(p.puntos)}</em></div>
        </div>
      </a>
    </article>`;
  }).join("");

  pager.innerHTML = total > 1 ? `
    <button data-p="${pagina - 1}" ${pagina === 1 ? "disabled" : ""}>← Anteriores</button>
    <span>Página ${pagina} de ${total}</span>
    <button data-p="${pagina + 1}" ${pagina === total ? "disabled" : ""}>Siguientes →</button>` : "";
  
}

list.addEventListener("click", e => {
  const b = e.target.closest("button[data-tag]");
  if(b){ activo = b.dataset.tag; pagina = 1; pintar(); }
});
document.getElementById("clear").addEventListener("click", () => { activo = null; pagina = 1; pintar(); });
pager.addEventListener("click", e => {
  const b = e.target.closest("button[data-p]");
  if(b && !b.disabled){
    pagina = Number(b.dataset.p);
    pintar();
    document.getElementById("posts").scrollIntoView();
  }
});
