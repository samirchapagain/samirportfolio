# Samir Chapagai Portfolio

A provider-independent, static portfolio site for Samir Chapagai. It uses plain HTML, CSS, and JavaScript with no build step. Content can be edited through the free Decap CMS at `/admin`.

## Update the content

1. Open `index.html` and replace `YOUR_GITHUB_URL`, `YOUR_LINKEDIN_URL`, `YOUR_EMAIL`, and `YOUR_CV_PDF`.
2. Edit `content/portfolio.json`, or use the `/admin` CMS after configuring it. Projects and skills are rendered from this data.
3. Add verified certifications to the certifications section only when the certificate, date, and verification details are available.
4. Replace placeholder project/documentation links with evidence you are comfortable publishing. Do not add fabricated findings, credentials, or results.

## Preview

Open `index.html` directly in a browser. For a local server, run `python -m http.server 8000` from this directory, then visit `http://localhost:8000`.

## Deploy and configure `samirchapagai.com.np`

1. Upload the three site files and any PDFs or documents to your chosen static hosting platform.
2. Copy the deployment URL supplied by that platform.
3. In the `.com.np` domain registrar/DNS panel, add the platform's requested `CNAME` or `A` records for the root domain and `www` host.
4. Wait for DNS propagation and verify with a DNS lookup from more than one network.
5. Enable the host's HTTPS certificate and redirect HTTP to HTTPS.
6. Test navigation, project dialogs, the CV link, email links, keyboard navigation, and the responsive layout on desktop and mobile.

The contact form intentionally opens the visitor's email client and does not transmit or store data. Connect it to a trusted, validated backend only when one is configured.

## Enable the free admin CMS

1. Put this project in a GitHub repository and replace `YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME` in `admin/config.yml`.
2. Create a GitHub OAuth App at **GitHub → Settings → Developer settings → OAuth Apps**. Set the callback URL to `https://samirchapagai.com.np/api/auth/callback`.
3. In Vercel, import the repository and add these environment variables (Production):
   - `GITHUB_OAUTH_CLIENT_ID` — the OAuth App client ID
   - `GITHUB_OAUTH_CLIENT_SECRET` — the OAuth App client secret
4. Deploy the site, then visit `https://samirchapagai.com.np/admin`.
5. Sign in with the GitHub account that has write access to the repository. Saving content creates a GitHub commit, which triggers automatic Vercel deployment.

The CMS software is free; hosting providers and domain registration may have separate limits or costs.
