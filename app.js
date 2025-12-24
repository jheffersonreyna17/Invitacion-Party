/* =====================================
   WHATSAPP
===================================== */
(() => {
  const btn = document.getElementById("btnWhatsapp");
  if (!btn) return;

  const number = "51954028946";
  const message = "Hola, confirmo mi asistencia a la End Year Party 🎉";
  btn.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
})();

/* =====================================
   CONTADOR (Viernes 26 dic - 3:00 PM)
===================================== */
(() => {
  const dEl = document.getElementById("days");
  const hEl = document.getElementById("hours");
  const mEl = document.getElementById("minutes");
  const sEl = document.getElementById("seconds");
  if (!dEl || !hEl || !mEl || !sEl) return;

  const year = new Date().getFullYear();
  const target = new Date(year, 11, 26, 15, 0, 0).getTime();

  const pad2 = (n) => String(n).padStart(2, "0");

  function tick() {
    const diff = target - Date.now();

    if (diff <= 0) {
      const countdown = document.querySelector(".countdown");
      if (countdown) countdown.innerHTML = "<strong>¡Hoy es la End Year Party! 🎉</strong>";
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000) % 24;
    const minutes = Math.floor(diff / 60000) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    dEl.textContent = pad2(days);
    hEl.textContent = pad2(hours);
    mEl.textContent = pad2(minutes);
    sEl.textContent = pad2(seconds);
  }

  tick();
  setInterval(tick, 1000);
})();

/* =====================================
   FUEGOS ARTIFICIALES (AÑO NUEVO REAL)
   - Cohetes que suben con cola
   - Explosiones doradas arriba
   - Glitter / crackle suave
===================================== */
(() => {
  const canvas = document.getElementById("fireworks");
  if (!canvas) return;

  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1;

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  // Helpers
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Entidades
  const rockets = [];
  const particles = [];

  // Ajustes (puedes afinar)
  const ROCKET_RATE_MIN = 520;   // ms entre cohetes (min)
  const ROCKET_RATE_MAX = 900;   // ms entre cohetes (max)
  const TOP_MIN = 0.08;          // % alto mínimo explosión
  const TOP_MAX = 0.26;          // % alto máximo explosión

  // Física
  const gravity = 0.055;
  const friction = 0.985;

  // Paleta dorada (hue ~ 42-50)
  function goldHue() {
    return rand(42, 50);
  }

  // Rocket factory
  function launchRocket() {
    const x = rand(w * 0.15, w * 0.85);
    const y = h + rand(20, 60);
    const targetY = rand(h * TOP_MIN, h * TOP_MAX);

    rockets.push({
      x,
      y,
      vx: rand(-0.5, 0.5),
      vy: rand(-8.5, -10.5),
      targetY,
      hue: goldHue(),
      trail: [],          // puntos para cola
      trailMax: 18
    });
  }

  // Explosión
  function explode(x, y, hue) {
    const count = Math.floor(rand(70, 110));
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const s = rand(1.6, 4.6);

      particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 1,
        size: rand(1.1, 2.7),
        hue,
        sparkle: Math.random() < 0.35,
        // crackle: algunas hacen mini-chispas al final
        crackle: Math.random() < 0.22
      });
    }
  }

  // Mini crackles al final de vida
  function crackleBurst(x, y, hue) {
    const n = Math.floor(rand(10, 18));
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const s = rand(0.6, 1.9);
      particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: rand(0.25, 0.45),
        size: rand(0.9, 1.6),
        hue,
        sparkle: true,
        crackle: false
      });
    }
  }

  // Dibujo: partículas
  function drawParticle(p) {
    const alpha = p.sparkle ? p.life * rand(0.55, 1) : p.life;

    // núcleo
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 95%, 62%, ${alpha})`;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // glow
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 95%, 72%, ${alpha * 0.20})`;
    ctx.arc(p.x, p.y, p.size * 3.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dibujo: cola del rocket (línea suave con degradé)
  function drawTrail(trail, hue) {
    if (trail.length < 2) return;

    for (let i = 1; i < trail.length; i++) {
      const a = i / trail.length; // 0..1
      const p0 = trail[i - 1];
      const p1 = trail[i];

      ctx.strokeStyle = `hsla(${hue}, 95%, 70%, ${a * 0.35})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    }
  }

  // Ritmo de lanzamiento
  let nextLaunch = performance.now() + rand(ROCKET_RATE_MIN, ROCKET_RATE_MAX);

  function loop(t) {
    // Velo para estela (NO tapa video, solo “limpia” el canvas)
    ctx.clearRect(0, 0, w, h);


    // Lanzar cohetes
    if (t > nextLaunch) {
      launchRocket();
      nextLaunch = t + rand(ROCKET_RATE_MIN, ROCKET_RATE_MAX);
    }

    // Actualizar rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];

      r.vx *= 0.995;
      r.vy += gravity * 0.25; // muy leve para que “suba”
      r.x += r.vx;
      r.y += r.vy;

      // guardar cola
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > r.trailMax) r.trail.shift();

      // dibujar cola + punto del cohete
      drawTrail(r.trail, r.hue);

      ctx.beginPath();
      ctx.fillStyle = `hsla(${r.hue}, 95%, 75%, 0.95)`;
      ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Glow del rocket
      ctx.beginPath();
      ctx.fillStyle = `hsla(${r.hue}, 95%, 75%, 0.18)`;
      ctx.arc(r.x, r.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Explota cuando llega a la zona alta o cuando pierde impulso
      if (r.y <= r.targetY || r.vy > -2.0) {
        explode(r.x, r.y, r.hue);
        rockets.splice(i, 1);
      }
    }

    // Actualizar partículas
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.vx *= friction;
      p.vy *= friction;
      p.vy += gravity;

      p.x += p.vx;
      p.y += p.vy;

      // vida
      p.life -= 0.014;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // crackle al final
      if (p.crackle && p.life < 0.22 && Math.random() < 0.12) {
        crackleBurst(p.x, p.y, p.hue);
      }

      // mantener dentro (suave)
      if (p.x < -50 || p.x > w + 50 || p.y < -50 || p.y > h + 50) {
        p.life -= 0.06;
      }

      drawParticle(p);
    }

    requestAnimationFrame(loop);
  }

  ctx.clearRect(0, 0, w, h);
  requestAnimationFrame(loop);
})();
