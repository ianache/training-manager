# GitLab REST API

Configured base: `https://project.comsatel.com.pe/api/v4`.

- Search: `GET /projects/:id/issues?search=<concept_id>`
- Create: `POST /projects/:id/issues`
- Update: `PUT /projects/:id/issues/:issue_iid`
- Authentication header: `PRIVATE-TOKEN: <PAT>`

These paths and the `iid` response field follow the official GitLab Issues API and REST authentication documentation:

- https://docs.gitlab.com/api/issues/
- https://docs.gitlab.com/api/rest/authentication/
