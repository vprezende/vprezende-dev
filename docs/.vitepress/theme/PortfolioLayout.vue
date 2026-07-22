<script setup>
import { useData } from 'vitepress'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faGraduationCap, 
  faGlobe, 
  faEnvelope, 
  faMapMarkerAlt, 
  faUser, 
  faBriefcase,
  faUniversity,
  faCode,
  faLaptopCode,
  faDatabase,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons'
import { 
  Terminal, 
  ChevronDown, 
  Menu, 
  X, 
  Clock, 
  ExternalLink,
  ArrowUp
} from 'lucide-vue-next'

// Import English content data loaders
import { data as experiencesEn } from '../../en/experience.data.js'
import { data as projectsEn } from '../../en/projects.data.js'
import { data as skillsEn } from '../../en/skills.data.js'
import { data as aboutEn } from '../../en/about.data.js'
import { data as contactEn } from '../../en/contact.data.js'

// Import Portuguese content data loaders
import { data as experiencesPt } from '../../pt/experience.data.js'
import { data as projectsPt } from '../../pt/projects.data.js'
import { data as skillsPt } from '../../pt/skills.data.js'
import { data as aboutPt } from '../../pt/about.data.js'
import { data as contactPt } from '../../pt/contact.data.js'

const { lang, frontmatter } = useData()

const dictionary = computed(() => frontmatter.value)
const skillsData = computed(() => lang.value === 'pt' ? skillsPt : skillsEn)
const aboutData = computed(() => lang.value === 'pt' ? aboutPt : aboutEn)
const contactData = computed(() => lang.value === 'pt' ? contactPt : contactEn)
const experiences = computed(() => lang.value === 'pt' ? experiencesPt : experiencesEn)
const projects = computed(() => lang.value === 'pt' ? projectsPt : projectsEn)
const projectsList = computed(() => projects.value?.list || [])
const projectsStatus = computed(() => projects.value?.status || {} )

const isMenuOpen = ref(false)
const isLangMenuOpen = ref(false)
const activeSection = ref('home')
const showScrollTop = ref(false)
const hasProjects = computed(() => projectsList.value && projectsList.value.length > 0)
const navOrder = computed(() => {
  const order = ['home', 'about', 'skills', 'experience', 'projects', 'contact']
  return hasProjects.value ? order : order.filter(item => item !== 'projects')
})

const toggleLang = () => {
  const currentPath = window.location.pathname
  if (lang.value === 'pt') {
    window.location.href = currentPath.replace('/pt/', '/en/')
  } else {
    window.location.href = currentPath.replace('/en/', '/pt/')
  }
}

const selectLang = (targetLang) => {
  isLangMenuOpen.value = false
  const currentPath = window.location.pathname
  if (targetLang === 'pt') {
    window.location.href = currentPath.replace('/en/', '/pt/')
  } else {
    window.location.href = currentPath.replace('/pt/', '/en/')
  }
}

const setIsLangMenuOpen = (value) => {
  isLangMenuOpen.value = value
}

const isScrolling = ref(false)

const scrollTo = (id) => {
  isMenuOpen.value = false
  activeSection.value = id
  isScrolling.value = true
  
  const target = document.getElementById(id)
  if (!target) return
  
  const headerOffset = 80
  const elementPosition = target.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.scrollY - headerOffset
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })

  setTimeout(() => {
    isScrolling.value = false
  }, 800)
}

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Custom Cursor variables
const cursorRef = ref(null)

let observer = null

onMounted(() => {
  const cursor = cursorRef.value

  const moveCursor = (e) => {
    if (cursor) {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
      cursor.style.opacity = 1
    }
  }

  const hideCursor = () => {
    if (cursor) cursor.style.opacity = 0
  }

  window.addEventListener('mousemove', moveCursor)
  window.addEventListener('mouseout', hideCursor)
  window.addEventListener('mouseover', moveCursor)
  
  // Intersection Observer for scroll spring animations (resets when off-screen)
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-animated')
      } else {
        entry.target.classList.remove('show-animated')
      }
    })
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el)
  })

  // Watch scroll positions for active nav state
  const handleScroll = () => {
    if (isScrolling.value) return

    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    showScrollTop.value = scrollY > 500

    let current = 'home'
    for (const section of navOrder.value) {
      const el = document.getElementById(section)
      if (el && scrollY >= (el.offsetTop - 150)) {
        current = section
      }
    }

    const isAtBottom = windowHeight + scrollY >= documentHeight - 50
    if (isAtBottom) {
      const projectsEl = document.getElementById('projects')
      if (projectsEl) {
        const targetPosition = projectsEl.offsetTop - 80
        if (Math.abs(scrollY - targetPosition) < 20) {
          current = 'projects'
        } else {
          current = 'contact'
        }
      } else {
        current = 'contact'
      }
    }

    activeSection.value = current
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  
  onUnmounted(() => {
    window.removeEventListener('mousemove', moveCursor)
    window.removeEventListener('mouseout', hideCursor)
    window.removeEventListener('mouseover', moveCursor)
    window.removeEventListener('scroll', handleScroll)
    if (observer) {
      observer.disconnect()
    }
  })
})
</script>

<template>
  <div class="portfolio-root">
    
    <!-- Custom Cursor (Desktops only) -->
    <div 
      ref="cursorRef"
      class="custom-cursor"
    />

    <!-- Grainy Noise Background & Gradient Overlay -->
    <div class="bg-overlay-container">
      <div class="radial-gradient-bg" />
      <div class="grainy-noise-bg" />
    </div>

    <!-- --- NAVBAR --- -->
    <nav class="navbar">
      <div class="nav-wrapper">
        
        <!-- Logo -->
        <div
          class="nav-logo"
          @click="scrollTo('home')"
        >
          <Terminal style="width: 1.25rem; height: 1.25rem;" />
          <span>VR.DEV</span>
        </div>

        <!-- Desktop Navigation Items -->
        <div class="nav-desktop-menu">
          <button
            v-for="sec in navOrder"
            :key="sec"
            @click="scrollTo(sec)"
            class="nav-item-btn"
            :class="{ active: activeSection === sec }"
          >
            {{ dictionary.nav[sec] }}
          </button>

           <!-- Language Selector -->
          <div class="lang-selector-wrapper">
            <button
              @click="setIsLangMenuOpen(!isLangMenuOpen)"
              class="lang-selector-btn"
            >
              <font-awesome-icon :icon="faGlobe" style="width: 1rem; height: 1rem;" />
              <span>{{ lang === 'en' ? 'English' : 'Português' }}</span>
              <ChevronDown style="width: 1rem; height: 1rem; transition: transform 0.2s;" :class="{ 'rotate-180': isLangMenuOpen }" />
            </button>

            <!-- Dropdown -->
            <transition name="fade">
              <div 
                v-if="isLangMenuOpen" 
                class="lang-dropdown"
              >
                <button
                  @click="selectLang('en')"
                  class="lang-dropdown-item"
                  :class="{ active: lang === 'en' }"
                >
                  English
                </button>
                <button
                  @click="selectLang('pt')"
                  class="lang-dropdown-item"
                  :class="{ active: lang === 'pt' }"
                >
                  Português
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- Mobile Toggles -->
        <div class="nav-mobile-toggles">
          <button 
            @click="toggleLang"
            class="mobile-lang-btn"
          >
            {{ lang.toUpperCase() }}
          </button>
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="mobile-menu-btn"
          >
            <X v-if="isMenuOpen" style="width: 1.5rem; height: 1.5rem;" />
            <Menu v-else style="width: 1.5rem; height: 1.5rem;" />
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      <transition name="slide">
        <div 
          v-if="isMenuOpen" 
          class="nav-mobile-dropdown"
        >
          <div class="mobile-menu-wrapper">
            <button
              v-for="sec in navOrder"
              :key="sec"
              @click="scrollTo(sec)"
              class="mobile-menu-item"
              :class="{ active: activeSection === sec }"
            >
              {{ dictionary.nav[sec] }}
            </button>
          </div>
        </div>
      </transition>
    </nav>

    <!-- --- HERO SECTION --- -->
    <section id="home" class="hero-section">
      <div class="hero-content">
        
        <!-- Available Badge (Spring Scale) -->
        <div class="animate-on-scroll anim-badge hero-badge">
          <span class="pulse-dot" />
          {{ lang === 'pt' ? 'Disponível para Projetos' : 'Available for Projects' }}
        </div>

        <h1 class="animate-on-scroll anim-slide-up hero-title">
          Vinícius <span>Rezende</span>
        </h1>

        <h2 class="animate-on-scroll anim-slide-up hero-subtitle" style="animation-delay: 100ms">
          &lt; {{ dictionary.hero.role }} /&gt;
        </h2>

        <p class="animate-on-scroll anim-fade hero-desc" style="animation-delay: 200ms">
          {{ dictionary.hero.subtitle }}
        </p>

        <!-- CTA Buttons -->
        <div class="animate-on-scroll anim-slide-up hero-actions" style="animation-delay: 300ms">
          <button 
            v-if="hasProjects"
            @click="scrollTo('projects')" 
            class="magical-button hero-btn-primary"
          >
            {{ dictionary.hero.cta_primary }}
          </button>
          <button 
            @click="scrollTo('contact')" 
            class="magical-button hero-btn-secondary"
          >
            {{ dictionary.hero.cta_secondary }}
          </button>
        </div>
      </div>
    </section>

    <!-- --- ABOUT --- -->
    <section id="about" class="about-section">
      <div class="about-wrapper">
        <div class="about-grid">
          
          <!-- Perfil Card (Staggered Delay 1) -->
          <div class="animate-on-scroll anim-slide-up about-profile-col" style="animation-delay: 100ms">
            <div class="profile-glow"></div>
            <div class="profile-card">
              
              <div class="profile-header">
        <div class="avatar-container avatar-spin">
                  <svg style="width: 2.25rem; height: 2.25rem; fill: currentColor;" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/>
                  </svg>
                </div>
                <h3 class="profile-name">{{ dictionary.hero.name }}</h3>
                <div class="profile-location">
                  <svg class="icon-red" style="width: 1rem; height: 1rem; fill: currentColor;" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
                  </svg>
                  {{ dictionary.hero.location }}
                </div>
              </div>

              <!-- Details items -->
              <div class="profile-details">
                
                <!-- Education -->
                <div>
                  <h4 class="about-sub-title">
                    {{ aboutData.education?.title }}
                  </h4>

                  <div class="education-list">
                    <div 
                      v-for="(edu, idx) in aboutData.education?.list" 
                      :key="idx"
                      class="magical-card education-card"
                    >
                      <div class="education-header">
                        <div class="education-icon-wrapper">
                          <font-awesome-icon :icon="faGraduationCap" style="width: 1.5rem; height: 1.5rem;" />
                        </div>
                        <div class="education-info">
                          <h5 class="education-degree">{{ edu.degree }}</h5>
                          <div class="education-institution">
                            <font-awesome-icon :icon="faUniversity" style="width: 0.875rem; height: 0.875rem;" />
                            {{ edu.institution }}
                          </div>
                        </div>
                      </div>

                      <div class="education-badges">
                        <span class="badge badge-ongoing">
                          <span class="pulse-dot" style="width: 0.375rem; height: 0.375rem; border-radius: 50%; background-color: rgb(234, 179, 8); margin-right: 0.375rem; display: inline-block; animation: pulse 2s infinite;" />
                          {{ edu.status }}
                        </span>
                        <span class="badge badge-period">
                          <Clock style="width: 0.875rem; height: 0.875rem;" />
                          {{ edu.period }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Languages -->
                <div>
                  <h4 class="about-sub-title">
                    {{ aboutData.languages?.title }}
                  </h4>
                  <div class="languages-list">
                    <div v-for="langItem in aboutData.languages?.list" :key="langItem.name" class="language-item">
                      <div class="language-label-row">
                        <span>{{ langItem.name }}</span>
                        <span style="color: oklch(0.708 0 0);">{{ langItem.level }}</span>
                      </div>
                      <div class="progress-track">
                        <div 
                          class="progress-fill"
                          :style="{ width: `${langItem.progress}%` }"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Biography Column (Staggered Delay 2) -->
          <div class="animate-on-scroll anim-slide-up about-bio-col" style="animation-delay: 200ms">
            <div>
              <h2 class="bio-title">
                <span>#</span> {{ aboutData.bio?.title }}
              </h2>
              <div class="bio-text" v-html="aboutData.bio?.html" />
            </div>

            <!-- Social Links -->
            <div class="about-socials">
              <a 
                :href="aboutData.social_networks?.github" 
                target="_blank" 
                class="magical-button social-btn-github"
              >
                <svg style="width: 1.25rem; height: 1.25rem; fill: currentColor;" viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                </svg>
                GitHub
              </a>
              <a 
                :href="aboutData.social_networks?.linkedin" 
                target="_blank" 
                class="magical-button social-btn-linkedin"
              >
                <svg style="width: 1.25rem; height: 1.25rem; fill: currentColor;" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                </svg>
                LinkedIn
              </a>
              <a 
                :href="aboutData.social_networks?.coffee" 
                target="_blank" 
                class="magical-button social-btn-coffee"
              >
                <svg style="width: 1.25rem; height: 1.25rem; fill: currentColor;" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M192 384h192c53 0 96-43 96-96h32c70.6 0 128-57.4 128-128S582.6 32 512 32H120c-13.3 0-24 10.7-24 24v232c0 53 43 96 96 96zM512 96c35.3 0 64 28.7 64 64s-28.7 64-64 64h-32V96h32zm47.7 384H48.3c-47.6 0-61-64-36-64h583.3c25 0 11.8 64-35.9 64z"/>
                </svg>
                Buy me a coffee
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- --- SKILLS --- -->
    <section id="skills" class="skills-section">
      <div class="skills-wrapper">
        <div class="skills-header animate-on-scroll anim-scale-up">
          <h2 class="skills-title">
            <svg style="width: 2rem; height: 2rem; fill: currentColor;" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"/>
            </svg> 
            {{ dictionary.skills.title }}
          </h2>
          <p class="skills-subtitle">{{ dictionary.skills.subtitle }}</p>
        </div>

        <div class="skills-grid">
          <!-- Frontend (Stagger 1) -->
          <div class="skills-col animate-on-scroll anim-slide-up" style="animation-delay: 100ms">
            <h3 class="skills-col-title border-blue">
              <svg style="width: 1.25rem; height: 1.25rem; fill: currentColor;" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M255.03 261.65c6.25 6.25 16.38 6.25 22.63 0l11.31-11.31c6.25-6.25 6.25-16.38 0-22.63L253.25 192l35.71-35.72c6.25-6.25 6.25-16.38 0-22.63l-11.31-11.31c-6.25-6.25-16.38-6.25-22.63 0l-58.34 58.34c-6.25 6.25-6.25 16.38 0 22.63l58.35 58.34zm96.01-11.3l11.31 11.31c6.25 6.25 16.38 6.25 22.63 0l58.34-58.34c6.25-6.25 6.25-16.38 0-22.63l-58.34-58.34c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63L386.75 192l-35.71 35.72c-6.25 6.25-6.25 16.38 0 22.63zM624 416H381.54c-.74 19.81-14.71 32-32.74 32H288c-18.69 0-33.02-17.47-32.77-32H16c-8.8 0-16 7.2-16 16v16c0 35.2 28.8 64 64 64h512c35.2 0 64-28.8 64-64v-16c0-8.8-7.2-16-16-16zM576 48c0-26.4-21.6-48-48-48H112C85.6 0 64 21.6 64 48v336h512V48zm-64 272H128V64h384v256z"/>
              </svg>
              Frontend
            </h3>
            <div class="skills-list">
              <div 
                v-for="skill in skillsData.frontend" 
                :key="skill.name"
                class="skill-card hover-sky"
              >
                <span>{{ skill.name }}</span>
                <div class="skill-score">
                  <div 
                    v-for="s in 5" 
                    :key="s" 
                    class="score-bubble" 
                    :class="{ 'fill-primary': s <= skill.level }" 
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Backend (Stagger 2) -->
          <div class="skills-col animate-on-scroll anim-slide-up" style="animation-delay: 200ms">
            <h3 class="skills-col-title border-emerald">
              <svg style="width: 1.25rem; height: 1.25rem; fill: currentColor; color: oklch(0.696 0.17 162.48);" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M448 73.143v45.714C448 159.143 347.667 192 224 192S0 159.143 0 118.857V73.143C0 32.857 100.333 0 224 0s224 32.857 224 73.143zM448 176v102.857C448 319.143 347.667 352 224 352S0 319.143 0 278.857V176c48.125 33.143 136.208 48.572 224 48.572S399.874 209.143 448 176zm0 160v102.857C448 479.143 347.667 512 224 512S0 479.143 0 438.857V336c48.125 33.143 136.208 48.572 224 48.572S399.874 369.143 448 336z"/>
              </svg>
              Backend
            </h3>
            <div class="skills-list">
              <div 
                v-for="skill in skillsData.backend" 
                :key="skill.name"
                class="skill-card hover-green"
              >
                <span>{{ skill.name }}</span>
                <div class="skill-score">
                  <div 
                    v-for="s in 5" 
                    :key="s" 
                    class="score-bubble" 
                    :class="{ 'fill-emerald': s <= skill.level }" 
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Tools (Stagger 3) -->
          <div class="skills-col animate-on-scroll anim-slide-up" style="animation-delay: 300ms">
            <h3 class="skills-col-title border-purple">
              <svg style="width: 1.25rem; height: 1.25rem; fill: currentColor; color: oklch(0.627 0.265 303.9);" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.41 148.02l232.94 105.67c6.8 3.09 14.49 3.09 21.29 0l232.94-105.67c16.55-7.51 16.55-32.52 0-40.03L266.65 2.31a25.607 25.607 0 0 0-21.29 0L12.41 107.98c-16.55 7.51-16.55 32.53 0 40.04zm487.18 88.28l-58.09-26.33-161.64 73.27c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.51 209.97l-58.1 26.33c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 276.3c16.55-7.5 16.55-32.5 0-40zm0 127.8l-57.87-26.23-161.86 73.37c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.29 337.87 12.41 364.1c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 404.1c16.55-7.5 16.55-32.5 0-40z"/>
              </svg>
              Tools
            </h3>
            <div class="skills-list">
              <div 
                v-for="skill in skillsData.tools" 
                :key="skill.name"
                class="skill-card hover-purple"
              >
                <span>{{ skill.name }}</span>
                <div class="skill-score">
                  <div 
                    v-for="s in 5" 
                    :key="s" 
                    class="score-bubble" 
                    :class="{ 'fill-purple': s <= skill.level }" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- --- EXPERIENCE --- -->
    <section id="experience" class="experience-section">
      <div class="experience-wrapper">
        <div class="experience-header animate-on-scroll anim-slide-up">
          <h2 class="experience-title">
            <svg style="width: 2rem; height: 2rem; fill: currentColor;" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zm144-208h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48zm-144 0H192V96h128v32z"/>
            </svg>
            {{ dictionary.nav.experience }}
          </h2>
          <p class="experience-subtitle">{{ lang === 'pt' ? 'Trajetória acadêmica e de mercado' : 'Academic and market trajectory' }}</p>
        </div>

        <!-- Experience timeline cascade stagger loop -->
        <div class="experience-list">
          <div 
            v-for="(job, idx) in experiences" 
            :key="job.id"
            class="animate-on-scroll anim-slide-up"
            :style="{ animationDelay: `${(idx + 1) * 150}ms` }"
          >
            <div class="magical-card experience-card">
              <div class="experience-card-header">
                <div>
                  <h3 class="experience-card-role">
                     <svg style="width: 1.25rem; height: 1.25rem; fill: currentColor;" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                       <path d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zm144-208h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48zm-144 0H192V96h128v32z"/>
                     </svg>
                    {{ job.role }}
                  </h3>
                  <span class="experience-card-company">
                    {{ job.company }}
                  </span>
                </div>
                <span class="badge badge-period">
                  {{ job.period }}
                </span>
              </div>
              <div class="experience-card-desc" v-html="job.desc" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- --- PROJECTS --- -->
    <section v-if="hasProjects" id="projects" class="projects-section">
      <div class="projects-wrapper">
        <div class="projects-header animate-on-scroll anim-slide-up">
          <h2 class="projects-title">{{ dictionary.projects.title }}</h2>
          <p class="projects-subtitle">{{ dictionary.projects.subtitle }}</p>
        </div>

        <!-- Projects cards stagger cascade loop -->
        <div class="projects-grid">
          <div 
            v-for="(project, idx) in projectsList" 
            :key="project.title"
            class="animate-on-scroll anim-slide-up"
            :style="{ animationDelay: `${(idx + 1) * 150}ms` }"
          >
            <div class="magical-card project-card">
            <!-- Card Header -->
            <div class="project-card-header">
              <div class="project-card-top">
                <div class="project-icon-wrapper">
                  <Terminal style="width: 2.5rem; height: 2.5rem;" />
                </div>
                <span 
                  class="badge-status"
                  :class="project.status === 'dev' ? 'bg-yellow-500\/10' : project.status === 'done' ? 'bg-green-500\/10' : 'bg-purple-500\/10'"
                >
                  {{ projectsStatus[project.status] || project.status }}
                </span>
              </div>

              <h3 class="project-card-title">{{ project.title }}</h3>
            </div>
            
            <!-- Card Content -->
            <div class="project-card-body">
              <div class="project-card-desc" v-html="project.desc" />

              <!-- Tags -->
              <div class="project-card-tags">
                <span 
                  v-for="tag in project.tags" 
                  :key="tag"
                  class="project-tag"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="project-card-actions">
                <a 
                  v-if="project.code" 
                  :href="project.code" 
                  target="_blank"
                  class="project-action-btn btn-github"
                >
                  <Terminal style="width: 1rem; height: 1rem;" /> Code
                </a>
                <a 
                  v-if="project.design" 
                  :href="project.design" 
                  target="_blank"
                  class="project-action-btn btn-figma"
                >
                  <ExternalLink style="width: 1rem; height: 1rem;" /> Figma
                </a>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>

    <!-- --- CONTACT --- -->
    <section 
      id="contact"
      class="contact-section border-top"
      :class="hasProjects ? 'bg-muted-bg' : 'bg-normal-bg'"
    >
      <div class="contact-wrapper animate-on-scroll anim-slide-up">
        <h2 class="contact-title">
          {{ contactData.title }}
        </h2>
        <p class="contact-subtitle">
          {{ contactData.subtitle }}
        </p>

        <!-- Message Actions button -->
        <div class="contact-actions">
          <a 
            href="https://formsubmit.co/el/sariva" 
            target="_blank"
            class="magical-button contact-send-btn"
          >
            {{ lang === 'pt' ? 'Enviar Mensagem' : 'Send Message' }}
          </a>
        </div>

        <!-- Info details -->
        <div class="contact-details">
          <span class="contact-detail-item">
            <svg style="width: 1rem; height: 1rem; fill: currentColor;" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.5c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.6zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.4 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/>
            </svg>
            {{ contactData.email }}
          </span>
          <span class="contact-detail-item">
            <svg class="icon-red" style="width: 1rem; height: 1rem; fill: currentColor;" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
            </svg>
            {{ contactData.location }}
          </span>
        </div>
      </div>
    </section>

    <!-- Scroll Top Button -->
    <transition name="fade">
      <button 
        v-if="showScrollTop"
        @click="scrollToTop"
        class="scroll-top-btn"
      >
        <ArrowUp style="width: 1.5rem; height: 1.5rem;" />
      </button>
    </transition>

    <!-- Footer -->
    <footer 
      class="footer border-top"
      :class="hasProjects ? 'bg-normal-bg' : 'bg-muted-bg'"
    >
      <p>© {{ new Date().getFullYear() }} Vinícius Rezende. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.portfolio-root :deep(a) {
  text-decoration: none !important;
}

/* Transitions config */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
  max-height: 250px;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
