import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import {
  ArticlePage,
  ArticlesSection,
  ContactSection,
  FellowshipSection,
  Header,
  HeroSection,
  ImpactStrip,
  LabSection,
  ProgramsSection,
  ReportsSection,
  SupportSection,
  Toast,
  WebinarsSection,
} from './components/site/Sections'
import { copy } from './const/language'
import { API_BASE, apiAssetUrl, visibleWindow } from './lib/siteUtils'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const [reports, setReports] = useState([])
  const [articles, setArticles] = useState([])
  const [webinarList, setWebinarList] = useState([])
  const [status, setStatus] = useState('')
  const [toast, setToast] = useState(null)
  const [articleStart, setArticleStart] = useState(0)
  const [supportOpen, setSupportOpen] = useState(false)
  const [activeArticleSlug, setActiveArticleSlug] = useState(() => new URLSearchParams(window.location.search).get('article') || '')
  const [fetchedArticle, setFetchedArticle] = useState(null)
  const [articleLoading, setArticleLoading] = useState(false)
  const toastTimeout = useRef(null)

  const t = copy[language]
  const displayReports = reports.length ? reports : t.starterReports
  const displayWebinars = webinarList.length ? webinarList : t.webinars
  const displayArticles = articles.length ? articles : t.articles
  const visibleArticles = useMemo(() => visibleWindow(displayArticles, articleStart), [displayArticles, articleStart])
  const selectedArticle = useMemo(
    () => displayArticles.find((article) => article.slug === activeArticleSlug),
    [activeArticleSlug, displayArticles]
  )
  const activeArticle = fetchedArticle || selectedArticle
  const reportCount = useMemo(() => String(displayReports.length).padStart(2, '0'), [displayReports.length])

  const showToast = useCallback((title, message, type = 'success') => {
    window.clearTimeout(toastTimeout.current)
    setToast({ title, message, type })
    toastTimeout.current = window.setTimeout(() => setToast(null), 5200)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimeout.current), [])

  useEffect(() => {
    document.title = t.title
    const description = t.description
    const pageUrl = window.location.origin + window.location.pathname
    const sectionDescriptions = {
      programs: t.programsText,
      reports: t.reportsText,
      fellowship: t.fellowshipText,
      articles: t.articlesText,
      webinars: t.webinarsTitle,
      lab: t.labText,
      support: t.supportText,
      contact: t.contactText,
    }

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)

    const jsonLd = document.createElement('script')
    jsonLd.type = 'application/ld+json'
    jsonLd.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'NGO',
          name: 'SykotiCenter',
          description,
          areaServed: 'Francophone Africa',
          url: pageUrl,
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'SykotiCenter programs',
            itemListElement: t.programs.map((program) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: program.title,
                description: program.description,
                url: `${pageUrl}#${program.id}`,
              },
            })),
          },
        },
        { '@type': 'WebSite', name: 'SykotiCenter', url: pageUrl, description },
        {
          '@type': 'ItemList',
          name: 'SykotiCenter site sections',
          itemListElement: t.navItems.map(([name, id], index) => ({
            '@type': 'SiteNavigationElement',
            position: index + 1,
            name,
            description: sectionDescriptions[id] || name,
            url: `${pageUrl}#${id}`,
          })),
        },
      ],
    })
    document.head.appendChild(jsonLd)

    return () => jsonLd.remove()
  }, [t])

  useEffect(() => {
    async function loadPublicContent() {
      try {
        const [reportResponse, articleResponse, webinarResponse] = await Promise.all([
          fetch(`${API_BASE}/reports`),
          fetch(`${API_BASE}/articles`),
          fetch(`${API_BASE}/webinars`),
        ])

        if (reportResponse.ok) {
          const data = await reportResponse.json()
          if (data.length) {
            setReports(data.map((report, index) => ({
              title: report.title,
              theme: report.description,
              date: report.period || 'Bimensual report',
              source: report.source,
              fileName: report.fileName || 'Public report',
              url: apiAssetUrl(report.fileUrl),
              image: apiAssetUrl(report.coverUrl || report.image) || t.starterReports[index % t.starterReports.length]?.image,
              id: report._id,
            })))
          }
        }

        if (articleResponse.ok) {
          const data = await articleResponse.json()
          setArticles(data.map((article) => ({
            ...article,
            image: apiAssetUrl(article.coverUrl || article.image),
          })))
        }

        if (webinarResponse.ok) {
          const data = await webinarResponse.json()
          if (data.length) {
            setWebinarList(data.map((webinar, index) => ({
              title: webinar.title,
              date: webinar.scheduledAt ? new Date(webinar.scheduledAt).toLocaleDateString('fr-FR') : webinar.status,
              audience: webinar.description,
              image: apiAssetUrl(webinar.coverUrl || webinar.image) || t.webinars[index % t.webinars.length]?.image,
              registrationUrl: webinar.registrationUrl,
            })))
          }
        }
      } catch {
        setStatus(t.apiFallback)
      }
    }

    loadPublicContent()
  }, [t])

  useEffect(() => {
    const syncArticleFromUrl = () => {
      setActiveArticleSlug(new URLSearchParams(window.location.search).get('article') || '')
    }

    window.addEventListener('popstate', syncArticleFromUrl)
    return () => window.removeEventListener('popstate', syncArticleFromUrl)
  }, [])

  useEffect(() => {
    if (!activeArticleSlug) {
      setFetchedArticle(null)
      setArticleLoading(false)
      return
    }

    if (selectedArticle?.content) {
      setFetchedArticle(null)
      setArticleLoading(false)
      return
    }

    let cancelled = false
    setArticleLoading(true)
    fetch(`${API_BASE}/articles/${activeArticleSlug}`)
      .then((response) => {
        if (!response.ok) throw new Error('Article not found')
        return response.json()
      })
      .then((article) => {
        if (!cancelled) {
          setFetchedArticle({
            ...article,
            image: apiAssetUrl(article.coverUrl || article.image),
          })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchedArticle(null)
          showToast(t.formErrorTitle, t.apiFallback, 'error')
        }
      })
      .finally(() => {
        if (!cancelled) setArticleLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeArticleSlug, selectedArticle, showToast, t.apiFallback, t.formErrorTitle])

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const openReport = (report) => {
    if (!report.url) {
      showToast(t.formErrorTitle, t.reportMissing, 'error')
      return
    }

    window.open(report.url, '_blank', 'noopener,noreferrer')
  }

  const shareReport = async (report) => {
    const text = `${report.title} - ${report.theme}`
    const shareUrl = report.url || `${window.location.origin}${window.location.pathname}#reports`
    if (report.id) {
      fetch(`${API_BASE}/reports/${report.id}/share`, { method: 'POST' }).catch(() => {})
    }

    try {
      if (navigator.share) {
        await navigator.share({ title: report.title, text, url: shareUrl })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} ${shareUrl}`)
      } else {
        throw new Error('Share unavailable')
      }
      showToast(t.shareDoneTitle, t.shareStatus)
    } catch {
      showToast(t.formErrorTitle, t.shareError, 'error')
    }
  }

  const openArticle = (article) => {
    if (!article.slug) return

    setFetchedArticle(null)
    setActiveArticleSlug(article.slug)
    window.history.pushState({}, '', `${window.location.pathname}?article=${article.slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeArticle = () => {
    setActiveArticleSlug('')
    setFetchedArticle(null)
    window.history.pushState({}, '', `${window.location.pathname}#articles`)
    window.setTimeout(() => scrollToSection('articles'), 0)
  }

  const moveArticles = (direction) => {
    setArticleStart((current) => {
      if (!displayArticles.length) return 0
      return (current + direction + displayArticles.length) % displayArticles.length
    })
  }

  const handleContact = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const body = Object.fromEntries(new FormData(form))
    try {
      const endpoint = String(body.topic).includes('Cyberambassador')
        ? `${API_BASE}/cyberambassador/inscriptions`
        : `${API_BASE}/support`
      const payload = String(body.topic).includes('Cyberambassador')
        ? {
            fullName: body.name,
            email: body.email,
            motivation: body.message,
            program: 'fellowship',
          }
        : {
            name: body.name,
            email: body.email,
            contributionType: body.topic,
            message: body.message,
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Submission failed')
      }

      setStatus(t.contactStatus)
      showToast(t.formSuccessTitle, t.contactStatus)
      form.reset()
    } catch {
      setStatus(t.apiFallback)
      showToast(t.formErrorTitle, t.apiFallback, 'error')
    }
  }

  const handleSupport = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const body = Object.fromEntries(new FormData(form))
    try {
      const response = await fetch(`${API_BASE}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Submission failed')
      }

      setStatus(t.supportStatus)
      showToast(t.formSuccessTitle, t.supportStatus)
      form.reset()
      setSupportOpen(false)
    } catch {
      setStatus(t.apiFallback)
      showToast(t.formErrorTitle, t.apiFallback, 'error')
    }
  }

  return (
    <div className="site">
      <Header
        t={t}
        language={language}
        menuOpen={menuOpen}
        onNavigate={scrollToSection}
        onSwitchLanguage={() => setLanguage((current) => (current === 'en' ? 'fr' : 'en'))}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />

      <main id="top">
        {activeArticleSlug ? (
          <ArticlePage t={t} activeArticle={activeArticle} articleLoading={articleLoading} onBack={closeArticle} />
        ) : (
          <>
            <HeroSection t={t} reportCount={reportCount} onNavigate={scrollToSection} />
            <ImpactStrip stats={t.impactStats} />
            <ProgramsSection t={t} onNavigate={scrollToSection} />
            <FellowshipSection t={t} />
            <ReportsSection t={t} reports={displayReports} onOpenReport={openReport} onShareReport={shareReport} />
            <WebinarsSection t={t} webinars={displayWebinars} onRegisterInterest={() => scrollToSection('contact')} />
            <ArticlesSection
              t={t}
              visibleArticles={visibleArticles}
              onOpenArticle={openArticle}
              onPrevious={() => moveArticles(-1)}
              onNext={() => moveArticles(1)}
            />
            <LabSection t={t} />
            <SupportSection
              t={t}
              isOpen={supportOpen}
              onSubmit={handleSupport}
              onToggle={() => setSupportOpen((open) => !open)}
            />
            <ContactSection t={t} status={status} onSubmit={handleContact} />
          </>
        )}
      </main>

      <Toast toast={toast} />

      <footer>
        <strong>SykotiCenter</strong>
        <span>{t.footer}</span>
      </footer>
    </div>
  )
}

export default App
