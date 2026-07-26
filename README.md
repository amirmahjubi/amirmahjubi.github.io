# Amir — AI Engineer Portfolio

A personal portfolio site built with **Jekyll** for **GitHub Pages**.

## Quick start

### 1. Edit your details

Update these files with your real info:

| File | What to change |
|------|----------------|
| `_config.yml` | Name, tagline, URL, email, social handles |
| `_data/projects.yml` | Selected work |
| `_data/experience.yml` | Roles and highlights |
| `_data/expertise.yml` | Focus areas |
| `_data/skills.yml` | Toolkit |
| `_data/navigation.yml` | Nav links |

Set `url` to your GitHub Pages URL, for example:

```yaml
url: "https://YOUR_USERNAME.github.io"
baseurl: ""
```

If the site lives in a project repo (`username.github.io/repo-name`), set:

```yaml
url: "https://YOUR_USERNAME.github.io"
baseurl: "/repo-name"
```

### 2. Run locally

Requires [Ruby](https://www.ruby-lang.org/) and Bundler.

```bash
bundle install
bundle exec jekyll serve
```

Open [http://127.0.0.1:4000](http://127.0.0.1:4000).

### 3. Publish on GitHub Pages

1. Create a repository named `YOUR_USERNAME.github.io` (user site) **or** any repo for a project site.
2. Push this folder to the `main` branch.
3. In **Settings → Pages**, set source to **Deploy from a branch** → `main` / `/ (root)`,  
   or use the GitHub Actions workflow if you prefer.
4. Wait a minute — your site will be live at `https://YOUR_USERNAME.github.io`.

## Writing

Add posts under `_posts/` using the naming pattern:

```text
YYYY-MM-DD-title-slug.md
```

The Writing section on the homepage appears automatically when posts exist.

## Structure

```text
├── _config.yml          # Site settings
├── _data/               # Projects, experience, skills
├── _includes/           # Header, hero, sections
├── _layouts/            # Page templates
├── _posts/              # Blog posts
├── assets/              # CSS, JS, favicon
├── index.md             # Home
└── writing.md           # Writing index
```

## License

Use freely for your personal portfolio.
