# Components

Below are practical, copy-pasteable patterns.

## FAQ

<div class="accordion" data-accordion-group="faq">
  <details open>
    <summary>What is the data refresh schedule?</summary>
    <div class="accordion-body">
      Nightly at 02:00 UTC, with incremental loads every 15 minutes.
    </div>
  </details>

  <details>
    <summary>How do I request access?</summary>
    <div class="accordion-body">
      Open a ticket with Security and include your project and read-only group.
    </div>
  </details>

  <details>
    <summary>Where are the audit logs?</summary>
    <div class="accordion-body">
      S3 → <code>s3://company-logs/audit/...</code>. Retained 365 days.
    </div>
  </details>
</div>
---

<div class="accordion" data-accordion-group="faq">

<details>
  <summary>
    :material-database: Data refresh schedule
  </summary>
  <div class="accordion-body">
    Nightly at **2:00 AM UTC** with 15-minute incremental syncs during peak hours.
  </div>
</details>

<details>
  <summary>
    :material-lock: Access management
  </summary>
  <div class="accordion-body">
    Access requests must go through IT Security → “Data Access” queue in ServiceNow.
  </div>
</details>

</div>

---
<div class="accordion flush" data-accordion-group="setup">

<details>
  <summary>:material-cog: Installation</summary>
  <div class="accordion-body">
    Run `pip install mkdocs-material` to install.
  </div>
</details>

<details>
  <summary>:material-code-braces: Configuration</summary>
  <div class="accordion-body">
    Edit `mkdocs.yml` and include required extensions.
  </div>
</details>

</div>

---

<div class="accordion" data-accordion-group="alerts">

<details class="info">
  <summary>:material-information: Info notice</summary>
  <div class="accordion-body">General tips and best practices.</div>
</details>

<details class="success">
  <summary>:material-check-circle: Success case</summary>
  <div class="accordion-body">Operation completed successfully!</div>
</details>

<details class="warning">
  <summary>:material-alert: Warning</summary>
  <div class="accordion-body">Check your configuration settings.</div>
</details>

</div>

---

## Deployment Checklist

<div class="accordion flush" data-accordion-group="deploy">

<details class="info" open>
  <summary>:material-server: Pre-deployment checks</summary>
  <div class="accordion-body">
    - Validate environment variables  
    - Run unit tests  
    - Confirm pipeline version
  </div>
</details>

<details class="success">
  <summary>:material-cloud-upload: Deploy</summary>
  <div class="accordion-body">
    Use GitLab CI:  
    ```bash
    git push origin main
    ```
  </div>
</details>

<details class="warning">
  <summary>:material-bug: Troubleshooting</summary>
  <div class="accordion-body">
    See the [Runbook](../../operations/runbook.md){ .md-button } for common issues.
  </div>
</details>

</div>



## Cards

Include the HTML partial (provided in `docs/_includes/ui-cards.html`):

--8<-- "ui-cards.html"

> Tip: Use the **Density** button to preview compact spacing.

<div class="ui-cards">
  <div class="grid">
    <article class="card">
      <!-- <div class="media"></div> -->
      <div class="content">
        <h2 class="title">Style Check</h2>
        <p class="sub">If this looks plain, card.css isn’t loading.</p>
      </div>
      <div class="actions-row"><span class="price">$0</span></div>
    </article>
  </div>
</div>

---

## Buttons

[Primary](#){ .md-button .md-button--primary }
[Secondary](#){ .md-button }
[Outline](#){ .md-button .btn-outline }
[Small](#){ .md-button .btn-sm }
[Large](#){ .md-button .btn-lg }

---

## Expanders / Details

??? note "Click to expand (Details)"
    This text is hidden until expanded. Great for advanced tips, extra code, and FAQs.

???+ warning "Pinned and open by default"
    Add a `+` after `???` to render open on load.

---

## Grids

### Auto-fit 3 columns

<div class="grid cols-3 gap-lg" markdown>
- **Card A**  
  Short text block for column A.

- **Card B**  
  Another block for column B.

- **Card C**  
  Third column content.
</div>

> Change `cols-3` to `cols-2`, `cols-4`, and adjust `gap-lg` to `gap-sm | gap-md | gap-xl`.

---

## Cards

<div class="grid cards cols-3 gap-lg" markdown>
- :material-rocket: **Launch Plan**  
  Status: ✅ Ready  
  [View plan](#){ .md-button .md-button--primary }

- :material-cloud-check: **Environments**  
  Dev / QA / Prod  
  [Switch env](#){ .md-button }

- :material-security: **Security**  
  Least privilege, SSO, audit trails  
  [Docs](#){ .md-button .btn-outline }
</div>

---

## Tables

### Classic (Markdown)

| ID | Name        | Status |
|----|-------------|--------|
| 01 | Providers   | ✅     |
| 02 | Members     | ⚠️     |
| 03 | Claims      | ✅     |

### Styled (Bootstrap-ish classes)

<table class="table table-striped table-hover table-compact">
  <thead><tr><th>Job</th><th>Duration</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Extract: Providers</td><td>18m</td><td><span class="badge badge-success">Success</span></td></tr>
    <tr><td>Transform: Claims</td><td>31m</td><td><span class="badge badge-warning">Delayed</span></td></tr>
    <tr><td>Load: Pins</td><td>7m</td><td><span class="badge badge-success">Success</span></td></tr>
  </tbody>
</table>

> Add `.table-bordered`, `.table-shadow`, `.table-rounded` as needed.

---

## Admonitions (Callouts)

!!! success "Deployment complete"
    Version `v1.3.0` rolled out with zero errors.

!!! warning "SLA at risk"
    P95 exceeded for the last 2 runs. Investigate transformations.

!!! danger "Incident"
    Data freshness violated > 2h. Pager duty engaged.

---

## Tabs

=== "Python"
    ```python
    def ping():
        return "pong"
    ```

=== "Bash"
    ```bash
    echo "pong"
    ```

---

## Icons (Emoji / Material Icons)

- :material-database: Database
- :material-github: GitHub
- :material-timer-sand: SLA
- :material-alert: Incident

---

## Badges

### Inline badges

Normal text with a <span class="badge badge-success">Success</span> badge.  
Another with <span class="badge badge-warning">Warning</span> and one for <span class="badge badge-danger">Error</span>.

### Badge table

<table class="table table-striped table-hover">
  <thead><tr><th>Job</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>Extract Providers</td><td><span class="badge badge-success">Success</span></td></tr>
    <tr><td>Transform Claims</td><td><span class="badge badge-warning">Delayed</span></td></tr>
    <tr><td>Load Pins</td><td><span class="badge badge-danger">Failed</span></td></tr>
  </tbody>
</table>


---

## Clean DataTable

- Click a **column name** to sort.
- Click the small **caret** next to a column name to open its filter (multi-select).
- Use the **search** (left) and **pager** (right) above the table.

<div class="table-note" markdown>
This design keeps the UX minimal—no extra toolbar buttons, no separate filter row, and no selection column.
</div>

<table class="table table-striped table-hover table-rounded datatable-clean">
  <thead>
    <tr>
      <th>Pipeline</th>
      <th>P95 (min)</th>
      <th>Owner</th>
      <th>Status</th>
      <th>Run Date</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Providers</td><td>14</td><td>Ada</td><td>Success</td><td>2025-11-02</td></tr>
    <tr><td>Claims</td><td>31</td><td>Lin</td><td>Delayed</td><td>2025-11-03</td></tr>
    <tr><td>Pins Load</td><td>7</td><td>Noor</td><td>Success</td><td>2025-11-03</td></tr>
    <tr><td>Members</td><td>22</td><td>Jo</td><td>Success</td><td>2025-11-01</td></tr>
    <tr><td>Address Cleanse</td><td>14</td><td>Kim</td><td>Failed</td><td>2025-10-31</td></tr>
    <tr><td>Eligibility</td><td>19</td><td>Max</td><td>Success</td><td>2025-11-04</td></tr>
    <tr><td>Authorizations</td><td>28</td><td>Rae</td><td>Delayed</td><td>2025-11-02</td></tr>
    <tr><td>Dedupe NPI</td><td>9</td><td>Sam</td><td>Success</td><td>2025-11-03</td></tr>
    <tr><td>Payments</td><td>33</td><td>Eli</td><td>Failed</td><td>2025-11-03</td></tr>
    <tr><td>Denials</td><td>16</td><td>Ada</td><td>Success</td><td>2025-11-04</td></tr>
    <tr><td>Appeals</td><td>26</td><td>Lin</td><td>Delayed</td><td>2025-11-02</td></tr>
    <tr><td>Encounters</td><td>18</td><td>Noor</td><td>Success</td><td>2025-11-03</td></tr>
  </tbody>
</table>
