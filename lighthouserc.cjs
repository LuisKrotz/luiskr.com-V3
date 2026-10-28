module.exports = {
  ci: {
    collect: {
      // preview-h2 mirrors Firebase Hosting's actual contract — h2 stream
      // multiplexing + build-emitted .br/.gz siblings + clean-URL 301s —
      // where `vite preview` (h1 + raw bytes) measured a wire profile no
      // production visitor ever sees.
      startServerCommand: 'node shared/scripts/serve/preview-h2.mjs',
      settings: {
        // The preview uses a self-signed localhost cert; the page under
        // audit is identical, only the transport auth check is relaxed.
        chromeFlags: '--ignore-certificate-errors',
      },
      url: [
        'https://localhost:4173/',
        'https://localhost:4173/about/',
        'https://localhost:4173/contact/',
        'https://localhost:4173/terms-of-use/',
        'https://localhost:4173/privacy-policy/',
        'https://localhost:4173/gdpr/',
        'https://localhost:4173/not-found',
        'https://localhost:4173/portfolio/melissa/',
        'https://localhost:4173/portfolio/metcha/',
        'https://localhost:4173/portfolio/dell-design-system/',
        'https://localhost:4173/br/',
        'https://localhost:4173/gn/portfolio/metcha/',
        'https://localhost:4173/hrk/portfolio/melissa/',
        'https://localhost:4173/es/portfolio/brazilian-leather/',
        'https://localhost:4173/ru/portfolio/mor/',
        'https://localhost:4173/riv/portfolio/coza/',
        'https://localhost:4173/tln/portfolio/minimelissa/',
        'https://localhost:4173/fr/portfolio/aboutmarco/',
        'https://localhost:4173/ga/portfolio/transa/',
        'https://localhost:4173/ca/portfolio/cecerele/',
        'https://localhost:4173/nl/portfolio/genesysinf-sageweb/',
        'https://localhost:4173/cas/portfolio/clinica-de-desenvolvimento-nathalia-bond/',
      ],
      numberOfRuns: 1,
    },
    assert: {
      // assertMatrix instead of flat `assertions` so /not-found can be
      // exempted from categories:seo — it MUST serve noindex by the
      // indexation contract (soft-404s self-exclude via setRobotsMeta),
      // which makes `is-crawlable` fail by design and caps the seo
      // category ~0.66. Every other URL keeps the full assertion set.
      // (assertMatrix cannot be combined with a top-level `assertions`.)
      assertMatrix: [
        {
          matchingUrlPattern: '/not-found',
          assertions: {
            'categories:performance': ['warn', { minScore: 0.8 }],
            'categories:accessibility': ['error', { minScore: 1 }],
            'categories:best-practices': ['error', { minScore: 1 }],

            'image-delivery-insight': 'warn',
            'modern-image-formats': 'warn',
            'uses-optimized-images': 'warn',
            'uses-responsive-images': 'warn',
            'efficient-animated-content': 'warn',
          },
        },
        {
          matchingUrlPattern: '^(?!.*not-found).*$',
          assertions: {
            // Category minimums — performance reports at warn (visibility
            // without gating); every other category keeps the 1.00 error floor.
            'categories:performance': ['warn', { minScore: 0.8 }],
            'categories:accessibility': ['error', { minScore: 1 }],
            'categories:best-practices': ['error', { minScore: 1 }],
            'categories:seo': ['error', { minScore: 1 }],

            // Image delivery is the one accepted performance finding — kept
            // as warn so it still surfaces in reports without failing the
            // gate. Every other performance audit must be fully addressed.
            // (Lighthouse ≥12 renamed the audit to *-insight; the old id is
            // a dead reference that logs "not a known audit".)
            'image-delivery-insight': 'warn',
            'modern-image-formats': 'warn',
            'uses-optimized-images': 'warn',
            'uses-responsive-images': 'warn',
            'efficient-animated-content': 'warn',
          },
        },
      ],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
