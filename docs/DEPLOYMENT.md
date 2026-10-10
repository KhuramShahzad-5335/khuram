# Publish to GitHub and Vercel

## Use this repository

The complete app is now at the repository root:

`C:\Users\Lenovo\Documents\ChatGPT\Portrtfolio Site`

Open this folder in your editor or GitHub Desktop. `package.json`, `app/`, and `.git/` belong to this same folder. The existing Git repository has been preserved; do not run `git init` again. The Desktop `khuram-portfolio` copy is a backup, and `.local-archive/` contains earlier staging files and research. Make future changes in this repository.

Only app source, public assets, configuration, the lockfile, and documents belong on GitHub. `.gitignore` excludes dependencies, generated builds, environment files, and the local archive. GitHub's website upload skips local Git history; use GitHub Desktop or Git instead.

## GitHub Desktop

1. Choose **File → Add local repository** and select the repository folder above.
2. Review the changes, enter an initial commit message, and commit.
3. Choose **Publish repository**, choose its name and visibility, and publish.

If GitHub Desktop says this is not a Git repository, confirm you selected the folder containing `.git/`, rather than `app/` or the Desktop backup.

## Git command line alternative

Create an empty repository on GitHub first, without adding a README, license, or `.gitignore`. Run these commands in PowerShell, replacing `YOUR-REPOSITORY` with its name:

```powershell
Set-Location -LiteralPath 'C:\Users\Lenovo\Documents\ChatGPT\Portrtfolio Site'
git status
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin https://github.com/KhuramShahzad-5335/YOUR-REPOSITORY.git
git push -u origin main
```

If Git asks for your identity, configure your preferred Git author name and email before committing. If you already published through GitHub Desktop, skip these commands.

## Vercel

1. In Vercel, add a new project and import the GitHub repository.
2. Use **Next.js** as the framework and leave **Root Directory** at the repository root (`./`). There is no `portfolio/` app subdirectory anymore.
3. Leave the framework's build and output settings at their defaults. Keep the committed `package-lock.json`; Vercel installs the declared dependencies and builds the app.
4. Set `NEXT_PUBLIC_SITE_URL` in the **Production** environment to your final HTTPS URL, with no trailing slash. For example, use your actual `https://your-project.vercel.app` address or your custom domain. Leave the variable unset in Preview to keep previews out of search indexes.
5. Deploy. If you discover your final address only after the first deployment, add the variable and redeploy. Adding or changing a domain also requires updating this variable and rebuilding.

This app uses Next.js static export. Vercel serves its generated pages; no database or separate backend is required. `npm start` is only the local static preview server.

The site intentionally disables indexing when `NEXT_PUBLIC_SITE_URL` is unset. After setting it and rebuilding, check the canonical URL, `/robots.txt`, and `/sitemap.xml` on the production domain. Review the sample testimonials and draft project stories before launch.

Official references: [Vercel Git deployment](https://vercel.com/docs/git), [build settings](https://vercel.com/docs/builds/configure-a-build), and [environment variables](https://vercel.com/docs/environment-variables).

## Work locally

```powershell
npm ci
npm run dev
```

To verify and preview the static build:

```powershell
npm run typecheck
npm run build
npm start
```

Open `http://127.0.0.1:3000`. Generated `out/` and `.next/` folders stay local.
