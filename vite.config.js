import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.VITE_BASE_PATH || (process.env.VERCEL ? '/' : '/Sykoti-site-web/')

const cleanPageRoutes = {
  '/cyberambassador': '/cyberambassador/index.html',
  '/cyberambassador/': '/cyberambassador/index.html',
  '/cyberambassador/regiistration': '/cyberambassador/regiistration/index.html',
  '/cyberambassador/regiistration/': '/cyberambassador/regiistration/index.html',
}

function cleanPageRoutePlugin() {
  const rewriteCleanPageRoute = (req, _res, next) => {
    const [pathname, query] = (req.url || '').split('?')
    const basePrefix = base === '/' ? '' : base.replace(/\/$/, '')
    const routePath = basePrefix && pathname.startsWith(basePrefix)
      ? pathname.slice(basePrefix.length) || '/'
      : pathname
    const destination = cleanPageRoutes[routePath]
    if (destination) {
      req.url = `${basePrefix}${destination}${query ? `?${query}` : ''}`
    } else if (
      basePrefix
      && !pathname.startsWith(basePrefix)
      && (pathname.startsWith('/cyberambassador/') || pathname.startsWith('/img/'))
    ) {
      req.url = `${basePrefix}${pathname}${query ? `?${query}` : ''}`
    }
    next()
  }

  return {
    name: 'sykoti-clean-page-routes',
    configureServer(server) {
      server.middlewares.use(rewriteCleanPageRoute)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteCleanPageRoute)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [cleanPageRoutePlugin(), react()],
  base,
})
