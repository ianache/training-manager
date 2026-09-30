import json
import urllib.error
import urllib.parse
import urllib.request


class GitLabError(RuntimeError):
    pass


class GitLabClient:
    def __init__(self, base_url: str, pat: str, timeout: int = 30):
        self.base_url = base_url.rstrip("/")
        self.pat = pat
        self.timeout = timeout

    def _request(self, method: str, path: str, payload=None):
        url = f"{self.base_url}{path}"
        data = json.dumps(payload).encode() if payload is not None else None
        request = urllib.request.Request(url, data=data, method=method, headers={
            "PRIVATE-TOKEN": self.pat,
            "Content-Type": "application/json",
            "Accept": "application/json",
        })
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise GitLabError(f"GitLab HTTP {exc.code}: {detail[:500]}") from exc
        except urllib.error.URLError as exc:
            raise GitLabError(f"GitLab network error: {exc.reason}") from exc

    def list_issues(self, project_id: int, concept_id: str):
        query = urllib.parse.urlencode({"search": concept_id, "per_page": 100})
        return self._request("GET", f"/api/v4/projects/{project_id}/issues?{query}")

    def create_issue(self, project_id: int, issue: dict):
        return self._request("POST", f"/api/v4/projects/{project_id}/issues", issue)

    def update_issue(self, project_id: int, issue_iid: int, issue: dict):
        return self._request("PUT", f"/api/v4/projects/{project_id}/issues/{issue_iid}", issue)
