// ====== CONFIGURA AQUÍ ======
const INVITACION = {
  nombreEvento: "Pool Party",
  fechaTexto: "Sábado 20 de enero",
  horaTexto: "5:00 p. m.",
  lugarTexto: "Casa de ______ (dirección)",
  dressTexto: "Ropa de baño / Casual",
  whatsappNumero: "519XXXXXXXX",
  whatsappMensaje: "Hola! Confirmo mi asistencia a la Pool Party. Mi nombre es: ",
  fechaISO: "2026-01-20",
  horaInicio: "17:00",
  duracionMin: 240
};

// Pinta datos
document.getElementById("fecha").textContent = INVITACION.fechaTexto;
document.getElementById("hora").textContent = INVITACION.horaTexto;
document.getElementById("lugar").textContent = INVITACION.lugarTexto;
document.getElementById("dress").textContent = INVITACION.dressTexto;

// WhatsApp
document.getElementById("btnWhatsapp").href =
  `https://wa.me/${INVITACION.whatsappNumero}?text=${encodeURIComponent(INVITACION.whatsappMensaje)}`;

// Flotadores (aros/burbujas)
const wrap = document.querySelector(".floaters");
for(let i=0;i<14;i++){
  const f=document.createElement("div");
  f.className="floater";
  const s=60+Math.random()*90;
  f.style.width=`${s}px`;
  f.style.height=`${s}px`;
  f.style.left=`${Math.random()*100}%`;
  f.style.animationDuration=`${12+Math.random()*14}s`;
  f.style.animationDelay=`${-Math.random()*10}s`;
  wrap.appendChild(f);
}

// Calendario (.ics)
function toICS(d){
  const p=n=>String(n).padStart(2,"0");
  return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+"T"+p(d.getHours())+p(d.getMinutes())+"00";
}
document.getElementById("btnCalendario").onclick=()=>{
  const [y,m,d]=INVITACION.fechaISO.split("-").map(Number);
  const [hh,mm]=INVITACION.horaInicio.split(":").map(Number);
  const start=new Date(y,m-1,d,hh,mm);
  const end=new Date(start.getTime()+INVITACION.duracionMin*60000);
  const ics=`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${toICS(start)}
DTEND:${toICS(end)}
SUMMARY:${INVITACION.nombreEvento}
LOCATION:${INVITACION.lugarTexto}
END:VEVENT
END:VCALENDAR`;
  const blob=new Blob([ics],{type:"text/calendar"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="invitacion.ics";
  a.click();
};
