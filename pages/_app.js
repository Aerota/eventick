@"
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
"@ | Out-File -FilePath pages/_app.js -Encoding utf8