const projects = [
  {
    eyebrow: 'AI Documents',
    title: 'Doc LLM',
    description:
      'A document workspace for uploading PDFs, ingesting their contents, querying them with AI, and chatting per document.',
    tags: ['Next.js', 'RAG', 'PostgreSQL', 'pgvector'],
    href: 'https://github.com/uhanku/doc-llm',
    cta: 'View repository',
    accent: 'doc-blue',
    external: true,
    icon: 'assets/doc-llm-repo-icon.png',
    iconAlt: 'Doc LLM repository icon',
  },
  {
    eyebrow: 'AI Chat',
    title: 'Chat Bot Open',
    description:
      'A chat assistant app for visitor conversations, lead capture, long threads, summaries, and request limits.',
    tags: ['Next.js', 'PostgreSQL', 'OpenAI', 'Docker'],
    href: 'https://github.com/uhanku/chat-bot-open',
    cta: 'View repository',
    accent: 'chat-orange',
    external: true,
    icon: 'assets/chat-bot-open-repo-icon.png',
    iconAlt: 'Chat Bot Open repository icon',
  },
  {
    eyebrow: 'Automation',
    title: 'GPT Runner',
    description:
      'A NestJS API for creating jobs, preparing disposable workspaces, running commands, and collecting artifacts.',
    tags: ['NestJS', 'TypeScript', 'MongoDB', 'Docker'],
    href: 'https://github.com/uhanku/gpt-runner',
    cta: 'View repository',
    accent: 'runner-teal',
    external: true,
    icon: 'assets/gpt-runner-repo-icon.png',
    iconAlt: 'GPT Runner repository icon',
  },
  {
    eyebrow: 'Build in Public',
    title: 'Blog / Dev Logs',
    description:
      'A place for build-in-public notes, technical decisions, progress updates, screenshots, and lessons learned.',
    tags: ['Docs', 'Progress', 'AI', 'Lessons'],
    href: '/blog',
    cta: 'Open blog',
    accent: 'purple',
    external: false,
  },
]

const grid = document.querySelector('#project-grid')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function createProjectCard(project) {
  const card = document.createElement('a')
  card.className = `project-card project-card--${project.accent}`
  card.href = project.href

  if (project.external) {
    card.target = '_blank'
    card.rel = 'noreferrer'
  }

  const iconMarkup = project.icon
    ? `<span class="project-card__icon">
        <img src="${escapeHtml(project.icon)}" alt="${escapeHtml(project.iconAlt)}" />
      </span>`
    : `<span class="project-card__blog-icon" aria-hidden="true">
        <span>⌁</span>
      </span>`

  card.innerHTML = `
    <div class="project-card__top">
      <span class="project-card__eyebrow">${escapeHtml(project.eyebrow)}</span>
      ${iconMarkup}
    </div>

    <div class="project-card__header">
      <h2>${escapeHtml(project.title)}</h2>
      <span class="project-card__arrow" aria-hidden="true">${project.external ? '↗' : '→'}</span>
    </div>

    <p>${escapeHtml(project.description)}</p>

    <ul class="project-card__tags" aria-label="${escapeHtml(project.title)} tags">
      ${project.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}
    </ul>

    <span class="project-card__cta">${escapeHtml(project.cta)}</span>
  `

  return card
}

projects.forEach((project) => {
  grid.appendChild(createProjectCard(project))
})
