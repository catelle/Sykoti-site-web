/* eslint-disable react/prop-types, react-refresh/only-export-components */
// Helpers shared by the public pages: links, images, rich titles and motion.
import { useEffect, useRef, useState } from 'react'

export const BASE = import.meta.env.BASE_URL
export const API = import.meta.env.VITE_API_URL || (['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'http://localhost:4001/api' : `${window.location.origin}/api`)
const apiOrigin = API.replace(/\/api$/, '')
export const pagePaths = { home: '', about: 'about', programs: 'programs', impact: 'impact', resources: 'resources', 'get-involved': 'get-involved', membership: 'membership', reports: 'reports', contact: 'contact', cyberambassador: 'cyberambassador-program' }

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function publicAsset(url) {
  if (!url) return ''
  if (/^https?:\/\//.test(url) || url.startsWith(BASE)) return url
  if (url.startsWith('/uploads/')) return `${apiOrigin}${url}`
  return `${BASE}${url.replace(/^\//, '')}`
}

export function mediaPath(file) {
  if (!file) return ''
  if (/^https?:\/\//.test(file) || file.startsWith('/') || file.startsWith(BASE)) return publicAsset(file)
  const folder = file.endsWith('.jpeg') ? 'cyberambassador/media/' : 'cyberambassador/media/gallery/'
  return `${BASE}${folder}${file}`
}

// Renders "*words*" as <em>words</em> so editors can keep the accent styling.
export function rich(text) {
  if (typeof text !== 'string' || !text.includes('*')) return text
  return text.split(/(\*[^*]+\*)/g).map((part, i) => (/^\*[^*]+\*$/.test(part) ? <em key={i}>{part.slice(1, -1)}</em> : part))
}

// Pending "interest:<type>" request when the form lives on another page.
let pendingInterest = null
export const takePendingInterest = () => { const value = pendingInterest; pendingInterest = null; return value }

export function scrollToId(id) {
  const target = document.getElementById(id)
  if (!target) return false
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  return true
}

function navigate(path) {
  history.pushState({}, '', `${BASE}${path}`)
  dispatchEvent(new PopStateEvent('popstate'))
}

// Link targets: page keys, "#section", "interest:<type>" (Get Involved form), mailto:, https:.
export function go(page) {
  if (!page) return
  if (page.startsWith('interest:') || page.startsWith('#')) {
    const id = page.startsWith('#') ? page.slice(1) : 'interest'
    const type = page.startsWith('interest:') ? page.slice(9) : null
    if (type) window.dispatchEvent(new CustomEvent('sykoti:interest', { detail: type }))
    if (scrollToId(id)) return
    pendingInterest = { id, type }
    navigate(`get-involved#${id}`)
    return
  }
  if (page === 'membership') { navigate('membership'); return }
  if (page.startsWith('mailto:') || /^https?:\/\//.test(page)) { window.location.href = page; return }
  if (page.startsWith('article:')) { navigate(`articles/${page.slice(8)}`); return }
  if (page === 'scholarship') { window.location.href = `${BASE}scholarship/`; return }
  if (page === 'about-team') { navigate('about#team'); return }
  if (page.startsWith('/')) { window.location.href = `${BASE}${page.slice(1)}`; return }
  const path = pagePaths[page]
  if (path === undefined) return
  navigate(path)
}

export function Button({ action, children, secondary = false, className = '' }) {
  return <button className={`rd-button${secondary ? ' secondary' : ''} ${className}`.trim()} onClick={() => go(action)}>{children}<span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span></button>
}

// Animates the numeric part of values like "217", "1 200+", "98%" when scrolled into view.
export function CountUp({ value }) {
  const ref = useRef(null)
  const text = String(value ?? '')
  const match = text.match(/^(\D*?)(\d[\d\s.,\u202f]*)(.*)$/)
  const [shown, setShown] = useState(() => (match && !prefersReducedMotion() ? `${match[1]}0${match[3]}` : text))
  useEffect(() => {
    if (!match || prefersReducedMotion() || !('IntersectionObserver' in window)) { setShown(text); return undefined }
    const [, prefix, digits, suffix] = match
    const separator = (digits.match(/[\s,\u202f]/) || [''])[0]
    const target = Number(digits.replace(/[\s,\u202f]/g, ''))
    if (!Number.isFinite(target)) { setShown(text); return undefined }
    const decimals = (String(target).split('.')[1] || '').length
    const format = (n) => {
      const fixed = n.toFixed(decimals)
      const [int, dec] = fixed.split('.')
      return int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) + (dec ? `.${dec}` : '')
    }
    let frame
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const duration = 1400
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - (1 - t) ** 3
        setShown(`${prefix}${format(target * eased)}${suffix}`)
        if (t < 1) frame = requestAnimationFrame(tick)
        else setShown(text)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    if (ref.current) observer.observe(ref.current)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} aria-label={text}>{shown}</span>
}

const REVEAL_SELECTOR = [
  '.rd-section-head', '.rd-extra-head', '.rd-extra-detail', '.rd-card-grid > article', '.rd-simple-grid > article',
  '.rd-extra-grid > article', '.rd-steps > article', '.rd-stats article', '.rd-media-grid > img', '.rd-feature-grid > *',
  '.rd-feature-note', '.gi-path-layout', '.gi-level', '.gi-form-intro', '.gi-form', '.gi-faq-item', '.bl-grid > .bl-card', '.bl-featured', '.bl-resources > div', '.bl-prose > *',
].map((selector) => `${selector}:not([data-reveal])`).join(',')

// Fades and lifts content in as it scrolls into view (skipped for reduced motion).
export function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        observer.unobserve(el)
        el.classList.add('is-in')
        const delay = parseInt(el.style.getPropertyValue('--reveal-delay'), 10) || 0
        setTimeout(() => { el.classList.remove('rd-reveal', 'is-in'); el.style.removeProperty('--reveal-delay') }, 900 + delay)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 })
    const scan = () => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        el.dataset.reveal = '1'
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0 && !root.dataset.motionReady) return
        const index = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0
        el.style.setProperty('--reveal-delay', `${Math.min(Math.max(index, 0), 5) * 80}ms`)
        el.classList.add('rd-reveal')
        observer.observe(el)
      })
    }
    scan()
    root.dataset.motionReady = '1'
    const mutations = new MutationObserver(scan)
    mutations.observe(root, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
      delete root.dataset.motionReady
      // Un-mark everything so a re-run (StrictMode, remount) observes it again instead of leaving it hidden.
      root.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.remove('rd-reveal', 'is-in')
        el.style.removeProperty('--reveal-delay')
        delete el.dataset.reveal
      })
    }
  }, [rootRef])
}

// Header state: shadow once the page scrolls, plus a reading-progress bar.
export function useScrollProgress(barRef) {
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 8)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
      setScrolled(window.scrollY > 8)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame) }
  }, [barRef])
  return scrolled
}
