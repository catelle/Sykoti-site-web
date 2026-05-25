/* eslint-disable react/prop-types */
import logo from '../../assets/logo.png'
import heroImage from '../../assets/aaaa.jpg'

export function Header({ t, language, menuOpen, onToggleMenu, onSwitchLanguage, onNavigate }) {
  return (
    <header className="navbar">
      <a className="brand" href="#top" aria-label="SykotiCenter">
        <img src={logo} alt="" />
        <span>
          SykotiCenter
          <small>{t.brandSubline}</small>
        </span>
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        onClick={onToggleMenu}
      >
        <span />
        <span />
      </button>

      <nav className={menuOpen ? 'open' : ''} aria-label="Main navigation">
        {t.navItems.map(([label, id]) => (
          <button key={id} type="button" onClick={() => onNavigate(id)}>
            {label}
          </button>
        ))}
      </nav>

      <div className="navbar-actions">
        <button className="nav-support" type="button" onClick={() => onNavigate('support')}>
          {t.supportButton}
        </button>
        <button className="language-toggle" type="button" aria-label="Switch language" onClick={onSwitchLanguage}>
          {language === 'en' ? 'FR' : 'EN'}
        </button>
      </div>
    </header>
  )
}

export function ArticlePage({ t, activeArticle, articleLoading, onBack }) {
  return (
    <section className="section article-page">
      <button className="mini-btn" type="button" onClick={onBack}>
        {t.articleBack}
      </button>
      {articleLoading && !activeArticle ? (
        <p>{t.apiFallback}</p>
      ) : activeArticle ? (
        <article>
          {activeArticle.image && <img src={activeArticle.image} alt="" />}
          <div className="article-page-copy">
            <span>{activeArticle.category}</span>
            <h1>{activeArticle.title}</h1>
            <p className="article-meta">{activeArticle.author || 'SykotiCenter'}</p>
            {(activeArticle.content || activeArticle.excerpt || '').split('\n').filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      ) : (
        <p>{t.apiFallback}</p>
      )}
    </section>
  )
}

export function HeroSection({ t, reportCount, onNavigate }) {
  return (
    <section className="hero" style={{ '--hero-image': `url(${heroImage})` }}>
      <div className="hero-copy-block">
        <p className="eyebrow">{t.heroEyebrow}</p>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroText}</p>
        <div className="hero-actions">
          <button className="btn primary" type="button" onClick={() => onNavigate('programs')}>
            {t.primaryCta}
          </button>
          <a className="btn secondary" href="cyberambassador.html">
            {t.secondaryCta}
          </a>
        </div>
      </div>

      <div className="hero-card" aria-label="SykotiCenter overview">
        <div className="floating-card">
          <strong>{reportCount}</strong>
          <span>{t.reportMetric}</span>
        </div>
      </div>
    </section>
  )
}

export function ImpactStrip({ stats }) {
  return (
    <section className="impact-strip" aria-label="Impact snapshot">
      {stats.map(([value, label]) => (
        <div key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  )
}

export function ProgramsSection({ t, onNavigate }) {
  return (
    <section className="section programs-section" id="programs">
      <div className="section-heading">
        <p className="section-kicker">{t.programsKicker}</p>
        <h2>{t.programsTitle}</h2>
        <p>{t.programsText}</p>
      </div>

      <div className="program-stack">
        {t.programs.map((program, index) => (
          <article className="program-panel" id={program.id} key={program.title}>
            <div className="program-image">
              <img src={program.image} alt="" />
            </div>
            <div className="program-content">
              <span className="program-number">{String(index + 1).padStart(2, '0')}</span>
              <p className="section-kicker">{program.label}</p>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <div className="program-actions" aria-label={program.title}>
                {program.actions.map((action) => (
                  <button key={action} type="button" onClick={() => onNavigate(program.id)}>
                    <span>{action.slice(0, 1)}</span>
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function FellowshipSection({ t }) {
  return (
    <section className="section fellowship" id="fellowship">
      <div className="fellowship-copy">
        <div>
          <p className="section-kicker">{t.fellowshipKicker}</p>
          <h2>{t.fellowshipTitle}</h2>
          <p>{t.fellowshipText}</p>
        </div>
        <div className="fellowship-card">
          <strong>{t.platformTitle}</strong>
          <p>{t.platformText}</p>
          <a className="btn primary" href="cyberambassador.html">{t.platformCta}</a>
        </div>
      </div>
      <div className="platform-preview" aria-label={t.platformTitle}>
        <div className="platform-browser">
          <span />
          <span />
          <span />
        </div>
        <iframe src="cyberambassador.html" title={t.platformTitle} loading="lazy" />
        <div className="platform-screen-list">
          {t.platformScreens.map((screen) => (
            <span key={screen}>{screen}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReportActions({ t, report, onOpen, onShare }) {
  return (
    <div className="report-actions">
      {report.url && (
        <>
          <button className="mini-btn" type="button" onClick={() => onOpen(report)}>
            {t.reportOpen}
          </button>
          <a className="mini-btn" href={report.url} download={report.fileName || true}>
            {t.reportDownload}
          </a>
        </>
      )}
      <button className="mini-btn dark" type="button" onClick={() => onShare(report)}>
        {t.reportShare}
      </button>
    </div>
  )
}

export function ReportsSection({ t, reports, onOpenReport, onShareReport }) {
  return (
    <section className="section reports-section" id="reports">
      <div className="reports-header">
        <div className="section-heading">
          <p className="section-kicker">{t.reportsKicker}</p>
          <h2>{t.reportsTitle}</h2>
          <p>{t.reportsText}</p>
        </div>
      </div>

      <div className="report-showcase">
        {reports.map((report, index) => (
          <article className="report-card" key={`${report.title}-${index}`}>
            {report.image && <img src={report.image} alt="" />}
            <div className="report-overlay">
              <span>{report.date}</span>
              <h3>{report.title}</h3>
              <p>{report.theme}</p>
              <small>{report.source} / {report.fileName}</small>
              <ReportActions t={t} report={report} onOpen={onOpenReport} onShare={onShareReport} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function WebinarsSection({ t, webinars, onRegisterInterest }) {
  return (
    <section className="section webinars-section" id="webinars">
      <div className="section-heading">
        <p className="section-kicker">{t.webinarsKicker}</p>
        <h2>{t.webinarsTitle}</h2>
      </div>
      <div className="webinar-grid">
        {webinars.map((webinar) => (
          <article className="webinar-card" key={webinar.title}>
            {webinar.image && <img src={webinar.image} alt="" />}
            <div className="webinar-overlay">
              <span>{webinar.date}</span>
              <h3>{webinar.title}</h3>
              <p>{webinar.audience}</p>
              {webinar.registrationUrl ? (
                <a className="mini-btn" href={webinar.registrationUrl} target="_blank" rel="noreferrer">
                  {t.registerInterest}
                </a>
              ) : (
                <button type="button" className="mini-btn" onClick={onRegisterInterest}>
                  {t.registerInterest}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ArticlesSection({ t, visibleArticles, onPrevious, onNext, onOpenArticle }) {
  const [featuredArticle, ...sideArticles] = visibleArticles

  return (
    <section className="section articles-section" id="articles">
      <div className="section-heading">
        <p className="section-kicker">{t.articlesKicker}</p>
        <h2>{t.articlesTitle}</h2>
        <p>{t.articlesText}</p>
      </div>
      <div className="article-carousel">
        <button className="article-nav previous" type="button" aria-label={t.articlePrevious} onClick={onPrevious}>
          &lsaquo;
        </button>
        <div className="article-editorial">
          {featuredArticle && (
            <article className="article-feature-card">
              {featuredArticle.image && <img src={featuredArticle.image} alt="" />}
              <div className="article-overlay">
                <span>{featuredArticle.category}</span>
                <h3>{featuredArticle.title}</h3>
                <p>{featuredArticle.excerpt}</p>
                <button className="mini-btn" type="button" onClick={() => onOpenArticle(featuredArticle)}>
                  {t.articlesRead}
                </button>
              </div>
            </article>
          )}
          <div className="article-stack">
            {sideArticles.map((article) => (
              <article className="article-strip" key={article.slug || article.title}>
                {article.image && <img src={article.image} alt="" />}
                <div className="article-overlay">
                  <span>{article.category}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <button className="mini-btn" type="button" onClick={() => onOpenArticle(article)}>
                    {t.articlesRead}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <button className="article-nav next" type="button" aria-label={t.articleNext} onClick={onNext}>
          &rsaquo;
        </button>
      </div>
    </section>
  )
}

export function LabSection({ t }) {
  return (
    <section className="section lab-section" id="lab">
      <div className="lab-product-preview" aria-hidden="true">
        <div className="lab-window">
          <div className="lab-window-top">
            <span />
            <strong>Sykoti Lab Board</strong>
          </div>
          <div className="lab-flow">
            {t.labItems.map((item, index) => (
              <div className="lab-step" key={item}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <b>{item}</b>
                <span />
              </div>
            ))}
          </div>
        </div>
        <div className="lab-mobile">
          <strong>Prototype</strong>
          <span>Risk signal</span>
          <span>Action guide</span>
          <span>Community test</span>
        </div>
      </div>
      <div>
        <p className="section-kicker">{t.labKicker}</p>
        <h2>{t.labTitle}</h2>
        <p>{t.labText}</p>
        <div className="lab-list">
          {t.labItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SupportSection({ t, isOpen, onToggle, onSubmit }) {
  return (
    <section className={`section support-section ${isOpen ? 'open' : 'closed'}`} id="support">
      <div className="section-heading">
        <p className="section-kicker">{t.supportKicker}</p>
        <h2>{t.supportTitle}</h2>
        <p>{t.supportText}</p>
        <button className="btn primary" type="button" onClick={onToggle}>
          {t.supportButton}
        </button>
      </div>
      {isOpen && (
        <form onSubmit={onSubmit}>
          <label>
            {t.form.name}
            <input name="name" type="text" placeholder={t.form.orgPlaceholder} required />
          </label>
          <label>
            {t.form.email}
            <input name="email" type="email" placeholder="you@example.com" />
          </label>
          <label>
            {t.form.contribution}
            <select name="contributionType" required>
              <option value="">{t.form.contributionPlaceholder}</option>
              {t.form.contributionTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            {t.form.message}
            <textarea name="message" placeholder={t.form.supportPlaceholder} />
          </label>
          <button className="btn primary" type="submit">{t.sendButton}</button>
        </form>
      )}
    </section>
  )
}

export function ContactSection({ t, status, onSubmit }) {
  return (
    <section className="section contact-section" id="contact">
      <div className="section-heading">
        <p className="section-kicker">{t.contactKicker}</p>
        <h2>{t.contactTitle}</h2>
        <p>{status || t.contactText}</p>
      </div>
      <form onSubmit={onSubmit}>
        <label>
          {t.form.name}
          <input name="name" type="text" placeholder={t.form.namePlaceholder} required />
        </label>
        <label>
          {t.form.email}
          <input name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label>
          {t.form.topic}
          <select name="topic" required>
            <option value="">{t.form.topicPlaceholder}</option>
            {t.form.topics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label>
          {t.form.message}
          <textarea name="message" placeholder={t.form.contactPlaceholder} required />
        </label>
        <button className="btn primary" type="submit">{t.sendButton}</button>
      </form>
    </section>
  )
}

export function Toast({ toast }) {
  if (!toast) return null

  return (
    <div className={`toast ${toast.type}`} role="status" aria-live="polite">
      <strong>{toast.title}</strong>
      <span>{toast.message}</span>
    </div>
  )
}
