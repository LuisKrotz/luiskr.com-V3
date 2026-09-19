/**
 * Implementation Plan: Fix Shadow DOM style isolation — media-figure sizing
 * 
 * ROOT CAUSE:
 * <media-figure> uses Shadow DOM. The internals.scss rules that define sizes for
 * .internal-extra-item .render-placeholder CANNOT pierce the Shadow Root boundary.
 * Inside the shadow root, .render-placeholder only has width:100% of the :host,
 * and :host has width:100% of .internal-extra-item which has width:min-content.
 * This causes zero-height collapsed slides in the carousel.
 *
 * SOLUTION:
 * CSS Custom Properties DO cross shadow boundaries.
 * The parent context (internals.scss) will set --media-placeholder-w and 
 * --media-placeholder-h on the <media-figure> host. media-figure.scss reads 
 * these to size the placeholder correctly.
 *
 * CHANGES REQUIRED:
 * 1. internals.scss: Add --media-placeholder-w/h on media-figure inside .internal-extra-item
 * 2. media-figure.scss: Use var(--media-placeholder-w) and var(--media-placeholder-h) 
 *    for .render-placeholder sizing
 * 3. Ensure .internal-extra-item has correct display (inline-flex not inline-block width:min-content)
 * 4. Fix carousel-host.scss to ensure carousel-slide stretches correctly
 */
