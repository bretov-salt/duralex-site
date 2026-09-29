import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MEASUREMENT_ID = "G-MRZN1ZN2RH"
TAG_URL = f"https://www.googletagmanager.com/gtag/js?id={MEASUREMENT_ID}"
PRIVATE_HTML = {
    ROOT / "business-plan" / "index.html",
    ROOT / "business-plan" / "secure" / "index.html",
}
PUBLIC_HTML = sorted(set(ROOT.rglob("*.html")) - PRIVATE_HTML)


class AnalyticsInstallationTests(unittest.TestCase):
    def test_every_public_page_loads_the_duralex_google_tag_once(self):
        self.assertGreater(len(PUBLIC_HTML), 1)
        for page in PUBLIC_HTML:
            with self.subTest(page=page.relative_to(ROOT)):
                html = page.read_text(encoding="utf-8")
                self.assertEqual(html.count(TAG_URL), 1)
                self.assertEqual(html.count('src="/assets/analytics.js"'), 1)

    def test_every_public_page_csp_allows_google_analytics_only_without_ads(self):
        for page in PUBLIC_HTML:
            with self.subTest(page=page.relative_to(ROOT)):
                html = page.read_text(encoding="utf-8")
                match = re.search(
                    r'<meta http-equiv="Content-Security-Policy" content="([^"]+)">',
                    html,
                )
                self.assertIsNotNone(match)
                policy = match.group(1)
                self.assertIn("script-src 'self'", policy)
                self.assertIn("https://www.googletagmanager.com", policy)
                self.assertIn("https://*.google-analytics.com", policy)
                self.assertIn("https://*.google.com", policy)
                self.assertNotIn("doubleclick.net", policy)
                self.assertNotIn("googlesyndication.com", policy)

    def test_local_initializer_configures_only_the_duralex_measurement_id(self):
        initializer = (ROOT / "assets" / "analytics.js").read_text(encoding="utf-8")
        self.assertIn(f"gtag('config', '{MEASUREMENT_ID}')", initializer)
        self.assertEqual(initializer.count(MEASUREMENT_ID), 1)
        self.assertNotIn("google_ads", initializer.lower())

    def test_confidential_business_plan_never_loads_analytics(self):
        for page in PRIVATE_HTML:
            with self.subTest(page=page.relative_to(ROOT)):
                html = page.read_text(encoding="utf-8")
                self.assertNotIn("googletagmanager.com", html)
                self.assertNotIn(MEASUREMENT_ID, html)


if __name__ == "__main__":
    unittest.main()
