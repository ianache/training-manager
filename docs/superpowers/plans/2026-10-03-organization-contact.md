# Organization contact (work email + phone) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (native, chosen by ianache). TDD per step.

**Goal:** Organizations (units and providers) carry a mandatory work email and an optional work phone, 1..N active each; the email may match a collaborator's while BR-PTY-08 stays intact.

**Spec:** `knowledge-base/architecture/api/API-SPEC-002-organizations.md` §8b (approved by ianache 2026-10-03) and IMD-002 R-31, IM-Q12. This is an extension of `docs/superpowers/plans/2026-10-03-organizations-api.md` (already implemented).

## Global Constraints
- Service root `codebase/apps/domains/party-management-service`; tests `python -m pytest tests -q --no-cov`.
- New purposes `ORGANIZATION_EMAIL` (mechanism `EMAIL`) and `ORGANIZATION_PHONE` (mechanism `PHONE`). Collaborators keep `WORK_EMAIL`/`WORK_PHONE`; `ux_pcm_current_work_email` and `_email_taken` are NOT modified.
- Email mechanism rows are reused when the value exists (one row per value: `ux_contact_mechanism_email_active`).
- `POST` requires `contact.email_work` (`EmailStr`) and accepts `contact.phone_work` (same pattern as `PartyCreateRequest`). Responses/`GET` return `contact: {emails: [str], phones: [str]}` (current links only); organizations without contact return empty lists (no error).
- Breaking for `POST` clients (contact now mandatory) — documented in the spec; the portal never creates organizations.
- Commit per task with `graphify update .`; stage only own files (other sessions leave unrelated changes).

## Review Focus
- Collaborator created with an email already used by an organization → 201 (and the reverse); two collaborators with the same email → still `409 EMAIL_DUPLICATE` (BR-PTY-08).
- Same email on two organizations is allowed (both `ORGANIZATION_EMAIL` links on one mechanism; no unique index applies to that purpose).
- Race on creating the same email row → `409`, never `500`.
- Missing/invalid email or phone → `400`; extra keys in `contact` rejected.
- Organizations seeded without contact → `GET` returns empty lists.

### Task 1: Migration 0004 + seeds
**Files:** create `migrations/versions/0004_organization_contact_purposes.py`; modify `tests/schema/test_migrated_schema.py` (head = `0004_organization_contact_purposes`; new test: both purposes exist with the right mechanism type — Postgres-only, skipped here).
**Implement:** `upgrade()`: `INSERT INTO tb_contact_purpose_type (pk_code, name, fk_contact_mechanism_type_code) VALUES ('ORGANIZATION_EMAIL','Correo laboral de la organización','EMAIL'),('ORGANIZATION_PHONE','Teléfono laboral de la organización','PHONE')`; `downgrade()` deletes them. Add constants `PURPOSE_ORG_EMAIL`, `PURPOSE_ORG_PHONE` and phone mechanism usage to `app/models/party.py`.
**Verify:** full suite green.

### Task 2: Schema + create + read
**Files:** modify `app/schemas/organization.py` (`OrganizationContactIn`, required `contact` on `OrganizationCreateRequest`, `OrganizationContact`, `OrganizationOut.contact`), `app/services/organization_service.py`; tests in `tests/integration/test_organizations_create.py` and `test_organizations_api.py`.
**Tests first (RED):**
1. create returns `contact == {"emails": [e], "phones": [p]}`; `GET` returns the same; list too.
2. phone omitted → `phones == []`.
3. missing `contact`, missing `email_work`, invalid email, invalid phone, extra key in `contact` → 400.
4. organization email == existing collaborator email → 201; then creating another collaborator with that email → 409 (BR-PTY-08 intact); collaborator created *after* an organization with the same email → 201.
5. two organizations with the same email → both 201.
6. race: monkeypatch the email-row lookup to return `None` while the row exists → 409 `ORGANIZATION_DUPLICATE` (field `email`), not 500.
7. seeded organization without contact → `GET` returns `{"emails": [], "phones": []}`.
8. update existing fixtures `UNIT`/`PROVIDER` with `contact`.
**Implement:** in `create`, after the party/role rows: reuse mechanism via a helper `_email_row(email)` (same query as `PartyService._email_mechanism`), else new `ContactMechanism`; flush; link with `PURPOSE_ORG_EMAIL` (`PartyContactMechanism`, `from_date=today`); phone → new mechanism + `PURPOSE_ORG_PHONE`. In `_build`, one query joins current links (`thru_date IS NULL`, purposes ORG) to mechanism values (`anonymized_at IS NULL`) grouped by party. `_commit`: IntegrityError mentioning `email` → `ApiError(409, "ORGANIZATION_DUPLICATE", ..., {"field": "email"})`.
**Verify:** full suite green; mutation check: (a) link purpose `WORK_EMAIL` instead of ORG → test 4 fails; (b) drop mechanism reuse → test 4/5 fail; (c) drop `thru_date IS NULL` filter in read → add/keep a test with a closed link.

### Task 3: BFF + docs
**Files:** BFF needs no change (body passthrough) — add one BFF test that a body with `contact` is forwarded unchanged. Update `API-SPEC-002` (§3 contract with `contact`, §8b → implemented, Q table), IMD-002 (IM-Q12 confirmed as rule for US-024), `changelog.md`.
**Verify:** `npx vitest run` (BFF) green; service suite green.
