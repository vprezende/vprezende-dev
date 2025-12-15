import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { toast, Toaster } from "sonner"

import * as FaIcons from "react-icons/fa";

import './App.css'

import dataPT from '@/data/pt.json';
import dataEn from '@/data/en.json';

import projectsData from '@/content/projects.json';
import skillsData from '@/content/skills.json';

import experienceDataPT from '@/content/experience/pt.json';
import experienceDataEN from '@/content/experience/en.json';

const email = import.meta.env.VITE_CONTACT_EMAIL

// --- ANIMAÇÕES RPG FANTASY ---

const magicalHover = {
  scale: 1.05,
  y: -5,
  boxShadow: "0px 0px 25px rgba(59, 130, 246, 0.5)",
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

const legendaryHover = {
  scale: 1.05,
  y: -5,
  boxShadow: "0px 0px 25px rgba(234, 179, 8, 0.5)",
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

const tapEffect = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

const viewportConfig = { once: false, amount: 0.3 };

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 12 }
  }
};

const CustomCursor = () => {
  const cursorRef = useRef(null)
  useEffect(() => {
    const cursor = cursorRef.current
    const moveCursor = (e) => {
      if (cursor) {
        cursor.style.left = `${e.clientX}px`
        cursor.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])
  return <div ref={cursorRef} className="fixed w-6 h-6 border-2 border-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block" />
}

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-background to-background" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
    </div>
  )
}

function App() {
  const [lang, setLang] = useState('en')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const data = lang === 'pt' ? dataPT : dataEn;
  const experienceData = lang == "pt" ? experienceDataPT : experienceDataEN;

  const navOrder = ['home', 'about', 'skills', 'experience', 'projects', 'contact']

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      setShowScrollTop(scrollY > 500)

      if (windowHeight + scrollY >= documentHeight - 100) {
        setActiveSection('contact')
        return
      }

      for (const section of navOrder) {
        const el = document.getElementById(section)
        if (el && scrollY >= (el.offsetTop - 200)) {
          setActiveSection(section)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    setIsMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleContact = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const loadingToast = toast.loading(lang === 'pt' ? 'Enviando mensagem...' : 'Sending message...')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('message', formData.message)
      formDataToSend.append('_captcha', 'false')

      const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: 'POST',
        body: formDataToSend,
        headers: { 'Accept': 'application/json' }
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success(lang === 'pt' ? 'Mensagem enviada com sucesso!' : 'Message sent successfully!')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error(lang == 'pt' ? 'Erro ao enviar' : 'Error sending')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(lang === 'pt' ? 'Erro ao enviar. Tente novamente.' : 'Error sending. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkillClick = (skill) => {
    if (selectedSkill === skill) {
      setSelectedSkill(null)
    } else {
      setSelectedSkill(skill)
    }
  }

  useEffect(() => {
    document.title =
      lang == "pt"
        ? "Vinícius Rezende | Engenheiro de Software"
        : "Vinícius Rezende | Software Engineer"
  }, [lang]);

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground font-sans">
      <Toaster position="bottom-right" richColors />
      <CustomCursor />
      <ParticleBackground />

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20, filter: "drop-shadow(0px 0px 0px transparent)" }}
            animate={{ opacity: 1, x: 0, filter: "drop-shadow(0px 0px 0px transparent)" }}
            whileHover={{ scale: 1.05, filter: "drop-shadow(0px 0px 8px rgb(59, 130, 246))" }}
            className="flex items-center text-xl font-bold text-primary cursor-pointer"
            onClick={() => scrollTo('home')}
          >
            <FaIcons.FaTerminal />
            <span>VR.DEV</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-6">
            {navOrder.map((key) => (
              <motion.button
                key={key}
                onClick={() => scrollTo(key)}
                className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === key ? 'text-primary' : 'text-muted-foreground'
                  }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {data.nav[key]}
              </motion.button>
            ))}

            <div className="relative ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="hover:bg-muted gap-2"
              >
                <FaIcons.FaGlobe className="w-4 h-4" />
                <span>{lang === 'en' ? 'English' : 'Português'}</span>
                <motion.div animate={{ rotate: isLangMenuOpen ? 180 : 0 }}>
                  <FaIcons.FaChevronDown className="w-4 h-4" />
                </motion.div>
              </Button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-32 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50"
                  >
                    <button
                      onClick={() => { setLang('en'); setIsLangMenuOpen(false) }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${lang === 'en' ? 'text-primary bg-muted/50' : ''}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLang('pt'); setIsLangMenuOpen(false) }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${lang === 'pt' ? 'text-primary bg-muted/50' : ''}`}
                    >
                      Português
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}>
              {lang.toUpperCase()}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FaIcons.FaTimes /> : <FaIcons.FaBars />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-background border-b border-border overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-4">
                {navOrder.map((key) => (
                  <button
                    key={key}
                    onClick={() => scrollTo(key)}
                    className={`text-left text-lg font-medium transition-colors hover:text-primary ${activeSection === key ? 'text-primary' : 'text-muted-foreground'
                      }`}
                  >
                    {data.nav[key]}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={viewportConfig}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-4 text-primary border-primary/50 px-4 py-1 text-sm backdrop-blur-sm">
              {lang == "pt" ? "Disponível Para Projetos" : "Available For Projects"}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Vinícius <span className="text-primary">Rezende</span>
          </motion.h1>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4 font-mono"
          >
            {`< ${data.hero.role} />`}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            {data.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div className="rounded-lg" whileHover={magicalHover} whileTap={tapEffect}>
              <Button size="lg" onClick={() => scrollTo('projects')} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 w-full">
                {data.hero.cta_primary}
              </Button>
            </motion.div>
            <motion.div className="rounded-lg" whileHover={magicalHover} whileTap={tapEffect}>
              <Button size="lg" variant="outline" onClick={() => scrollTo('contact')} className="bg-background/50 backdrop-blur-md w-full">
                {data.hero.cta_secondary}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- ABOUT --- */}
      <section id="about" className="py-24 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start"
          >
            {/* --- COLUNA ESQUERDA: CARD DE PERFIL --- */}
            <motion.div variants={itemVariants} className="relative group">

              <div className="absolute -inset-0.5 bg-blue-500 rounded-2xl blur opacity-60"></div>

              <Card className="relative border-border/50 overflow-hidden rounded-2xl">
                <CardContent className="p-8">

                  {/* Header: Foto e Local */}
                  <div className="flex flex-col items-center text-center mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-24 h-24  rounded-full flex items-center justify-center mb-4 text-primary border-2 border-primary/20 shadow-inner"
                    >
                      <FaIcons.FaUser size={36} />
                    </motion.div>
                    <h3 className="text-2xl font-bold">{data.hero.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2 text-sm bg-muted/50 px-3 py-1 rounded-full">
                      <FaIcons.FaMapMarkerAlt className="text-red-500" />
                      {data.about.stats.location}
                    </div>
                  </div>

                  <div className="space-y-8">

                    {/* --- EDUCATION (NOVO DESIGN MELHORADO) --- */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        {lang === 'pt' ? 'Formação' : 'Education'}
                      </h4>

                      <div className="space-y-4">
                        {data.about.education.list.map((edu, idx) => (
                          <motion.div
                            key={idx}
                            className="p-4 rounded-xl border hover:border-primary/50 transition-colors border-border/50 bg-card/50 backdrop-blur-sm"
                            whileHover={magicalHover}
                          >

                            <div className="flex items-start gap-4">
                              {/* Ícone de Destaque */}
                              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 shrink-0">
                                <FaIcons.FaGraduationCap size={24} />
                              </div>

                              <div className="flex-1">
                                <h5 className="font-bold text-foreground leading-tight text-lg">
                                  {edu.degree}
                                </h5>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <FaIcons.FaUniversity className="w-3 h-3" />
                                  {edu.institution}
                                </div>
                              </div>
                            </div>

                            {/* Badges de Status e Período */}
                            <div className="mt-4 flex flex-wrap gap-2 pl-[3.25rem]">
                              {/* Badge de Status */}
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
                                {edu.status}
                              </Badge>

                              {/* Badge de Período (O que você pediu) */}
                              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 gap-1.5">
                                <FaIcons.FaClock size={10} />
                                {edu.period}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* --- IDIOMAS --- */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        {lang === 'pt' ? 'Idiomas' : 'Languages'}
                      </h4>
                      <div className="space-y-4">
                        {data.about.languages.list.map((langItem) => (
                          <div key={langItem.name}>
                            <div className="flex justify-between text-xs font-medium mb-1">
                              <span>{langItem.name}</span>
                              <span className="text-muted-foreground">{langItem.level}</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${langItem.progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-primary rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>

            {/* --- COLUNA DIREITA (BIO) --- */}
            <motion.div variants={itemVariants} className="flex flex-col justify-center h-full space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-primary">#</span> {data.about.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                  {data.about.bio}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <motion.div className="rounded-lg" whileHover={magicalHover} whileTap={tapEffect}>
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6" asChild>
                    <a href="https://github.com/vprezende" target="_blank">
                      <FaIcons.FaGithub size={20} /> GitHub
                    </a>
                  </Button>
                </motion.div>

                <motion.div className="rounded-lg" whileHover={magicalHover} whileTap={tapEffect}>
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6" asChild>
                    <a href="https://linkedin.com/in/vprezende" target="_blank">
                      <FaIcons.FaLinkedin size={20} /> LinkedIn
                    </a>
                  </Button>
                </motion.div>

                <motion.div className="rounded-lg" whileHover={legendaryHover} whileTap={tapEffect}>
                  <Button
                    size="lg"
                    className="gap-2 h-12 px-6 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 hover:bg-yellow-500 hover:text-white transition-all duration-300"
                    asChild
                  >
                    <a href="https://www.buymeacoffee.com/vprezende" target="_blank">
                      <FaIcons.FaCoffee size={20} /> Buy me a coffee
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>
      {/* --- SKILLS (COM HIGHLIGHT) --- */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={viewportConfig}
            transition={{ type: "spring" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <FaIcons.FaCode className="text-primary" /> {data.skills.title}
            </h2>
            <p className="text-muted-foreground">{data.skills.subtitle}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Mobile Branch */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold text-center border-b border-blue-500/30 pb-2 flex items-center justify-center gap-2">
                <FaIcons.FaMobileAlt className="w-5 h-5 text-primary" /> Mobile
              </h3>
              <div className="space-y-2">
                {skillsData.mobile.map(skill => (
                  <motion.div
                    key={skill}
                    onClick={() => handleSkillClick(skill)}
                    whileHover={{ x: 5, scale: 1.02, backgroundColor: "rgba(4, 170, 255, 0.1)" }}
                    className={`flex items-center justify-between p-3 bg-background rounded-lg border cursor-pointer transition-all duration-300 ${selectedSkill === skill
                      ? 'border-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] bg-primary/10'
                      : 'border-border'
                      }`}
                  >
                    <span>{skill}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= 4 ? 'bg-primary' : 'bg-muted'}`} />)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Backend Branch */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold text-center border-b border-green-500/30 pb-2 flex items-center justify-center gap-2">
                <FaIcons.FaDatabase className="w-5 h-5 text-green-500" /> Backend
              </h3>
              <div className="space-y-2">
                {skillsData.backend.map(skill => (
                  <motion.div
                    key={skill}
                    onClick={() => handleSkillClick(skill)}
                    whileHover={{ x: 5, scale: 1.02, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                    className={`flex items-center justify-between p-3 bg-background rounded-lg border cursor-pointer transition-all duration-300 ${selectedSkill === skill
                      ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] bg-green-500/10'
                      : 'border-border'
                      }`}
                  >
                    <span>{skill}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= 4 ? 'bg-green-500' : 'bg-muted'}`} />)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tools Branch */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold text-center border-b border-purple-500/30 pb-2 flex items-center justify-center gap-2">
                <FaIcons.FaLayerGroup className="w-5 h-5 text-purple-500" /> Tools
              </h3>
              <div className="space-y-2">
                {skillsData.tools.map(skill => (
                  <motion.div
                    key={skill}
                    onClick={() => handleSkillClick(skill)}
                    whileHover={{ x: 5, scale: 1.02, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
                    className={`flex items-center justify-between p-3 bg-background rounded-lg border cursor-pointer transition-all duration-300 ${selectedSkill === skill
                      ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] bg-purple-500/10'
                      : 'border-border'
                      }`}
                  >
                    <span>{skill}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= 4 ? 'bg-purple-500' : 'bg-muted'}`} />)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- EXPERIENCE (NOVA SEÇÃO) --- */}
      <section id="experience" className="py-20 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <FaIcons.FaBriefcase className="text-primary" /> {experienceData.title}
            </h2>
            <p className="text-muted-foreground">{experienceData.subtitle}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            className="space-y-8"
          >
            {experienceData.list.map((job, idx) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                whileHover={magicalHover}
                className="rounded-xl"
              >
                <Card className="hover:border-primary/50 transition-colors border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <FaIcons.FaBriefcase className="text-primary w-5 h-5" />
                          {job.role}
                        </CardTitle>
                        <CardDescription className="text-lg font-medium mt-1">
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="w-fit">{job.period}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{job.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- PROJECTS --- */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">{data.projects.title}</h2>
            <p className="text-muted-foreground">{data.projects.subtitle}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            className="flex flex-wrap justify-center gap-6"
          >
            {projectsData.map((project) => {
              const Icon = FaIcons[project.icon];
              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={magicalHover}
                  className="w-full md:w-[350px] lg:w-[400px] rounded-xl"
                >
                  <Card className="h-full bg-card/50 flex flex-col hover:border-primary/50 transition-colors border-border/50 bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-muted rounded-md transition-colors">
                          {Icon && <Icon className="w-10 h-10 text-primary" />}
                        </div>
                        <Badge variant="outline">
                          {data.projects.status[project.status]}
                        </Badge>
                      </div>
                      <CardTitle className="transition-colors">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <CardDescription className="mb-4 min-h-[80px]">
                        {lang === 'pt' ? project.descPT : project.descEN}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                        {project.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs border-primary/10">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {project.link && (
                        <motion.div className="rounded-md" whileHover={{ scale: 1.02 }} whileTap={tapEffect}>
                          <Button variant="ghost" size="sm" className="w-full mt-4 bg-muted/50 text-muted-foreground hover:bg-primary hover:text-white transition-colors" asChild>
                            <a href={project.link} target="_blank">
                              <FaIcons.FaExternalLinkAlt size={16} className="mr-2" />
                              View Code
                            </a>
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <motion.section
        id="contact"
        className="py-20 px-4 relative bg-muted/20"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
      >
        <div className="max-w-3xl mx-auto text-center">

          {/* TÍTULO */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold mb-4"
          >
            {data.contact.title}
          </motion.h2>

          {/* SUBTÍTULO */}
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground mb-10"
          >
            {data.contact.subtitle}
          </motion.p>

          {/* CARD */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-md border-primary/20 shadow-2xl">
              <CardContent className="pt-6">

                {/* FORM */}
                <motion.form
                  onSubmit={handleContact}
                  className="space-y-4 text-left"
                  variants={containerVariants}
                >

                  {/* NOME + EMAIL */}
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {data.contact.form.name}
                      </label>
                      <Input
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {data.contact.form.email}
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* ASSUNTO */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-sm font-medium">
                      {data.contact.form.subject}
                    </label>
                    <Input
                      placeholder={data.contact.form.subject}
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </motion.div>

                  {/* MENSAGEM */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-sm font-medium">
                      {data.contact.form.msg}
                    </label>
                    <Textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="resize-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </motion.div>

                  {/* BOTÃO */}
                  <motion.div
                    variants={itemVariants}
                    whileHover={magicalHover}
                    whileTap={tapEffect}
                    className="my-6 max-w-md mx-auto rounded-lg"
                  >
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting}
                      className="w-full h-11 bg-primary text-primary-foreground
                      hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all
                      gap-2
                    "
                    >
                      {isSubmitting
                        ? (lang === 'pt' ? 'Enviando...' : 'Sending...')
                        : data.contact.form.btn
                      }

                      {!isSubmitting && (
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <FaIcons.FaArrowUp className="rotate-45" size={14} />
                        </motion.span>
                      )}
                    </Button>
                  </motion.div>

                </motion.form>

                {/* INFO EXTRA */}
                <motion.div
                  variants={itemVariants}
                  className="mt-10 flex flex-col md:flex-row justify-center items-center gap-6 text-muted-foreground"
                >
                  <span
                    className="flex items-center gap-2"
                  >
                    <FaIcons.FaEnvelope size={16} />
                    vprezende.work@gmail.com
                  </span>

                  <span className="flex items-center gap-2">
                    <FaIcons.FaMapMarkerAlt size={16} />
                    {lang == "pt" ? "Brasil" : "Brazil"}
                  </span>
                </motion.div>

              </CardContent>
            </Card>
          </motion.div>

        </div>
      </motion.section>


      {/* Scroll Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-3 bg-primary text-primary-foreground rounded-full shadow-lg z-50 hover:shadow-blue-500/50"
            whileHover={magicalHover}
            whileTap={tapEffect}
          >
            <FaIcons.FaArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App