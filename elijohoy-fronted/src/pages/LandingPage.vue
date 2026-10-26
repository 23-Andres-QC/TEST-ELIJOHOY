<template>
  <q-page class="landing-page">
    <!-- Hero -->
    <section
      id="hero"
      ref="heroRef"
      class="hero-section"
      @mousemove="onHeroMove"
      @mouseleave="onHeroLeave"
    >
      <div class="hero-bg" aria-hidden="true">
        <div class="blob blob--indigo" />
        <div class="blob blob--pink" />
        <div class="blob blob--amber" />
        <div class="hero-grid" />
        <span
          v-for="p in particles"
          :key="p.id"
          class="particle"
          :style="p.style"
        />
      </div>

      <div class="container hero-layout">
        <div class="hero-copy">
          <div class="hero-badge">
            <span class="hero-badge__dot" />
            Plataforma #1 en Orientación Vocacional
          </div>

          <h1 class="hero-title">
            Descubre tu
            <span class="hero-title__rotator">
              <span :key="currentWord" class="hero-title__word">{{ currentWord }}</span>
            </span>
            y construye tu futuro
          </h1>

          <p class="hero-subtitle">
            La plataforma de orientación vocacional que te ayuda a encontrar tu verdadero camino profesional.
            Descubre tus talentos únicos y toma decisiones educativas con confianza.
          </p>

          <div class="hero-actions">
            <q-btn
              unelevated
              no-caps
              size="lg"
              icon="rocket_launch"
              label="Comenzar Test Gratuito"
              to="/test"
              class="btn-primary-glow"
            />
            <q-btn
              flat
              no-caps
              size="lg"
              icon="login"
              label="Iniciar Sesión"
              to="/auth/login"
              class="btn-glass"
            />
          </div>

          <div class="hero-proof">
            <div class="avatar-stack">
              <img
                v-for="tipo in heroStack"
                :key="tipo.codigo"
                :src="avatarUrl(tipo.codigo)"
                :alt="tipo.nombre"
                width="44"
                height="44"
                decoding="async"
              />
            </div>
            <div class="hero-proof__text">
              <strong>16 perfiles</strong> de personalidad
              <span>Test de 32 preguntas · 100% gratis</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-visual__halo" />
          <img
            src="/hero-avatars-rocket.webp"
            width="1024"
            height="943"
            decoding="async"
            fetchpriority="high"
            alt="Avatares de los 16 perfiles alrededor de un cohete despegando"
            class="hero-visual__img"
          />

          <div class="float-chip float-chip--top">
            <q-icon name="bolt" size="18px" />
            Resultados al instante
          </div>
          <div class="float-chip float-chip--left">
            <img :src="avatarUrl('ESFJ')" alt="" width="34" height="34" />
            <div>
              <strong>ESFJ</strong>
              <span>El Cónsul</span>
            </div>
          </div>
          <div class="float-chip float-chip--bottom">
            <q-icon name="workspace_premium" size="18px" />
            Carreras para tu perfil
          </div>
        </div>
      </div>

      <button type="button" class="scroll-cue" aria-label="Ver más" @click="scrollTo('features')">
        <span class="scroll-cue__mouse"><span /></span>
      </button>
    </section>

    <!-- Marquee de perfiles -->
    <section class="marquee-section" aria-label="Los 16 perfiles de personalidad">
      <div
        v-for="(row, rowIndex) in marqueeRows"
        :key="rowIndex"
        class="marquee"
        :class="{ 'marquee--reverse': rowIndex === 1 }"
      >
        <div class="marquee__track">
          <router-link
            v-for="(tipo, i) in row"
            :key="`${tipo.codigo}-${i}`"
            to="/test"
            class="type-pill"
            :aria-hidden="i >= row.length / 2 ? 'true' : null"
            :tabindex="i >= row.length / 2 ? -1 : null"
          >
            <img :src="avatarUrl(tipo.codigo)" :alt="tipo.nombre" width="44" height="44" loading="lazy" decoding="async" />
            <span class="type-pill__code">{{ tipo.codigo }}</span>
            <span class="type-pill__name">{{ tipo.nombre }}</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Cifras -->
    <section ref="statsRef" class="stats-section">
      <div class="container stats-grid">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          v-reveal="i * 90"
          class="stat-card"
        >
          <div class="stat-card__value">
            {{ statValues[i] }}<span>{{ stat.suffix }}</span>
          </div>
          <div class="stat-card__label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Características -->
    <section id="features" class="section section--light">
      <div class="container">
        <header v-reveal class="section-head">
          <div class="section-badge">
            <q-icon name="verified" size="18px" />
            Características
          </div>
          <h2 class="section-title">¿Por qué elegir <span class="text-gradient">ElijoHoy</span>?</h2>
          <p class="section-subtitle">
            Herramientas diseñadas específicamente para ayudarte en tu decisión vocacional
          </p>
        </header>

        <div class="bento">
          <article v-reveal class="spot-card bento__main" @mousemove="onSpotlight">
            <div class="spot-card__icon spot-card__icon--amber">
              <q-icon name="verified_user" size="30px" />
            </div>
            <h3>Resultados Confiables</h3>
            <p>
              Análisis profundo basado en tus intereses genuinos, habilidades naturales y rasgos únicos de
              personalidad para orientarte con precisión.
            </p>
            <ul class="bento__list">
              <li><q-icon name="check_circle" size="20px" /> Tu tipo entre 16 perfiles de personalidad</li>
              <li><q-icon name="check_circle" size="20px" /> Tus 4 dimensiones con puntaje</li>
              <li><q-icon name="check_circle" size="20px" /> Fortalezas y carreras sugeridas para ti</li>
            </ul>
            <div class="bento__avatars">
              <img
                v-for="(tipo, i) in bentoAvatars"
                :key="tipo.codigo"
                :src="avatarUrl(tipo.codigo)"
                :alt="tipo.nombre"
                :style="{ '--i': i }"
                width="96"
                height="96"
                loading="lazy"
                decoding="async"
              />
            </div>
            <q-btn flat no-caps label="Ver Resultados" icon-right="arrow_forward" to="/auth/registro" class="spot-card__link" />
          </article>

          <article v-reveal="120" class="spot-card" @mousemove="onSpotlight">
            <div class="spot-card__icon spot-card__icon--pink">
              <q-icon name="support_agent" size="30px" />
            </div>
            <h3>Acompañamiento Integral</h3>
            <p>
              Te brindamos el apoyo necesario para tomar decisiones educativas y profesionales importantes con total
              confianza y seguridad.
            </p>
            <q-btn flat no-caps label="Obtener Apoyo" icon-right="arrow_forward" to="/auth/login" class="spot-card__link" />
          </article>

          <article v-reveal="200" class="spot-card" @mousemove="onSpotlight">
            <div class="spot-card__icon spot-card__icon--indigo">
              <q-icon name="ios_share" size="30px" />
            </div>
            <h3>Descarga y Comparte</h3>
            <p>
              Guarda tu perfil en PDF o como imagen y compártelo en tus redes con tus amigos y familia.
            </p>
            <q-btn flat no-caps label="Hacer el test" icon-right="arrow_forward" to="/test" class="spot-card__link" />
          </article>
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section id="how-it-works" class="section section--tint">
      <div class="container">
        <header v-reveal class="section-head">
          <div class="section-badge">
            <q-icon name="auto_awesome" size="18px" />
            Proceso Simple
          </div>
          <h2 class="section-title">Cómo funciona nuestro test vocacional</h2>
          <p class="section-subtitle">En solo 3 pasos descubre tu verdadera vocación</p>
        </header>

        <div v-reveal class="timeline">
          <div class="timeline__line"><span /></div>
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="timeline__step"
            :style="{ '--step-delay': `${300 + i * 250}ms` }"
          >
            <div class="timeline__icon" :class="`timeline__icon--${step.tone}`">
              <q-icon :name="step.icon" size="32px" />
              <span class="timeline__num">{{ i + 1 }}</span>
            </div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Beneficios -->
    <section class="section section--light">
      <div class="container">
        <header v-reveal class="section-head">
          <div class="section-badge">
            <q-icon name="diamond" size="18px" />
            Beneficios
          </div>
          <h2 class="section-title">Beneficios para estudiantes y padres</h2>
        </header>

        <div class="benefits-grid">
          <article
            v-for="(benefit, i) in benefits"
            :key="benefit.title"
            v-reveal="i * 120"
            class="spot-card benefit-card"
            @mousemove="onSpotlight"
          >
            <div class="spot-card__icon" :class="`spot-card__icon--${benefit.tone}`">
              <q-icon :name="benefit.icon" size="30px" />
            </div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="section section--tint">
      <div class="container container--narrow">
        <header v-reveal class="section-head">
          <div class="section-badge">
            <q-icon name="help_outline" size="18px" />
            FAQs
          </div>
          <h2 class="section-title">Preguntas frecuentes</h2>
        </header>

        <div v-reveal class="faq-list">
          <q-expansion-item
            v-for="faq in faqs"
            :key="faq.q"
            :label="faq.q"
            group="faq"
            class="faq-item"
            header-class="faq-item__header"
            expand-icon="add"
            expanded-icon="remove"
          >
            <div class="faq-item__body">{{ faq.a }}</div>
          </q-expansion-item>
        </div>

        <div v-reveal class="faq-help">
          <span>¿No encuentras tu respuesta?</span>
          <q-btn
            outline
            no-caps
            icon="contact_support"
            label="Contactar Soporte"
            class="faq-help__btn"
            @click="scrollTo('contact')"
          />
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="cta-section">
      <div class="cta-floaters" aria-hidden="true">
        <img
          v-for="(tipo, i) in ctaAvatars"
          :key="tipo.codigo"
          :src="avatarUrl(tipo.codigo)"
          alt=""
          :class="`cta-floater cta-floater--${i + 1}`"
          width="110"
          height="110"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div v-reveal class="container cta-content">
        <div class="cta-icon">
          <q-icon name="stars" size="44px" />
        </div>
        <h2>¡Empieza hoy!</h2>
        <h3>Construye tu futuro con ElijoHoy</h3>
        <p>
          No esperes más para descubrir tu verdadera vocación. Es tu momento de brillar y encontrar el camino que
          realmente te apasiona.
        </p>

        <div class="cta-actions">
          <q-btn
            unelevated
            no-caps
            size="lg"
            icon="rocket_launch"
            label="Realizar Test Vocacional Ahora"
            to="/test"
            class="btn-amber"
          />
          <q-btn
            flat
            no-caps
            size="lg"
            icon="support_agent"
            label="Contacto y Soporte"
            class="btn-glass"
            @click="scrollTo('contact')"
          />
        </div>

        <div class="cta-social">
          <span>Síguenos en nuestras redes sociales</span>
          <div>
            <q-btn flat round :icon="icons.facebook" aria-label="Facebook" class="social-btn" />
            <q-btn flat round :icon="icons.instagram" aria-label="Instagram" class="social-btn" />
            <q-btn flat round :icon="icons.linkedin" aria-label="LinkedIn" class="social-btn" />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="lp-footer">
      <div class="container footer-grid">
        <div>
          <div class="footer-brand">
            <span class="footer-brand__mark"><q-icon name="school" size="22px" /></span>
            ElijoHoy
          </div>
          <p>
            La plataforma de orientación vocacional. Ayudamos a estudiantes a descubrir su vocación y tomar decisiones
            informadas sobre su futuro profesional.
          </p>
          <div class="footer-legal">
            <span>Política de Privacidad</span>
            <span>Términos de Servicio</span>
          </div>
        </div>

        <div>
          <h4>Plataforma</h4>
          <router-link to="/test">Hacer Test Vocacional</router-link>
          <router-link to="/auth/login">Iniciar Sesión</router-link>
          <router-link to="/auth/registro">Crear Cuenta</router-link>
          <router-link to="/dashboard">Dashboard</router-link>
        </div>

        <div>
          <h4>Recursos</h4>
          <a href="#" @click.prevent="scrollTo('features')">Características</a>
          <a href="#" @click.prevent="scrollTo('how-it-works')">Cómo funciona</a>
          <a href="#" @click.prevent="scrollTo('faq')">Preguntas frecuentes</a>
        </div>

        <div>
          <h4>Contacto</h4>
          <p class="footer-contact"><q-icon name="email" size="18px" /> andresquilichechavez@gmail.com</p>
          <p class="footer-contact"><q-icon name="phone" size="18px" /> +51 973791654</p>
          <p class="footer-contact"><q-icon name="location_on" size="18px" /> Lima, Perú</p>
        </div>
      </div>

      <div class="container footer-bottom">
        &copy; {{ currentYear }} ElijoHoy. Todos los derechos reservados.
      </div>
    </footer>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { fabFacebook, fabInstagram, fabLinkedin } from '@quasar/extras/fontawesome-v6'
import { getAvatarUrl } from 'src/utils/avatars'

const TIPOS = [
  { codigo: 'INTJ', nombre: 'El Arquitecto' },
  { codigo: 'INTP', nombre: 'El Lógico' },
  { codigo: 'ENTJ', nombre: 'El Comandante' },
  { codigo: 'ENTP', nombre: 'El Innovador' },
  { codigo: 'INFJ', nombre: 'El Abogado' },
  { codigo: 'INFP', nombre: 'El Mediador' },
  { codigo: 'ENFJ', nombre: 'El Protagonista' },
  { codigo: 'ENFP', nombre: 'El Activista' },
  { codigo: 'ISTJ', nombre: 'El Logista' },
  { codigo: 'ISFJ', nombre: 'El Defensor' },
  { codigo: 'ESTJ', nombre: 'El Ejecutivo' },
  { codigo: 'ESFJ', nombre: 'El Cónsul' },
  { codigo: 'ISTP', nombre: 'El Virtuoso' },
  { codigo: 'ISFP', nombre: 'El Aventurero' },
  { codigo: 'ESTP', nombre: 'El Emprendedor' },
  { codigo: 'ESFP', nombre: 'El Animador' }
]

const byCode = (...codes) => codes.map(c => TIPOS.find(t => t.codigo === c))

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Muestra el elemento con una animación cuando entra en pantalla; el valor es el retraso en ms
let revealObserver = null
const reveal = {
  mounted (el, binding) {
    el.classList.add('reveal')
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)

    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      el.classList.add('is-visible')
      return
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        })
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    }
    revealObserver.observe(el)
  },
  unmounted (el) {
    revealObserver?.unobserve(el)
  }
}

export default defineComponent({
  name: 'LandingPage',
  directives: { reveal },
  setup () {
    const currentYear = computed(() => new Date().getFullYear())
    const avatarUrl = getAvatarUrl

    // Palabra rotativa del título
    const words = ['vocación', 'talento', 'pasión', 'carrera ideal']
    const wordIndex = ref(0)
    const currentWord = computed(() => words[wordIndex.value])
    let wordTimer = null

    // Partículas del hero (posiciones fijas para que no salten entre renders)
    const particles = Array.from({ length: 26 }, (_, i) => ({
      id: i,
      style: {
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53 + 11) % 100}%`,
        '--size': `${2 + (i % 3)}px`,
        animationDelay: `${(i % 7) * 0.6}s`,
        animationDuration: `${3 + (i % 5)}s`
      }
    }))

    const heroStack = byCode('ENFP', 'INTJ', 'ESFJ', 'ISTP', 'INFJ')
    const bentoAvatars = byCode('INTP', 'ENFJ', 'ESTP', 'ISFJ')
    // ENTJ no se usa sobre fondos oscuros: su imagen trae fondo blanco
    const ctaAvatars = byCode('ENTP', 'INFP', 'ESTJ', 'ISFP', 'ISTJ', 'ESFP')
    const icons = { facebook: fabFacebook, instagram: fabInstagram, linkedin: fabLinkedin }

    // Dos filas del carrusel; cada lista va duplicada para que el bucle no tenga cortes
    const firstHalf = TIPOS.slice(0, 8)
    const secondHalf = TIPOS.slice(8)
    const marqueeRows = [
      [...firstHalf, ...firstHalf],
      [...secondHalf, ...secondHalf]
    ]

    const steps = [
      {
        icon: 'quiz',
        tone: 'indigo',
        title: 'Responde preguntas estratégicas',
        text: 'Cuestionario diseñado para identificar tus fortalezas naturales, intereses genuinos y preferencias profesionales.'
      },
      {
        icon: 'analytics',
        tone: 'amber',
        title: 'Obtén tu perfil vocacional',
        text: 'Recibe un análisis detallado con recomendaciones de carreras, áreas de estudio y opciones profesionales para ti.'
      },
      {
        icon: 'explore',
        tone: 'pink',
        title: 'Explora y comparte',
        text: 'Descarga tu perfil, compártelo y úsalo para planificar estratégicamente tu futuro académico.'
      }
    ]

    const benefits = [
      {
        icon: 'school',
        tone: 'indigo',
        title: 'Para Estudiantes',
        text: 'Obtén claridad y seguridad para elegir tu carrera o estudios superiores. Elimina dudas y toma decisiones fundamentadas en tu verdadero potencial.'
      },
      {
        icon: 'family_restroom',
        tone: 'amber',
        title: 'Para Padres',
        text: 'Recibe herramientas valiosas para entender mejor a tus hijos y acompañarlos de manera efectiva en este momento crucial.'
      },
      {
        icon: 'devices',
        tone: 'pink',
        title: 'Acceso Universal',
        text: 'Accesible desde cualquier móvil, tablet o computadora, con resultados inmediatos y descargables al instante.'
      }
    ]

    const faqs = [
      {
        q: '¿Cuánto tiempo dura el test completo?',
        a: 'Aproximadamente 15 minutos para completar todas las secciones. Puedes pausar y continuar cuando gustes sin perder progreso.'
      },
      {
        q: '¿Es realmente completamente gratis?',
        a: 'Sí, el test vocacional básico es totalmente gratuito. Ofrecemos opciones premium con análisis más profundos para quien lo necesite.'
      },
      {
        q: '¿Puedo repetir el test las veces que quiera?',
        a: 'Absolutamente. Puedes realizar el test nuevamente para ver cómo evolucionan tus intereses y preferencias a lo largo del tiempo.'
      },
      {
        q: '¿Qué hago después de recibir mis resultados?',
        a: 'Te proporcionamos asesoría personalizada y recursos adicionales para que puedas seguir avanzando en tu proceso de decisión profesional.'
      }
    ]

    // Cifras con contador animado al entrar en pantalla
    const stats = [
      { value: 32, suffix: '', label: 'Preguntas' },
      { value: 16, suffix: '', label: 'Perfiles de personalidad' },
      { value: 15, suffix: ' min', label: 'Duración aproximada' },
      { value: 100, suffix: '%', label: 'Gratis' }
    ]
    const statValues = ref(stats.map(() => 0))
    const statsRef = ref(null)
    let statsObserver = null
    let statsFrame = null

    const animateStats = () => {
      if (prefersReducedMotion()) {
        statValues.value = stats.map(s => s.value)
        return
      }
      const duration = 1400
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        statValues.value = stats.map(s => Math.round(s.value * eased))
        if (t < 1) statsFrame = requestAnimationFrame(tick)
      }
      statsFrame = requestAnimationFrame(tick)
    }

    // Parallax del hero según la posición del mouse
    const heroRef = ref(null)
    const onHeroMove = (e) => {
      const el = heroRef.value
      if (!el || prefersReducedMotion()) return
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width - 0.5).toFixed(3))
      el.style.setProperty('--my', ((e.clientY - rect.top) / rect.height - 0.5).toFixed(3))
    }
    const onHeroLeave = () => {
      heroRef.value?.style.setProperty('--mx', 0)
      heroRef.value?.style.setProperty('--my', 0)
    }

    // Brillo que sigue al cursor en las tarjetas
    const onSpotlight = (e) => {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--y', `${e.clientY - rect.top}px`)
    }

    const scrollTo = (id) => {
      const el = document.getElementById(id)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - 64
      window.scrollTo({ top, behavior: 'smooth' })
    }

    onMounted(() => {
      // Limpiar TODOS los datos al entrar al landing (test, autenticación, etc.)
      localStorage.removeItem('testSesion')
      localStorage.removeItem('testRespuestas')
      localStorage.removeItem('tokenAnonimo')

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      localStorage.removeItem('user_data')
      localStorage.removeItem('user_token')
      localStorage.removeItem('idUsuario')

      if (!prefersReducedMotion()) {
        wordTimer = setInterval(() => {
          wordIndex.value = (wordIndex.value + 1) % words.length
        }, 2600)
      }

      if ('IntersectionObserver' in window && statsRef.value) {
        statsObserver = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            animateStats()
            statsObserver.disconnect()
          }
        }, { threshold: 0.4 })
        statsObserver.observe(statsRef.value)
      } else {
        statValues.value = stats.map(s => s.value)
      }
    })

    onBeforeUnmount(() => {
      clearInterval(wordTimer)
      statsObserver?.disconnect()
      if (statsFrame) cancelAnimationFrame(statsFrame)
    })

    return {
      currentYear,
      avatarUrl,
      currentWord,
      particles,
      heroStack,
      bentoAvatars,
      ctaAvatars,
      icons,
      marqueeRows,
      steps,
      benefits,
      faqs,
      stats,
      statValues,
      statsRef,
      heroRef,
      onHeroMove,
      onHeroLeave,
      onSpotlight,
      scrollTo
    }
  }
})
</script>

<style scoped>
.landing-page {
  --indigo: #6366F1;
  --indigo-600: #4F46E5;
  --indigo-800: #3730A3;
  --indigo-950: #1E1B4B;
  --amber: #F59E0B;
  --amber-light: #FDB813;
  --amber-dark: #D97706;
  --pink: #EC4899;
  --ink: #1E1B4B;
  --muted: #64748B;

  min-height: 100vh;
  overflow-x: hidden;
  color: var(--ink);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 32px);
}

.container--narrow {
  max-width: 860px;
}

.text-gradient {
  background: linear-gradient(90deg, var(--indigo) 0%, var(--pink) 50%, var(--amber) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 6s linear infinite;
}

/* ------------------------------------------------------------------ Hero */
.hero-section {
  --mx: 0;
  --my: 0;

  position: relative;
  min-height: calc(100vh - 3.5rem);
  display: flex;
  align-items: center;
  padding: clamp(48px, 8vh, 96px) 0 clamp(72px, 10vh, 120px);
  overflow: hidden;
  color: #fff;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 25%, #3730A3 50%, #1E1B4B 100%);
  background-size: 180% 180%;
  animation: gradientShift 16s ease-in-out infinite;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  will-change: transform;
}

.blob--indigo {
  width: 520px;
  height: 520px;
  top: -180px;
  left: -140px;
  background: #818CF8;
  animation: blobMove 18s ease-in-out infinite;
}

.blob--pink {
  width: 420px;
  height: 420px;
  bottom: -160px;
  right: 10%;
  background: var(--pink);
  opacity: 0.35;
  animation: blobMove 22s ease-in-out infinite reverse;
}

.blob--amber {
  width: 360px;
  height: 360px;
  top: 10%;
  right: -120px;
  background: var(--amber);
  opacity: 0.3;
  animation: blobMove 20s ease-in-out infinite 2s;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at 50% 40%, #000 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 0%, transparent 70%);
  transform: translate3d(calc(var(--mx) * 18px), calc(var(--my) * 18px), 0);
  transition: transform 0.4s ease-out;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  animation: twinkle 4s ease-in-out infinite;
}

.hero-layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(24px, 4vw, 56px);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.14);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: var(--amber-light);
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.8s ease-out both;
}

.hero-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--amber-light);
  box-shadow: 0 0 0 0 rgba(253, 184, 19, 0.7);
  animation: ping 2s ease-out infinite;
}

.hero-title {
  margin: 22px 0 18px;
  font-size: clamp(2.1rem, 4.4vw, 3.6rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  animation: fadeInUp 0.9s ease-out 0.1s both;
}

.hero-title__rotator {
  display: block;
  min-height: 1.15em;
}

.hero-title__word {
  display: inline-block;
  background: linear-gradient(90deg, #FDE68A 0%, var(--amber-light) 45%, #F472B6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: wordIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-subtitle {
  max-width: 560px;
  margin: 0 0 32px;
  font-size: clamp(1rem, 1.6vw, 1.18rem);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.85);
  animation: fadeInUp 0.9s ease-out 0.25s both;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  animation: fadeInUp 0.9s ease-out 0.4s both;
}

.btn-primary-glow,
.btn-amber {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  padding: 6px 22px;
  font-weight: 700;
  color: var(--indigo-950);
  background: linear-gradient(135deg, #FBBF24 0%, var(--amber) 50%, var(--amber-dark) 100%);
  box-shadow: 0 12px 32px -8px rgba(245, 158, 11, 0.7);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.btn-primary-glow::after,
.btn-amber::after {
  content: '';
  position: absolute;
  top: 0;
  left: -60%;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
  transform: skewX(-20deg);
  animation: shine 3.2s ease-in-out infinite;
}

.btn-primary-glow:hover,
.btn-amber:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px -8px rgba(245, 158, 11, 0.85);
}

.btn-glass {
  border-radius: 14px;
  padding: 6px 22px;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(10px);
  transition: background 0.25s ease, transform 0.25s ease;
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-3px);
}

.hero-proof {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 36px;
  animation: fadeInUp 0.9s ease-out 0.55s both;
}

.avatar-stack {
  display: flex;
}

.avatar-stack img {
  width: 44px;
  height: 44px;
  margin-left: -12px;
  padding: 3px;
  border-radius: 50%;
  object-fit: contain;
  background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
  border: 2px solid rgba(255, 255, 255, 0.9);
  transition: transform 0.25s ease;
}

.avatar-stack img:first-child {
  margin-left: 0;
}

.avatar-stack img:hover {
  transform: translateY(-6px) scale(1.08);
  z-index: 1;
}

.hero-proof__text {
  font-size: 0.95rem;
  line-height: 1.35;
}

.hero-proof__text span {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate3d(calc(var(--mx) * -26px), calc(var(--my) * -20px), 0);
  transition: transform 0.4s ease-out;
  animation: fadeInScale 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.hero-visual__halo {
  position: absolute;
  width: 78%;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(253, 184, 19, 0.35) 0%, transparent 60%),
    conic-gradient(from 0deg, rgba(99, 102, 241, 0), rgba(236, 72, 153, 0.35), rgba(99, 102, 241, 0));
  filter: blur(30px);
  animation: spin 14s linear infinite;
}

.hero-visual__img {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: auto;
  filter: drop-shadow(0 30px 50px rgba(15, 12, 50, 0.45));
  animation: float 5s ease-in-out infinite;
}

.float-chip {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--ink);
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 18px 40px -12px rgba(15, 12, 50, 0.5);
  transform: translate3d(calc(var(--mx) * 22px), calc(var(--my) * 22px), 0);
  transition: transform 0.4s ease-out;
}

.float-chip .q-icon {
  color: var(--amber);
}

.float-chip img {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  object-fit: contain;
  background: #EEF2FF;
}

.float-chip strong {
  display: block;
  font-size: 0.85rem;
  color: var(--indigo);
}

.float-chip span {
  display: block;
  font-size: 0.75rem;
  color: var(--muted);
  font-weight: 500;
}

.float-chip--top {
  top: 6%;
  left: 2%;
  animation: chipIn 0.7s ease-out 0.9s both, bob 4.5s ease-in-out 1.6s infinite;
}

.float-chip--left {
  bottom: 18%;
  left: -2%;
  animation: chipIn 0.7s ease-out 1.1s both, bob 5s ease-in-out 1.8s infinite reverse;
}

.float-chip--bottom {
  bottom: 4%;
  right: 4%;
  animation: chipIn 0.7s ease-out 1.3s both, bob 5.5s ease-in-out 2s infinite;
}

.scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 22px;
  z-index: 2;
  transform: translateX(-50%);
  padding: 6px;
  background: none;
  border: 0;
  cursor: pointer;
}

.scroll-cue__mouse {
  display: block;
  width: 26px;
  height: 42px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  position: relative;
}

.scroll-cue__mouse span {
  position: absolute;
  top: 7px;
  left: 50%;
  width: 4px;
  height: 8px;
  margin-left: -2px;
  border-radius: 2px;
  background: #fff;
  animation: scrollDot 1.8s ease-in-out infinite;
}

/* ------------------------------------------------------------------ Marquee */
.marquee-section {
  position: relative;
  padding: 28px 0;
  background: var(--indigo-950);
  overflow: hidden;
}

.marquee {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.marquee + .marquee {
  margin-top: 14px;
}

.marquee__track {
  display: flex;
  gap: 14px;
  width: max-content;
  animation: marquee 40s linear infinite;
}

.marquee--reverse .marquee__track {
  animation-direction: reverse;
  animation-duration: 46s;
}

.marquee:hover .marquee__track {
  animation-play-state: paused;
}

.type-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px 8px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.type-pill:hover {
  background: rgba(99, 102, 241, 0.3);
  border-color: rgba(165, 180, 252, 0.6);
  transform: translateY(-3px);
}

.type-pill img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.9);
  padding: 3px;
}

.type-pill__code {
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--amber-light);
}

.type-pill__name {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/* ------------------------------------------------------------------ Stats */
.stats-section {
  position: relative;
  z-index: 2;
  margin-top: -1px;
  padding: 48px 0;
  background: linear-gradient(180deg, #F8FAFC 0%, #fff 100%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  padding: 24px 16px;
  border-radius: 20px;
  text-align: center;
  background: #fff;
  border: 1px solid #E0E7FF;
  box-shadow: 0 10px 30px -18px rgba(79, 70, 229, 0.45);
}

.stat-card__value {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--indigo) 0%, var(--indigo-800) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-card__value span {
  font-size: 0.5em;
  margin-left: 2px;
}

.stat-card__label {
  margin-top: 8px;
  font-size: 0.9rem;
  color: var(--muted);
}

/* ------------------------------------------------------------------ Secciones */
.section {
  padding: clamp(64px, 10vh, 112px) 0;
}

.section--light {
  background: #fff;
}

.section--tint {
  background: linear-gradient(180deg, #EEF2FF 0%, #F5F3FF 100%);
}

.section-head {
  max-width: 720px;
  margin: 0 auto clamp(36px, 6vh, 56px);
  text-align: center;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: var(--indigo);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.section-title {
  margin: 16px 0 12px;
  font-size: clamp(1.8rem, 3.6vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: var(--ink);
}

.section-subtitle {
  margin: 0;
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.6;
  color: var(--muted);
}

/* Tarjetas con brillo que sigue al cursor */
.spot-card {
  --x: 50%;
  --y: 50%;

  position: relative;
  overflow: hidden;
  padding: 28px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid #E5E7EB;
  box-shadow: 0 10px 30px -20px rgba(30, 27, 75, 0.35);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
}

.spot-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(420px circle at var(--x) var(--y), rgba(99, 102, 241, 0.12), transparent 45%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.spot-card:hover {
  transform: translateY(-6px);
  border-color: rgba(99, 102, 241, 0.35);
  box-shadow: 0 24px 50px -24px rgba(79, 70, 229, 0.45);
}

.spot-card:hover::before {
  opacity: 1;
}

.spot-card h3 {
  margin: 18px 0 10px;
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--ink);
}

.spot-card p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--muted);
}

.spot-card__icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.spot-card:hover .spot-card__icon {
  transform: rotate(-8deg) scale(1.08);
}

.spot-card__icon--amber {
  background: #FEF3C7;
  color: var(--amber-dark);
}

.spot-card__icon--pink {
  background: #FCE7F3;
  color: #DB2777;
}

.spot-card__icon--indigo {
  background: #E0E7FF;
  color: var(--indigo-600);
}

.spot-card__link {
  margin: 18px 0 0 -10px;
  color: var(--indigo);
  font-weight: 700;
}

.spot-card__link :deep(.q-icon) {
  transition: transform 0.25s ease;
}

.spot-card__link:hover :deep(.q-icon) {
  transform: translateX(4px);
}

.bento {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;
}

.bento__main {
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #fff 0%, #EEF2FF 100%);
}

.bento__main .spot-card__link {
  align-self: flex-start;
}

.bento__list {
  display: grid;
  gap: 12px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.bento__list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--ink);
}

.bento__list .q-icon {
  color: #10B981;
}

.bento__avatars {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: auto;
  padding-top: 28px;
}

.bento__avatars img {
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  object-fit: contain;
  padding: 8px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #E0E7FF;
  animation: bob 4s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.4s);
}

/* Timeline */
.timeline {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.timeline__line {
  position: absolute;
  top: 40px;
  left: 16.66%;
  right: 16.66%;
  height: 3px;
  border-radius: 3px;
  background: rgba(99, 102, 241, 0.15);
  overflow: hidden;
}

.timeline__line span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--indigo), var(--amber), var(--pink));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1.4s cubic-bezier(0.65, 0, 0.35, 1) 0.3s;
}

.timeline.is-visible .timeline__line span {
  transform: scaleX(1);
}

.timeline__step {
  position: relative;
  text-align: center;
  padding: 0 8px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--step-delay);
}

.timeline.is-visible .timeline__step {
  opacity: 1;
  transform: none;
}

.timeline__icon {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 16px 34px -14px currentColor;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline__step:hover .timeline__icon {
  transform: translateY(-6px) rotate(-6deg);
}

.timeline__icon--indigo {
  background: linear-gradient(135deg, #818CF8, var(--indigo-600));
}

.timeline__icon--amber {
  background: linear-gradient(135deg, #FBBF24, var(--amber-dark));
}

.timeline__icon--pink {
  background: linear-gradient(135deg, #F472B6, #DB2777);
}

.timeline__num {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--indigo-950);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #EEF2FF;
}

.timeline__step h3 {
  margin: 22px 0 10px;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ink);
}

.timeline__step p {
  margin: 0;
  line-height: 1.65;
  color: var(--muted);
}

/* Beneficios */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

/* FAQ */
.faq-list {
  display: grid;
  gap: 12px;
}

.faq-item {
  border-radius: 18px;
  background: #fff;
  border: 1px solid #E0E7FF;
  overflow: hidden;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}

.faq-item:hover {
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 14px 30px -20px rgba(79, 70, 229, 0.5);
}

.faq-item :deep(.faq-item__header) {
  padding: 18px 22px;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ink);
}

.faq-item :deep(.q-expansion-item__toggle-icon) {
  color: var(--indigo);
}

.faq-item__body {
  padding: 0 22px 20px;
  line-height: 1.7;
  color: var(--muted);
}

.faq-help {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 36px;
  color: var(--muted);
  font-size: 1.05rem;
}

.faq-help__btn {
  border-radius: 12px;
  color: var(--indigo);
  font-weight: 700;
}

/* ------------------------------------------------------------------ CTA */
.cta-section {
  position: relative;
  overflow: hidden;
  padding: clamp(80px, 12vh, 128px) 0;
  color: #fff;
  text-align: center;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 25%, #3730A3 50%, #1E1B4B 100%);
  background-size: 200% 200%;
  animation: gradientShift 14s ease-in-out infinite;
}

.cta-floaters {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cta-floater {
  position: absolute;
  width: clamp(64px, 8vw, 110px);
  height: auto;
  opacity: 0.9;
  filter: drop-shadow(0 16px 24px rgba(15, 12, 50, 0.45));
  animation: float 6s ease-in-out infinite;
}

.cta-floater--1 { top: 12%; left: 6%; animation-delay: 0s; }
.cta-floater--2 { top: 58%; left: 3%; animation-delay: 1.2s; }
.cta-floater--3 { bottom: 8%; left: 18%; animation-delay: 2.1s; }
.cta-floater--4 { top: 10%; right: 7%; animation-delay: 0.6s; }
.cta-floater--5 { top: 55%; right: 3%; animation-delay: 1.8s; }
.cta-floater--6 { bottom: 6%; right: 19%; animation-delay: 2.6s; }

.cta-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
}

.cta-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--amber-light);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: pulseRing 2.6s ease-out infinite;
}

.cta-content h2 {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.cta-content h3 {
  margin: 10px 0 18px;
  font-size: clamp(1.15rem, 2.2vw, 1.5rem);
  font-weight: 600;
  color: var(--amber-light);
}

.cta-content p {
  margin: 0 auto 34px;
  max-width: 640px;
  font-size: 1.08rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}

.cta-social {
  margin-top: 40px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.cta-social > div {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.social-btn {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  transition: transform 0.25s ease, background 0.25s ease;
}

.social-btn:hover {
  transform: translateY(-3px) scale(1.08);
  background: rgba(255, 255, 255, 0.18);
}

/* ------------------------------------------------------------------ Footer */
.lp-footer {
  width: 100%;
  padding: 64px 0 28px;
  background: #0F0D2E;
  color: rgba(255, 255, 255, 0.65);
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr) minmax(0, 0.9fr) minmax(0, 1.4fr);
  gap: 36px;
}

.footer-grid h4 {
  margin: 0 0 14px;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.footer-grid p {
  margin: 0 0 10px;
  font-size: 0.92rem;
  line-height: 1.6;
}

.footer-grid a {
  display: block;
  width: fit-content;
  margin-bottom: 10px;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}

.footer-grid a:hover {
  color: var(--amber-light);
  transform: translateX(4px);
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
}

.footer-brand__mark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--indigo), var(--indigo-800));
}

.footer-legal {
  margin-top: 16px;
}

.footer-legal span {
  display: block;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
}

.footer-contact {
  display: flex;
  align-items: center;
  gap: 8px;
  word-break: break-word;
}

.footer-bottom {
  margin-top: 40px;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
}

/* ------------------------------------------------------------------ Aparición al hacer scroll */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}

/* La tarjeta ya tiene su propia transición al pasar el mouse */
.spot-card.reveal.is-visible {
  transition-delay: 0ms;
}

.spot-card.reveal.is-visible:hover {
  transform: translateY(-6px);
}

/* ------------------------------------------------------------------ Keyframes */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes wordIn {
  from { opacity: 0; transform: translateY(0.45em); filter: blur(8px); }
  to { opacity: 1; transform: none; filter: none; }
}

@keyframes blobMove {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(60px, 40px) scale(1.1); }
  66% { transform: translate(-40px, 30px) scale(0.95); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.15; transform: scale(0.8); }
  50% { opacity: 0.9; transform: scale(1.2); }
}

@keyframes ping {
  0% { box-shadow: 0 0 0 0 rgba(253, 184, 19, 0.7); }
  80%, 100% { box-shadow: 0 0 0 10px rgba(253, 184, 19, 0); }
}

@keyframes shine {
  0%, 60% { left: -60%; }
  100% { left: 130%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}

@keyframes bob {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -8px; }
}

@keyframes chipIn {
  from { opacity: 0; scale: 0.8; }
  to { opacity: 1; scale: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes scrollDot {
  0% { opacity: 0; transform: translateY(0); }
  40% { opacity: 1; }
  80%, 100% { opacity: 0; transform: translateY(14px); }
}

@keyframes marquee {
  to { transform: translateX(calc(-50% - 7px)); }
}

@keyframes pulseRing {
  0% { box-shadow: 0 0 0 0 rgba(253, 184, 19, 0.45); }
  80%, 100% { box-shadow: 0 0 0 22px rgba(253, 184, 19, 0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInScale {
  from { opacity: 0; scale: 0.92; }
  to { opacity: 1; scale: 1; }
}

/* ------------------------------------------------------------------ Responsive */
@media (max-width: 1023px) {
  .hero-section {
    min-height: auto;
  }

  .hero-layout {
    grid-template-columns: minmax(0, 1fr);
    text-align: center;
  }

  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions,
  .hero-proof {
    justify-content: center;
  }

  .hero-visual__img {
    max-width: 460px;
  }

  .scroll-cue {
    display: none;
  }

  .bento {
    grid-template-columns: minmax(0, 1fr);
  }

  .bento__main {
    grid-row: auto;
  }

  .benefits-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .timeline {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .timeline__line {
    display: none;
  }

  .float-chip--left {
    display: none;
  }

  .float-chip {
    font-size: 0.75rem;
    padding: 8px 10px;
  }

  .hero-actions .q-btn {
    width: 100%;
  }

  .cta-floater--2,
  .cta-floater--5 {
    display: none;
  }

  .cta-floater {
    opacity: 0.35;
  }

  .footer-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .landing-page *,
  .landing-page *::before,
  .landing-page *::after {
    animation: none !important;
    transition: none !important;
  }

  .reveal,
  .timeline__step {
    opacity: 1 !important;
    transform: none !important;
  }

  .timeline__line span {
    transform: scaleX(1);
  }
}
</style>
