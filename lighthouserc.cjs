module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx vite preview --port 4173',
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/br',
        'http://localhost:4173/about',
        'http://localhost:4173/contact',
        'http://localhost:4173/terms-of-use',
        'http://localhost:4173/privacy-policy',
        'http://localhost:4173/gdpr',
        'http://localhost:4173/not-found',
        'http://localhost:4173/gl',
        'http://localhost:4173/portfolio/melissa',
        'http://localhost:4173/portfolio/metcha',
        'http://localhost:4173/portfolio/brazilian-leather',
        'http://localhost:4173/br/portfolio/melissa',
        'http://localhost:4173/br/portfolio/metcha',
        'http://localhost:4173/br/portfolio/brazilian-leather',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // Performance is exempt by policy (heavy WebGL/canvas site) — kept as
        // a warn so regressions still surface without gating the build.
        'categories:performance': ['warn', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
