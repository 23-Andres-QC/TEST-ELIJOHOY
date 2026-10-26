<template>
  <q-page class="test-page">
    <div class="container">
      <!-- Header con título y progreso general -->
      <div class="test-header">
        <h1 class="test-title">Test de Personalidad</h1>
        <div class="progress-info">
          <div class="progress-text">
            Página <strong>{{ paginaActual + 1 }}</strong> de <strong>{{ totalPaginas }}</strong>
            <span class="progress-count">&nbsp;· {{ respondidas }}/{{ preguntas.length }} respondidas</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar__fill" :style="{ width: progreso + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Contenedor de preguntas -->
      <div v-if="!loading && preguntasPagina.length > 0" class="questions-container">
        <div
          v-for="(pregunta, index) in preguntasPagina"
          :key="pregunta.id_pregunta"
          class="question-card"
        >
          <div class="question-number">{{ (paginaActual * 3) + index + 1 }}</div>

          <div class="question-options">
            <div class="option-label left">{{ pregunta.texto_izquierda }}</div>

            <!-- Selector de bolitas -->
            <div class="bubbles-selector">
              <div
                v-for="valor in 5"
                :key="valor"
                class="bubble"
                :class="{ selected: getRespuesta(pregunta.id_pregunta) === valor }"
                :style="{
                  width: BUBBLE_SIZES[valor - 1] + 'px',
                  height: BUBBLE_SIZES[valor - 1] + 'px'
                }"
                @click="seleccionarRespuesta(pregunta.id_pregunta, valor)"
              >
                <div class="bubble-inner"></div>
              </div>
            </div>

            <div class="option-label right">{{ pregunta.texto_derecha }}</div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <q-spinner color="purple-7" size="60px" />
        <p>Cargando test...</p>
      </div>

      <!-- Botones de navegación -->
      <div class="navigation-buttons">
        <q-btn
          v-if="paginaActual > 0"
          unelevated
          color="grey-6"
          label="Anterior"
          icon="arrow_back"
          @click="paginaAnterior"
          class="nav-btn"
          no-caps
        />
        <div v-else></div>

        <q-btn
          v-if="paginaActual < totalPaginas - 1"
          unelevated
          color="purple-7"
          label="Siguiente"
          icon-right="arrow_forward"
          @click="paginaSiguiente"
          :disable="!paginaCompleta"
          class="nav-btn"
          no-caps
        />
        <q-btn
          v-else
          unelevated
          color="positive"
          label="Finalizar Test"
          icon-right="check_circle"
          @click="finalizar"
          :disable="!todasRespondidas"
          class="nav-btn finish-btn"
          no-caps
        />
      </div>

      <!-- Error Notification se maneja programáticamente -->
      <div v-if="error" class="error-notification">
        <q-banner class="text-white bg-red-8" rounded>
          <template v-slot:avatar>
            <q-icon name="error" />
          </template>
          {{ errorMessage }}
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from 'src/stores/test'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const router = useRouter()
const testStore = useTestStore()
const authStore = useAuthStore()
const $q = useQuasar()

const loading = ref(false)
const preguntas = ref([])
const respuestas = ref({})
const paginaActual = ref(0)
const error = ref(false)
const errorMessage = ref('')

const PREGUNTAS_POR_PAGINA = 3
// Tamaños crecientes de izquierda a derecha: 1→2→3→4→5
const BUBBLE_SIZES = [26, 31, 36, 41, 46]

const totalPaginas = computed(() => Math.ceil(preguntas.value.length / PREGUNTAS_POR_PAGINA))

const preguntasPagina = computed(() => {
  const inicio = paginaActual.value * PREGUNTAS_POR_PAGINA
  const fin = inicio + PREGUNTAS_POR_PAGINA
  return preguntas.value.slice(inicio, fin)
})

const paginaCompleta = computed(() => {
  return preguntasPagina.value.every(p => respuestas.value[p.id_pregunta])
})

const todasRespondidas = computed(() => {
  return preguntas.value.every(p => respuestas.value[p.id_pregunta])
})

const respondidas = computed(() => preguntas.value.filter(p => respuestas.value[p.id_pregunta]).length)

const progreso = computed(() => (preguntas.value.length ? (respondidas.value / preguntas.value.length) * 100 : 0))

async function finalizarTestAutomaticamente() {
  console.log('Iniciando finalización automática del test...')

  // Para la finalización automática, confiamos en que las respuestas están completas
  // ya que el usuario completó el test antes de ir al login
  const respuestasGuardadas = localStorage.getItem('testRespuestas')
  if (!respuestasGuardadas) {
    throw new Error('No hay respuestas guardadas')
  }

  const respuestasParseadas = JSON.parse(respuestasGuardadas)
  const cantidadRespuestas = Object.keys(respuestasParseadas).length
  console.log(`Respuestas encontradas: ${cantidadRespuestas}`)

  // Verificar que hay al menos 32 respuestas (el test tiene 32 preguntas)
  if (cantidadRespuestas < 32) {
    throw new Error(`Test incompleto: ${cantidadRespuestas}/32 respuestas`)
  }

  try {
    // Verificar autenticación
    if (!authStore.isAuthenticated) {
      throw new Error('Usuario no autenticado')
    }

    // Crear sesión si no existe
    if (!testStore.getSesion) {
      console.log('Creando sesión de test...')
      const sesionResponse = await testStore.iniciarTest()
      if (!sesionResponse.success) {
        throw new Error('Error al crear sesión de test')
      }
    }

    // Sincronizar respuestas
    console.log('Sincronizando respuestas...')
    const sincronizacionResponse = await testStore.sincronizarRespuestas(respuestasParseadas)

    if (sincronizacionResponse.success) {
      console.log('Respuestas sincronizadas exitosamente')
      localStorage.removeItem('testRespuestas')
    } else {
      throw new Error('Error al sincronizar respuestas')
    }

    // Finalizar test
    console.log('Finalizando test...')
    const response = await testStore.finalizarTest()

    if (response.success) {
      console.log('Test finalizado exitosamente, redirigiendo a resultados...')

      $q.notify({
        type: 'positive',
        message: '¡Test completado! Redirigiendo a tus resultados...',
        icon: 'check_circle'
      })

      // Redirigir a resultados
      router.push({
        name: 'test-resultados',
        params: { id: testStore.getSesion.id_sesion }
      })
    } else {
      throw new Error(response.message || 'Error al finalizar el test')
    }
  } catch (err) {
    console.error('Error en finalización automática:', err)
    throw err
  }
}

function getRespuesta(idPregunta) {
  return respuestas.value[idPregunta] || null
}

function seleccionarRespuesta(idPregunta, valor) {
  respuestas.value[idPregunta] = valor
  // Guardar respuesta SOLO en localStorage (no en BD hasta que se registre/loguee)
  localStorage.setItem('testRespuestas', JSON.stringify(respuestas.value))
  console.log('Respuesta guardada en localStorage:', idPregunta, valor)
}

function paginaSiguiente() {
  if (paginaCompleta.value && paginaActual.value < totalPaginas.value - 1) {
    paginaActual.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function paginaAnterior() {
  if (paginaActual.value > 0) {
    paginaActual.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function finalizar() {
  if (!todasRespondidas.value) {
    error.value = true
    errorMessage.value = 'Debes responder todas las preguntas antes de finalizar el test.'
    return
  }

  try {
    loading.value = true

    // Verificar si está autenticado
    if (!authStore.isAuthenticated) {
      loading.value = false

      // Mostrar diálogo obligando a iniciar sesión
      $q.dialog({
        title: 'Iniciar Sesión Requerido',
        message: 'Para guardar tus resultados y acceder a ellos en el futuro, debes iniciar sesión o crear una cuenta.',
        persistent: true,
        ok: {
          label: 'Iniciar Sesión',
          color: 'primary',
          noCaps: true
        },
        cancel: {
          label: 'Crear Cuenta',
          color: 'secondary',
          noCaps: true,
          flat: true
        }
      }).onOk(() => {
        // Marcar que viene desde el test para finalizar automáticamente después
        localStorage.setItem('pendingTestFinalization', 'true')
        router.push('/auth/login')
      }).onCancel(() => {
        // Marcar que viene desde el test para finalizar automáticamente después
        localStorage.setItem('pendingTestFinalization', 'true')
        router.push('/auth/registro')
      })
      return
    }

    // Si está autenticado, verificar si necesita crear sesión y sincronizar
    if (authStore.isAuthenticated) {
      // Si no tiene sesión activa, crear una y sincronizar respuestas
      if (!testStore.getSesion) {
        console.log('Creando sesión y sincronizando respuestas antes de finalizar...')

        try {
          // 1. Crear sesión de test
          const sesionResponse = await testStore.iniciarTest()
          if (!sesionResponse.success) {
            throw new Error('Error al crear sesión de test')
          }

          // 2. Sincronizar respuestas del ESTADO actual a la BD
          if (Object.keys(respuestas.value).length > 0) {
            console.log('Sincronizando respuestas:', Object.keys(respuestas.value).length)
            const sincronizacionResponse = await testStore.sincronizarRespuestas(respuestas.value)

            if (sincronizacionResponse.success) {
              console.log('Respuestas sincronizadas exitosamente')
              // Limpiar localStorage después de sincronizar
              localStorage.removeItem('testRespuestas')
            } else {
              throw new Error('Error al sincronizar respuestas')
            }
          }
        } catch (syncError) {
          console.error('Error en sincronización:', syncError)
          error.value = true
          errorMessage.value = 'Error al guardar el test. Intenta nuevamente.'
          return
        }
      }

      // Finalizar test normalmente
      const response = await testStore.finalizarTest()

      if (response.success) {
        $q.notify({
          type: 'positive',
          message: 'Test completado exitosamente'
        })

        // Redirigir a resultados usando el ID de sesión de la respuesta
        router.push({
          name: 'test-resultados',
          params: { id: response.id_sesion }
        })
      } else {
        throw new Error(response.message || 'Error al finalizar el test')
      }
    }
  } catch (error) {
    if (error.message === 'REQUIERE_AUTH') {
      // Ya se manejó arriba
      return
    }
    error.value = true
    errorMessage.value = error.message || 'Error al finalizar el test.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  console.log('🚀 TestPage onMounted - Iniciando carga del test')

  // Asegurar que el authStore esté inicializado
  authStore.initializeAuth()

  console.log('🔐 Estado de autenticación:', authStore.isAuthenticated)
  console.log('👤 Usuario:', authStore.user)
  console.log('🔑 Token en sessionStorage:', sessionStorage.getItem('access_token') ? 'Presente' : 'Ausente')

  try {
    loading.value = true

    // Cargar preguntas
    console.log('📚 Cargando preguntas...')
    const respPreguntas = await testStore.cargarPreguntas();
    console.log('Respuesta del API preguntas:', respPreguntas);
    if (respPreguntas.success) {
      preguntas.value = respPreguntas.preguntas;
      console.log('Preguntas cargadas:', preguntas.value.length);
    }

    // Si el usuario está autenticado, verificar si ya tiene una sesión activa
    if (authStore.isAuthenticated && !testStore.getSesion) {
      console.log('✅ Usuario autenticado, verificando sesiones existentes...')
      try {
        const sesionesResponse = await testStore.cargarMisSesiones()
        console.log('Respuesta sesiones:', sesionesResponse)
        if (sesionesResponse.success && sesionesResponse.sesiones.length > 0) {
          // Buscar la sesión más reciente que no esté completada
          const sesionActiva = sesionesResponse.sesiones.find(s => !s.completado)
          if (sesionActiva) {
            console.log('Sesión activa encontrada:', sesionActiva)
            // Cargar respuestas de la sesión activa
            testStore.sesionActual = sesionActiva
            // Aquí podrías cargar las respuestas existentes de la BD si fuera necesario
          }
        }
      } catch (error) {
        console.log('No hay sesiones existentes o error al cargar:', error.message)
      }
    } else if (!authStore.isAuthenticated) {
      // Si no está autenticado, intentar restaurar sesión local
      console.log('👤 Usuario no autenticado, intentando restaurar sesión local...')
      testStore.restaurarSesion()
    }

    // Cargar respuestas guardadas en localStorage si existen
    const respuestasGuardadas = localStorage.getItem('testRespuestas')
    if (respuestasGuardadas) {
      respuestas.value = JSON.parse(respuestasGuardadas)
      console.log('Respuestas restauradas de localStorage:', respuestas.value)
      // Sincronizar progreso en el store
      testStore.respuestas = respuestas.value
      testStore.progreso = Object.keys(respuestas.value).length
      console.log('Progreso sincronizado:', testStore.progreso)
    }

    // Verificar si hay una finalización de test pendiente
    const pendingFinalization = localStorage.getItem('pendingTestFinalization')
    if (pendingFinalization === 'true' && authStore.isAuthenticated) {
      console.log('Finalización de test pendiente detectada, procediendo automáticamente...')

      // Limpiar el indicador ANTES de procesar para evitar bucles
      localStorage.removeItem('pendingTestFinalization')

      // Verificar que hay respuestas
      if (respuestasGuardadas && Object.keys(respuestas.value).length > 0) {
        // Proceder con la finalización automática
        try {
          loading.value = true
          await finalizarTestAutomaticamente()
        } catch (err) {
          console.error('Error en finalización automática:', err)
          loading.value = false
          $q.notify({
            type: 'negative',
            message: 'Error al finalizar el test. Por favor presiona "Finalizar Test".',
            icon: 'error'
          })
        }
      } else {
        console.warn('No hay respuestas guardadas para finalizar')
        $q.notify({
          type: 'warning',
          message: 'No se encontraron respuestas del test. Complete el test nuevamente.',
          icon: 'warning'
        })
      }
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Error al cargar el test'
    })
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.test-page {
  background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
  min-height: calc(100vh - 64px);
  padding: clamp(12px, 3vh, 28px) 16px;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1040px;
  width: 100%;
  margin: 0 auto;
}

/* Header: título y progreso en una sola franja */
.test-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 32px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.test-title {
  margin: 0;
  font-size: clamp(1.4rem, 2.6vw, 1.85rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progress-info {
  flex: 1;
  min-width: 240px;
  max-width: 420px;
}

.progress-text {
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  text-align: right;
}

.progress-text strong {
  color: #6366F1;
}

.progress-count {
  font-weight: 500;
  color: #64748B;
}

.progress-bar {
  height: 8px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.15);
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #6366F1, #EC4899);
  transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Preguntas */
.questions-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 6px 20px -10px rgba(30, 27, 75, 0.25);
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}

.question-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 12px 28px -12px rgba(79, 70, 229, 0.35);
}

.question-number {
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #6366F1, #EC4899);
}

.question-options {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 16px;
}

.option-label {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1.35;
  color: #1F2937;
  text-align: center;
  text-transform: none !important;
}

.option-label.left {
  background: rgba(99, 102, 241, 0.08);
  border-left: 3px solid rgba(99, 102, 241, 0.5);
}

.option-label.right {
  background: rgba(245, 158, 11, 0.1);
  border-right: 3px solid rgba(245, 158, 11, 0.55);
}

/* Burbujas - escala 1 (pequeña) a 5 (grande) */
.bubbles-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 4px;
}

.bubble {
  flex: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);
  border: 2px solid rgba(148, 163, 184, 0.45);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.bubble:hover {
  transform: scale(1.12);
  border-color: rgba(99, 102, 241, 0.6);
  background: linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%);
}

.bubble.selected {
  transform: scale(1.12);
  border-color: #fff;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.35), 0 6px 16px rgba(79, 70, 229, 0.45);
}

.bubble-inner {
  width: 36%;
  height: 36%;
  border-radius: 50%;
  background: transparent;
  transition: background 0.2s ease, transform 0.2s ease;
}

.bubble.selected .bubble-inner {
  background: #fff;
}

/* Loading */
.loading-container {
  padding: 48px;
  border-radius: 18px;
  text-align: center;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 6px 20px -10px rgba(30, 27, 75, 0.25);
}

.loading-container p {
  margin: 16px 0 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #6366F1;
}

/* Navegación */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
}

.nav-btn {
  padding: 8px 26px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px -10px rgba(79, 70, 229, 0.6);
}

.finish-btn {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: #fff;
}

.error-notification {
  margin-top: 16px;
}

/* Responsive */
@media (max-width: 860px) {
  .question-card {
    align-items: flex-start;
  }

  .question-options {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;
  }

  .bubbles-selector {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}

@media (max-width: 600px) {
  .test-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .progress-info {
    max-width: none;
  }

  .progress-text {
    text-align: left;
  }

  .question-card {
    padding: 12px;
    gap: 10px;
  }

  .question-number {
    width: 26px;
    height: 26px;
    font-size: 0.78rem;
  }

  .option-label {
    padding: 8px 10px;
    font-size: 0.9rem;
  }

  .bubbles-selector {
    gap: 10px;
  }

  .navigation-buttons {
    flex-direction: column-reverse;
  }

  .nav-btn {
    width: 100%;
  }
}
</style>
