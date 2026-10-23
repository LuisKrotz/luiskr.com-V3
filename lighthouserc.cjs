module.exports = {
  ci: {
    collect: {
      startServerCommand: 'yarn vite preview --port 4173',
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
        // Category minimums — performance 0.80, every other category 1.00.
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],

        // Image delivery is the one accepted performance finding — kept as
        // warn so it still surfaces in reports without failing the gate.
        // Every other performance audit must be fully addressed.
        'image-delivery': 'warn',
        'modern-image-formats': 'warn',
        'uses-optimized-images': 'warn',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
