def render_issue(concept: dict, product: str, kb_project_id: str | None = None) -> dict:
    """Render an OKF concept as a GitLab issue.

    If kb_project_id is provided, URLs will be regenerated using it as the source of truth.
    Otherwise, URLs from concept['knowledge_base'] will be used.
    """
    from kb_resolver import resolve_kb_urls, normalize_path

    concept_id = concept["id"]
    knowledge_base = concept["knowledge_base"]
    context_pack = knowledge_base["context_pack"]
    source_concept = knowledge_base["source_concept"]

    # Regenerate URLs if kb_project_id is provided
    if kb_project_id:
        kb = resolve_kb_urls(kb_project_id)
        context_pack_path = normalize_path(context_pack.get("path", ""))
        source_concept_path = normalize_path(source_concept.get("path", ""))
        context_pack["url"] = kb["build_url"](context_pack_path)
        source_concept["url"] = kb["build_url"](source_concept_path)
        knowledge_base["repository_url"] = kb["repository_url"]
        knowledge_base["kb_project_id"] = kb_project_id

    raw_title = concept.get("title", concept_id)
    title_text = raw_title[len(concept_id):].lstrip(" —-") if raw_title.startswith(concept_id) else raw_title
    title = f"{concept_id} — {title_text or concept_id}"
    source_uri = source_concept["url"]
    description = "\n".join([
        f"Source Concept: [{concept_id}]({source_uri})",
        f"OKF Version: {concept.get('okf', 'google-okf-v0.2')}",
        f"Product: {product}",
        f"Current Gate: {concept.get('gate')}",
        "Projection: operational work item; OKF remains the source of truth.",
        "",
        "## Objective",
        concept.get("objective", ""),
        "",
        "## Knowledge Source",
        f"- Knowledge Base: [{knowledge_base['name']}]({knowledge_base['repository_url']})",
        f"- Knowledge Base Repository: `{knowledge_base['repository_url']}` @ `{knowledge_base['ref']}`",
        f"- Context Pack: [{context_pack['id']}]({context_pack['url']})",
        f"- Source Concept: [{source_concept['id']}]({source_uri})",
        "",
        "## Lineage",
        f"Knowledge Concept: [{concept_id}]({source_uri})",
        "Publication Provider: gitlab",
        "Publication Status: pending",
    ])
    return {"title": title, "description": description, "labels": f"Producto::{product},AI::Cowork"}
