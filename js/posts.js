/* ============================================================
   AQUÍ AÑADES TUS RETOS. Un objeto por reto.
   - url: página del reto, dentro de retos/ (ej. "retos/brutus.html")
   - dificultad: Very Easy | Easy | Medium | Hard | Insane
   - os: Windows | Linux | Otro
   Copia retos/plantilla.html con el nombre del reto para crear su página.
   ============================================================ */
const posts = [
  {
    titulo: "Brutus - Sherlock",
    fecha: "2026-10-20",
    url: "retos/brutus.html",
    dificultad: "Very Easy", os: "Linux", puntos: 20,
    resumen: "Análisis de logs de autenticación (auth.log y wtmp) de un servidor Linux tras un ataque de fuerza bruta por SSH. Reconstruimos la línea temporal: IPs atacantes, cuenta comprometida, persistencia y comandos ejecutados.",
    tags: ["auth.log", "wtmp", "ssh", "linux"]
  },
  {
    titulo: "Noxious - Sherlock",
    fecha: "2026-10-12",
    url: "retos/noxious.html",
    dificultad: "Easy", os: "Windows", puntos: 20,
    resumen: "Captura de red con tráfico LLMNR/NBT-NS envenenado. Identificamos al atacante, la víctima y el hash NTLMv2 capturado a partir del PCAP.",
    tags: ["pcap", "wireshark", "llmnr", "ntlm"]
  },
  {
    titulo: "Unit42 - Sherlock",
    fecha: "2026-10-05",
    url: "retos/unit42.html",
    dificultad: "Very Easy", os: "Windows", puntos: 20,
    resumen: "Análisis de eventos Sysmon de una infección con malware. Seguimos el proceso malicioso, las conexiones de red, los archivos creados y la técnica de evasión usada.",
    tags: ["sysmon", "evtx", "windows", "malware"]
  }
];
