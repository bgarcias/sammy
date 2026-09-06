/**
 * =========================================================
 * TULIPANES PARA SAMMY - SCRIPT INTERACTIVO
 * Silueta de bulbo cerrado pastel, 10 tulipanes, composición compacta,
 * conexión milimétrica de tallos y envoltura con tensión física.
 * =========================================================
 */

const svgNS = "http://www.w3.org/2000/svg";

// Utilidades DOM SVG
function mk(tag, attrs = {}) {
  const node = document.createElementNS(svgNS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    node.setAttribute(k, v);
  }
  return node;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Funciones de aceleración (Easing)
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutSoftBack(t) {
  const c1 = 1.15;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Motor de animación tween por requestAnimationFrame
function tween(duration, easeFn, onUpdate, onDone, delay = 0) {
  setTimeout(() => {
    const start = performance.now();
    function step(now) {
      const progress = clamp((now - start) / duration, 0, 1);
      onUpdate(easeFn(progress), progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (onDone) {
        onDone();
      }
    }
    requestAnimationFrame(step);
  }, delay);
}

// =========================================================
// 1. CONFIGURACIÓN COMPACTA DE LOS 10 TULIPANES
// Composición llena, cercana y sin vacíos
// =========================================================

const TULIP_CONFIGS = [
  // Fila Superior (Cresta del bouquet)
  { id: 0, bx: 270, by: 500, hx: 270, hy: 145, ghx: 270, ghy: 150, size: 1.08, angle: 0,   gAngle: 0,   delay: 0 },
  { id: 1, bx: 262, by: 500, hx: 215, hy: 170, ghx: 228, ghy: 175, size: 1.04, angle: -7,  gAngle: -4,  delay: 110 },
  { id: 2, bx: 278, by: 500, hx: 325, hy: 170, ghx: 312, ghy: 175, size: 1.04, angle: 7,   gAngle: 4,   delay: 220 },

  // Fila Media (Extensión compacta y profundidad)
  { id: 3, bx: 255, by: 495, hx: 160, hy: 215, ghx: 185, ghy: 220, size: 0.98, angle: -14, gAngle: -8,  delay: 330 },
  { id: 4, bx: 285, by: 495, hx: 380, hy: 215, ghx: 355, ghy: 220, size: 0.98, angle: 14,  gAngle: 8,   delay: 440 },
  { id: 5, bx: 265, by: 495, hx: 220, hy: 225, ghx: 232, ghy: 230, size: 1.00, angle: -5,  gAngle: -2,  delay: 550 },
  { id: 6, bx: 275, by: 495, hx: 320, hy: 225, ghx: 308, ghy: 230, size: 1.00, angle: 5,   gAngle: 2,   delay: 660 },

  // Fila Frontal (Cercanía y cuerpo central)
  { id: 7, bx: 270, by: 490, hx: 270, hy: 250, ghx: 270, ghy: 255, size: 1.02, angle: 0,   gAngle: 0,   delay: 770 },
  { id: 8, bx: 260, by: 490, hx: 210, hy: 290, ghx: 222, ghy: 295, size: 0.94, angle: -8,  gAngle: -4,  delay: 880 },
  { id: 9, bx: 280, by: 490, hx: 330, hy: 290, ghx: 318, ghy: 295, size: 0.94, angle: 8,   gAngle: 4,   delay: 990 }
];

// =========================================================
// 2. SILUETA DEL TULIPÁN: BULBO CERRADO PASTEL
// =========================================================

/**
 * Crea la flor como una sola silueta cerrada (bulbo alargado rosa chicle pastel/rosa palo).
 */
function createTulipBulb(size = 1.0) {
  const gFlower = mk('g', { class: 'tulip-bulb-node' });

  const s = size;
  const w = 20 * s;
  const h = 64 * s;

  // 1. Silueta única continua y cerrada del bulbo de tulipán
  const bulbPath = `
    M 0, 0
    C ${-w * 0.58}, ${-h * 0.08} ${-w * 1.06}, ${-h * 0.32} ${-w * 0.98}, ${-h * 0.54}
    C ${-w * 0.90}, ${-h * 0.76} ${-w * 0.42}, ${-h * 0.94} 0, ${-h}
    C ${w * 0.42}, ${-h * 0.94} ${w * 0.90}, ${-h * 0.76} ${w * 0.98}, ${-h * 0.54}
    C ${w * 1.06}, ${-h * 0.32} ${w * 0.58}, ${-h * 0.08} 0, 0
    Z
  `;

  // Cuerpo base con gradiente pastel rosa chicle / rosa palo
  const bulbBody = mk('path', {
    d: bulbPath.trim(),
    fill: 'url(#tulipBulbGrad)'
  });
  gFlower.appendChild(bulbBody);

  // Sombreado interno suave izquierdo para volumen 3D
  const shadowL = mk('path', {
    d: bulbPath.trim(),
    fill: 'url(#tulipShadowLeft)',
    opacity: '0.6'
  });
  gFlower.appendChild(shadowL);

  // Sombreado interno suave derecho
  const shadowR = mk('path', {
    d: bulbPath.trim(),
    fill: 'url(#tulipShadowRight)',
    opacity: '0.55'
  });
  gFlower.appendChild(shadowR);

  // 2. Líneas de pliegue sutiles verticales
  const fold1 = mk('path', {
    d: `M 0, ${-h} C ${-w * 0.28}, ${-h * 0.75} ${-w * 0.48}, ${-h * 0.46} ${-w * 0.16}, ${-h * 0.12}`,
    stroke: '#b84872',
    'stroke-width': (1.0 * s).toFixed(2),
    opacity: '0.28',
    fill: 'none'
  });
  gFlower.appendChild(fold1);

  const fold2 = mk('path', {
    d: `M ${w * 0.06}, ${-h * 0.96} C ${w * 0.34}, ${-h * 0.72} ${w * 0.44}, ${-h * 0.45} ${w * 0.18}, ${-h * 0.14}`,
    stroke: '#b84872',
    'stroke-width': (0.9 * s).toFixed(2),
    opacity: '0.24',
    fill: 'none'
  });
  gFlower.appendChild(fold2);

  // 3. Brillo especular suave en la curvatura frontal
  const highlight = mk('path', {
    d: `M ${-w * 0.22}, ${-h * 0.72} C ${-w * 0.34}, ${-h * 0.52} ${-w * 0.24}, ${-h * 0.32} ${-w * 0.08}, ${-h * 0.15}`,
    stroke: '#ffffff',
    'stroke-width': (1.8 * s).toFixed(2),
    'stroke-linecap': 'round',
    opacity: '0.28',
    fill: 'none'
  });
  gFlower.appendChild(highlight);

  // 4. Cáliz botánico verde en la base exacta (0, 0)
  const calyx = mk('path', {
    d: `M ${-w * 0.24}, ${-h * 0.02} C ${-w * 0.13}, ${h * 0.045} ${w * 0.13}, ${h * 0.045} ${w * 0.24}, ${-h * 0.02} Z`,
    fill: 'url(#calyxGrad)',
    stroke: '#24592a',
    'stroke-width': '0.5'
  });
  gFlower.appendChild(calyx);

  return { gFlower };
}

// =========================================================
// 3. GENERACIÓN DE CURVAS DE TALLOS
// =========================================================

function makeStemPath(bx, by, hx, hy) {
  const dx = hx - bx;
  const dy = hy - by;

  const lateralOffset = Math.abs(dx) < 5 ? 8 : 0;

  const cp1x = bx + dx * 0.18 + lateralOffset;
  const cp1y = by + dy * 0.48;
  const cp2x = hx - dx * 0.18 - lateralOffset * 0.5;
  const cp2y = hy - dy * 0.28;

  return `M ${bx},${by} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${hx},${hy}`;
}

// =========================================================
// 4. INICIALIZACIÓN PRINCIPAL DEL BOUQUET COMPACTO
// =========================================================

function initBouquet() {
  // 1. Estrellas de fondo
  const starsContainer = document.getElementById('stars');
  if (starsContainer) {
    starsContainer.innerHTML = '';
    for (let i = 0; i < 75; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 1.8 + 0.6;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 75}%`;
      star.style.animationDuration = `${Math.random() * 3 + 2.5}s`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }
  }

  // Capas SVG
  const stemsLayer = document.getElementById('stemsLayer');
  const stemEndsLayer = document.getElementById('stemEndsLayer');
  const tulipsLayer = document.getElementById('tulipsLayer');
  const wrapBackLayer = document.getElementById('wrapBackLayer');
  const wrapFlapLeft = document.getElementById('wrapFlapLeft');
  const wrapFlapRight = document.getElementById('wrapFlapRight');
  const bowLayer = document.getElementById('bowLayer');
  const sparklesLayer = document.getElementById('sparklesLayer');

  if (!stemsLayer || !tulipsLayer) return;

  stemsLayer.innerHTML = '';
  tulipsLayer.innerHTML = '';
  sparklesLayer.innerHTML = '';

  // 3. Construir los 10 tulipanes con sus respectivos tallos
  const tulips = TULIP_CONFIGS.map(cfg => {
    const stemPathStr = makeStemPath(cfg.bx, cfg.by, cfg.hx, cfg.hy);
    const stem = mk('path', {
      class: 'stem',
      d: stemPathStr,
      'stroke-width': (4.8 * cfg.size).toFixed(1)
    });
    stemsLayer.appendChild(stem);

    const flowerGroup = mk('g', {
      class: 'tulip-node',
      transform: `translate(${cfg.hx}, ${cfg.hy}) rotate(${cfg.angle})`
    });

    const innerFlower = mk('g', {
      transform: 'scale(0)'
    });
    innerFlower.style.opacity = '0';

    const flowerParts = createTulipBulb(cfg.size);
    innerFlower.appendChild(flowerParts.gFlower);
    flowerGroup.appendChild(innerFlower);
    tulipsLayer.appendChild(flowerGroup);

    const length = stem.getTotalLength();
    stem.style.strokeDasharray = length;
    stem.style.strokeDashoffset = length;

    return {
      cfg,
      stem,
      flowerGroup,
      innerFlower,
      flowerParts,
      length
    };
  });

  // 4. Estado inicial del Envoltorio y Lazo
  wrapBackLayer.style.opacity = '0';
  wrapBackLayer.setAttribute('transform', 'translate(270, 570) scale(0.75) translate(-270, -570)');

  wrapFlapLeft.style.opacity = '0';
  wrapFlapLeft.setAttribute('transform', 'translate(172, 480) rotate(-45) scale(0.25) translate(-172, -480)');

  wrapFlapRight.style.opacity = '0';
  wrapFlapRight.setAttribute('transform', 'translate(368, 480) rotate(45) scale(0.25) translate(-368, -480)');

  bowLayer.style.opacity = '0';
  bowLayer.setAttribute('transform', 'translate(270, 494) scale(0) translate(-270, -494)');

  // =========================================================
  // 5. COREOGRAFÍA DE ANIMACIÓN
  // =========================================================

  function bloomBulb(t) {
    tween(580, easeOutSoftBack, (val) => {
      t.innerFlower.setAttribute('transform', `scale(${val.toFixed(3)})`);
      t.innerFlower.style.opacity = clamp(val * 1.5, 0, 1);
    });

    createSparkles(t.cfg.hx, t.cfg.hy - 38);
  }

  function createSparkles(cx, cy) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const circle = mk('circle', {
        cx: cx,
        cy: cy,
        r: (Math.random() * 2.0 + 1.1).toFixed(1),
        fill: i % 2 === 0 ? '#ffe3ef' : '#fff9db',
        opacity: '1'
      });
      sparklesLayer.appendChild(circle);

      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const dist = Math.random() * 26 + 16;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist - 14;

      tween(900, easeOutCubic, (val) => {
        circle.setAttribute('cx', (cx + tx * val).toFixed(1));
        circle.setAttribute('cy', (cy + ty * val).toFixed(1));
        circle.setAttribute('opacity', (1 - val).toFixed(2));
      }, () => {
        if (circle.parentNode) circle.parentNode.removeChild(circle);
      }, Math.random() * 70);
    }
  }

  requestAnimationFrame(() => {
    // A. Mostrar papel de fondo suavemente
    tween(1100, easeOutCubic, (val) => {
      wrapBackLayer.style.opacity = val;
      const s = 0.8 + 0.2 * val;
      wrapBackLayer.setAttribute('transform', `translate(270, 570) scale(${s}) translate(-270, -570)`);
    }, null, 150);

    // B. Crecimiento controlado de los 10 tallos y floración
    tulips.forEach((t) => {
      setTimeout(() => {
        tween(820, easeOutCubic, (val) => {
          t.stem.style.strokeDashoffset = (t.length * (1 - val)).toFixed(1);
        });

        setTimeout(() => {
          bloomBulb(t);
        }, 460);
      }, t.cfg.delay);
    });

    // C. Inicio de la Envoltura Realista del Ramo
    const maxBloomTime = TULIP_CONFIGS[TULIP_CONFIGS.length - 1].delay + 880;

    setTimeout(() => {
      executeRealWrapSequence(tulips, wrapFlapLeft, wrapFlapRight, bowLayer);
    }, maxBloomTime);
  });
}

// =========================================================
// 6. ENVOLTURA REALISTA: TENSIÓN FÍSICA Y AGRUPAMIENTO
// =========================================================

function executeRealWrapSequence(tulips, flapLeft, flapRight, bowLayer) {
  // 1. Solapa Izquierda se dobla cruzando la cintura (Y=492)
  setTimeout(() => {
    flapLeft.style.opacity = '1';
    tween(880, easeOutCubic, (val) => {
      const angle = -45 * (1 - val);
      const scale = 0.25 + 0.75 * val;
      flapLeft.setAttribute('transform', `translate(172, 480) rotate(${angle.toFixed(1)}) scale(${scale.toFixed(2)}) translate(-172, -480)`);
    });
  }, 160);

  // 2. Solapa Derecha se dobla y cruza por encima
  setTimeout(() => {
    flapRight.style.opacity = '1';
    tween(880, easeOutCubic, (val) => {
      const angle = 45 * (1 - val);
      const scale = 0.25 + 0.75 * val;
      flapRight.setAttribute('transform', `translate(368, 480) rotate(${angle.toFixed(1)}) scale(${scale.toFixed(2)}) translate(-368, -480)`);
    });
  }, 360);

  // 3. Las flores se agrupan suavemente hacia el centro
  setTimeout(() => {
    tulips.forEach((t) => {
      const initialHx = t.cfg.hx;
      const initialHy = t.cfg.hy;
      const targetHx = t.cfg.ghx;
      const targetHy = t.cfg.ghy;
      const initialAngle = t.cfg.angle;
      const targetAngle = t.cfg.gAngle;

      tween(950, easeInOutCubic, (val) => {
        const curHx = initialHx + (targetHx - initialHx) * val;
        const curHy = initialHy + (targetHy - initialHy) * val;
        const curAngle = initialAngle + (targetAngle - initialAngle) * val;

        t.flowerGroup.setAttribute('transform', `translate(${curHx.toFixed(1)}, ${curHy.toFixed(1)}) rotate(${curAngle.toFixed(1)})`);

        const newStemPath = makeStemPath(t.cfg.bx, t.cfg.by, curHx, curHy);
        t.stem.setAttribute('d', newStemPath);
      });
    });
  }, 420);

  // 4. Moño y tarjetita se ciñen con una aceleración suave y fluida
  setTimeout(() => {
    bowLayer.style.opacity = '1';
    tween(1150, easeOutSoftBack, (val) => {
      bowLayer.setAttribute('transform', `translate(270, 494) scale(${val.toFixed(3)}) translate(-270, -494)`);
    }, () => {
      startBouquetIdleSway(tulips);
    });
  }, 760);
}

// =========================================================
// 7. BALANCEO ORGÁNICO CONTINUO (IDLE SWAY)
// =========================================================

function startBouquetIdleSway(tulips) {
  const bouquetGroup = document.getElementById('bouquetGroup');
  if (!bouquetGroup) return;

  const startTime = performance.now();

  function sway(now) {
    const elapsed = (now - startTime) / 1000;

    const groupAngle = Math.sin(elapsed * 0.85) * 1.2;
    bouquetGroup.setAttribute('transform', `rotate(${groupAngle.toFixed(2)}, 270, 570)`);

    tulips.forEach((t, i) => {
      const microSway = Math.sin(elapsed * 1.1 + i * 0.7) * 0.9;
      const baseAngle = t.cfg.gAngle;
      const curHx = t.cfg.ghx;
      const curHy = t.cfg.ghy;
      t.flowerGroup.setAttribute('transform', `translate(${curHx.toFixed(1)}, ${curHy.toFixed(1)}) rotate(${(baseAngle + microSway).toFixed(2)})`);
    });

    requestAnimationFrame(sway);
  }

  requestAnimationFrame(sway);
}

// Inicializar de forma segura al cargar el DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBouquet);
} else {
  initBouquet();
}