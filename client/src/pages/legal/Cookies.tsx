import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cookies = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Startseite</span>
        </Link>
        
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-gold-dark)' }}>
          Cookie-Richtlinie
        </h1>
      </div>

      <div className="card space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Was sind Cookies?
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Cookies sind kleine Textdateien, die von Websites auf Ihrem Computer oder mobilen Gerät gespeichert werden. Sie ermöglichen es der Website, sich an Ihre Aktionen und Präferenzen (wie Login, Sprache, Schriftgröße und andere Anzeigeeinstellungen) über einen bestimmten Zeitraum zu erinnern.</p>
            <p>Dies bedeutet, dass Sie diese Informationen nicht erneut eingeben müssen, wenn Sie zu der Website zurückkehren oder zwischen den Seiten browsen.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Wie verwenden wir Cookies?
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Wir verwenden Cookies aus verschiedenen Gründen, die im Detail unten aufgeführt sind. Leider gibt es in den meisten Fällen keine branchenüblichen Optionen zum Deaktivieren von Cookies, ohne die Funktionalität und Features, die sie zu dieser Website hinzufügen, vollständig zu deaktivieren.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Arten von Cookies
          </h2>
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-silk-green-dark)' }}>
                Notwendige Cookies
              </h3>
              <p><strong>Zweck:</strong> Diese Cookies sind für das ordnungsgemäße Funktionieren der Website unerlässlich.</p>
              <div className="mt-3">
                <p><strong>Verwendete Cookies:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><code>session_id</code> - Zur Verwaltung Ihrer Browsersitzung</li>
                  <li><code>csrf_token</code> - Zum Schutz vor Cross-Site-Request-Forgery-Angriffen</li>
                  <li><code>auth_token</code> - Zur sicheren Authentifizierung</li>
                </ul>
              </div>
              <p className="mt-3"><strong>Speicherdauer:</strong> Session-basiert (werden beim Schließen des Browsers gelöscht)</p>
              <p><strong>Rechtliche Grundlage:</strong> Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-silk-green-dark)' }}>
                Funktionale Cookies
              </h3>
              <p><strong>Zweck:</strong> Diese Cookies ermöglichen es uns, uns an Ihre Präferenzen zu erinnern und die Website-Funktionalität zu verbessern.</p>
              <div className="mt-3">
                <p><strong>Verwendete Cookies:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><code>theme_preference</code> - Speichert Ihre Auswahl zwischen hellem und dunklem Modus</li>
                  <li><code>language_preference</code> - Speichert Ihre bevorzugte Sprache</li>
                  <li><code>currency_preference</code> - Speichert Ihre bevorzugte Währung</li>
                  <li><code>cart_items</code> - Speichert Artikel in Ihrem Warenkorb</li>
                  <li><code>wishlist_items</code> - Speichert Artikel auf Ihrer Wunschliste</li>
                </ul>
              </div>
              <p className="mt-3"><strong>Speicherdauer:</strong> 30 Tage</p>
              <p><strong>Rechtliche Grundlage:</strong> Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-silk-green-dark)' }}>
                Analytische Cookies
              </h3>
              <p><strong>Zweck:</strong> Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.</p>
              <div className="mt-3">
                <p><strong>Verwendete Cookies:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><code>_ga</code> - Google Analytics Tracking</li>
                  <li><code>_gid</code> - Google Analytics Session-Tracking</li>
                  <li><code>page_views</code> - Seitenaufrufe zählen</li>
                </ul>
              </div>
              <p className="mt-3"><strong>Speicherdauer:</strong> 2 Jahre</p>
              <p><strong>Rechtliche Grundlage:</strong> Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-silk-green-dark)' }}>
                Marketing Cookies
              </h3>
              <p><strong>Zweck:</strong> Diese Cookies werden verwendet, um Werbung relevanter für Sie und Ihre Interessen zu machen.</p>
              <div className="mt-3">
                <p><strong>Verwendete Cookies:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><code>ad_preferences</code> - Speichert Werbepräferenzen</li>
                  <li><code>marketing_consent</code> - Marketing-Einwilligung</li>
                </ul>
              </div>
              <p className="mt-3"><strong>Speicherdauer:</strong> 1 Jahr</p>
              <p><strong>Rechtliche Grundlage:</strong> Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Cookie-Einstellungen verwalten
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Sie haben verschiedene Möglichkeiten, Cookies zu verwalten und zu kontrollieren:</p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border" style={{ backgroundColor: 'var(--color-nude-light)', borderColor: 'var(--color-gold-light)' }}>
              <h3 className="font-semibold mb-2">Browser-Einstellungen</h3>
              <p>Die meisten Webbrowser ermöglichen es Ihnen, Cookies über die Browsereinstellungen zu kontrollieren. Sie können:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Alle Cookies blockieren</li>
                <li>Nur Drittanbieter-Cookies blockieren</li>
                <li>Alle Cookies nach dem Schließen des Browsers löschen</li>
                <li>Vor dem Setzen eines Cookies eine Benachrichtigung erhalten</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border" style={{ backgroundColor: 'var(--color-silk-green-light)', borderColor: 'var(--color-silk-green-base)' }}>
              <h3 className="font-semibold mb-2">Unsere Cookie-Einstellungen</h3>
              <p>Sie können Ihre Cookie-Präferenzen auch direkt über unsere Website verwalten:</p>
              <div className="mt-3">
                <button 
                  className="btn-secondary mr-3 mb-2"
                  onClick={() => alert('Cookie-Einstellungen öffnen (Funktion wird implementiert)')}
                >
                  Cookie-Einstellungen öffnen
                </button>
                <button 
                  className="btn-primary mb-2"
                  onClick={() => alert('Alle Cookies akzeptieren')}
                >
                  Alle Cookies akzeptieren
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Auswirkungen der Cookie-Deaktivierung
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Wenn Sie Cookies deaktivieren, kann dies die Funktionalität der Website beeinträchtigen:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Sie müssen sich bei jedem Besuch erneut anmelden</li>
              <li>Ihre Warenkorb- und Wunschlisteninhalte gehen verloren</li>
              <li>Ihre bevorzugten Einstellungen werden nicht gespeichert</li>
              <li>Einige Funktionen der Website funktionieren möglicherweise nicht ordnungsgemäß</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-gold-dark)' }}>
            Kontakt
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Wenn Sie Fragen zu unserer Cookie-Richtlinie haben, kontaktieren Sie uns bitte:</p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p><strong>Ese-tech GmbH</strong></p>
              <p>E-Mail: cookies@ese-tech.de</p>
              <p>Telefon: +49 (0) 123 456789</p>
            </div>
          </div>
        </section>

        <section className="pt-6 border-t" style={{ borderColor: 'var(--color-gold-light)' }}>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Erstellt mit:</strong> ShopHub E-Commerce Platform by Ese-tech<br />
            <strong>Stand:</strong> November 2025<br />
            <strong>DSGVO-konform</strong> nach deutschem Recht
          </p>
        </section>
      </div>
    </div>
  );
};

export default Cookies;