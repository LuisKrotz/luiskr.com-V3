# auth.md — luiskr.com

Authentication and registration guidance for AI agents and automated clients.

## Audience

Agents, crawlers, and other automated systems consuming content from `https://luiskr.com`.

## Authentication

No authentication or registration is required. All public content is readable over HTTPS without credentials:

- Pages and the docs portal: `/`, `/docs`
- Machine-readable content: `/docs-content/**` (JSON), `/llms.txt`, `/ai-catalog.json`
- Discovery metadata: `/.well-known/api-catalog`, `/openapi.json`, `/sitemap.xml`

## Registration

There is no agent registration or provisioning endpoint. For access beyond the public
endpoints, contact [luis.krotz@gmail.com](mailto:luis.krotz@gmail.com).

## Credentials

Not applicable — this site issues and accepts no credentials for public content.
Do not send `Authorization` headers or API keys; they are ignored.

## Usage preferences

Content-usage preferences are declared via `Content-Signal` in `/robots.txt`
(`ai-train=no, search=yes, ai-input=no`). `Link` response headers advertise the
machine-readable resources above (RFC 8288 / RFC 9727).
