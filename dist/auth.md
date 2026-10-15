# auth.md — luiskr.com

Authentication and agent-registration guidance for AI agents and automated clients.

## Audience

Agents, crawlers, and other automated systems consuming content from `https://luiskr.com`.

## Step 1 — Discover the protected resource

```http
GET https://luiskr.com/.well-known/oauth-protected-resource
```

The PRM document (RFC 9728) names `https://luiskr.com` as the resource and
`https://accounts.google.com` as its authorization server.

## Step 2 — Read the authorization-server metadata

```http
GET https://luiskr.com/.well-known/oauth-authorization-server
```

The metadata carries an `agent_auth` block describing this service's
registration surface:

```json
{
  "agent_auth": {
    "skill": "https://luiskr.com/auth.md",
    "register_uri": "https://luiskr.com/auth.md",
    "identity_types_supported": ["anonymous"],
    "anonymous": {
      "credential_types_supported": ["none"],
      "claim_uri": "https://luiskr.com/auth.md"
    }
  }
}
```

## Step 3 — Register (anonymous)

`identity_types_supported` is `anonymous` only. For anonymous access there is no
registration ceremony and no provisioning endpoint: `register_uri` resolves to
this document and no `POST /agent/auth` endpoint exists. Fetching any public
URL without credentials **is** the anonymous registration — access is granted
immediately, no credential is issued, and none is needed.

- Pages and the docs portal: `/`, `/docs`
- Machine-readable content: `/docs-content/**` (JSON), `/llms.txt`, `/ai-catalog.json`
- Discovery metadata: `/.well-known/api-catalog`, `/openapi.json`, `/sitemap.xml`

For access beyond the public endpoints, contact
[luis.krotz@gmail.com](mailto:luis.krotz@gmail.com).

## Credentials

Not applicable — this site issues and accepts no credentials for public content.
Do not send `Authorization` headers or API keys; they are ignored.

## Usage preferences

Content-usage preferences are declared via the `Content-Signal` response header
and `/robots.txt` (`ai-train=no, search=yes, ai-input=no`). `Link` response
headers advertise the machine-readable resources above (RFC 8288 / RFC 9727).
