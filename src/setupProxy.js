const https = require('https')

// CRA only loads this middleware in development. Keep the calendar on the
// parent's origin so its legacy window.top integrations work on localhost.
module.exports = function (app) {
  const target = new URL(process.env.REACT_APP_API_URL)

  app.use((req, res, next) => {
    if (!/^\/(admin|api|services|themes|upload)\//i.test(req.url)) {
      return next()
    }

    const upstream = https.request(
      new URL(req.url, target),
      {
        method: req.method,
        headers: {
          ...req.headers,
          host: target.host,
          ...(req.headers.origin ? { origin: target.origin } : {})
        }
      },
      response => {
        const headers = { ...response.headers }
        if (headers.location?.startsWith(target.origin + '/')) {
          headers.location = headers.location.slice(target.origin.length)
        }
        if (headers['set-cookie']) {
          headers['set-cookie'] = headers['set-cookie'].map(cookie =>
            cookie.replace(/;\s*domain=[^;]+/gi, '')
          )
        }
        res.writeHead(response.statusCode, headers)
        response.pipe(res)
      }
    )
    upstream.on('error', () => {
      if (!res.headersSent) res.writeHead(502)
      res.end('Không thể kết nối đến máy chủ bảng lịch.')
    })
    req.on('aborted', () => upstream.destroy())
    req.pipe(upstream)
  })
}
