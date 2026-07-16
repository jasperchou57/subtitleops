# AdSense and consent

AdSense is disabled by default. The application loads the AdSense tag only when
both of these build-time values are present:

```bash
VITE_ADSENSE_ENABLED=true
VITE_ADSENSE_CLIENT_ID=ca-pub-9498208038262605
```

Before enabling it in production:

1. Add and verify `subtitleops.com` in the SubtitleOps AdSense account.
2. In **Privacy & messaging**, create and publish a European regulations
   message using Google's certified CMP.
3. Offer **Consent**, **Do not consent**, and **Manage options** where
   applicable.
4. Enable consent mode for advertising and analytics purposes if GA4 should use
   the choices collected by Google's CMP.
5. Test the published message on the production domain.
6. Only then set the GitHub Actions repository variable
   `VITE_ADSENSE_ENABLED=true`.

The public disclosure is available at `/cookie`. Do not replace the certified
CMP with a custom cookie banner for EEA, UK, or Swiss personalized-ad traffic.
