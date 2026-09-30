# Security

- Read the PAT only from `GITLAB_PAT`.
- Send it only as the `PRIVATE-TOKEN` HTTP header.
- Never write it to files, provenance, Markdown, JSON results, or logs.
- Redact the token and header name in surfaced errors.
- Keep product IDs separate from secrets and review map changes.
- Use least-privilege GitLab token scopes appropriate for issue read/write.
