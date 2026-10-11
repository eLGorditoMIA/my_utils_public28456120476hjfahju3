<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CONCAT JSON Viewer</title>
    <style>
      :root {
        --bg: #0b1020;
        --panel: #111a33;
        --panel2: #0f1730;
        --text: #e7ecff;
        --muted: #a9b5e6;
        --accent: #6ea8fe;
        --danger: #ff6b6b;
        --ok: #51cf66;
        --border: rgba(255, 255, 255, 0.12);
        --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      }

      body {
        margin: 0;
        font-family: var(--sans);
        background: radial-gradient(1200px 900px at 20% 10%, #182458 0%, var(--bg) 55%);
        color: var(--text);
      }

      header {
        padding: 20px 18px 8px 18px;
        border-bottom: 1px solid var(--border);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
      }

      header h1 {
        margin: 0;
        font-size: 18px;
        letter-spacing: 0.2px;
      }

      header p {
        margin: 6px 0 0 0;
        color: var(--muted);
        font-size: 13px;
        line-height: 1.4;
      }

      main {
        padding: 14px 18px 22px 18px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }

      @media (max-width: 980px) {
        main {
          grid-template-columns: 1fr;
        }

        header {
          padding: 16px 14px 8px 14px;
        }

        .card .card-b {
          padding: 10px;
        }

        .row {
          gap: 6px;
        }

        button {
          width: 100%;
        }

        textarea {
          min-height: 200px;
        }

        pre {
          max-height: 420px;
        }
      }

      .card {
        border: 1px solid var(--border);
        background: rgba(17, 26, 51, 0.75);
        backdrop-filter: blur(8px);
        border-radius: 12px;
        overflow: hidden;
      }

      .card .card-h {
        padding: 10px 12px;
        font-size: 13px;
        color: var(--muted);
        border-bottom: 1px solid var(--border);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        min-width: 0;
      }

      .card .card-h > * {
        min-width: 0;
      }

      .card .card-b {
        padding: 12px;
      }

      textarea {
        width: 100%;
        min-height: 240px;
        resize: vertical;
        box-sizing: border-box;
        padding: 10px 10px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: rgba(15, 23, 48, 0.85);
        color: var(--text);
        font-family: var(--mono);
        font-size: 12px;
        line-height: 1.4;
        outline: none;
      }

      textarea:focus {
        border-color: rgba(110, 168, 254, 0.65);
        box-shadow: 0 0 0 3px rgba(110, 168, 254, 0.15);
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }

      button {
        border: 1px solid var(--border);
        background: rgba(110, 168, 254, 0.18);
        color: var(--text);
        padding: 8px 10px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 12px;
        max-width: 100%;
        white-space: nowrap;
      }

      button:hover {
        border-color: rgba(110, 168, 254, 0.7);
        background: rgba(110, 168, 254, 0.26);
      }

      button.secondary {
        background: rgba(255, 255, 255, 0.08);
      }

      button.danger {
        background: rgba(255, 107, 107, 0.16);
      }

      .status {
        font-family: var(--mono);
        font-size: 12px;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: rgba(15, 23, 48, 0.85);
        color: var(--muted);
        overflow: auto;
        max-width: 100%;
      }

      /* History box looks like status but does NOT force scrollbars */
      .historyBox {
        font-family: var(--mono);
        font-size: 12px;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: rgba(15, 23, 48, 0.85);
        color: var(--muted);
        overflow: visible;
        max-width: 100%;
      }

      .status.ok {
        color: var(--ok);
        border-color: rgba(81, 207, 102, 0.4);
      }
      .status.bad {
        color: var(--danger);
        border-color: rgba(255, 107, 107, 0.45);
      }

      pre {
        margin: 0;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: rgba(15, 23, 48, 0.85);
        color: var(--text);
        overflow: auto;
        max-height: 560px;
        font-family: var(--mono);
        font-size: 12px;
        line-height: 1.45;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .grid2 {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .kv {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--mono);
        font-size: 12px;
        overflow: hidden;
        border-radius: 10px;
        border: 1px solid var(--border);
      }

      .kv th,
      .kv td {
        padding: 8px 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        vertical-align: top;
      }

      .kv th {
        text-align: left;
        color: var(--muted);
        background: rgba(255, 255, 255, 0.05);
        width: 38%;
      }

      .kv td {
        white-space: pre-wrap;
        word-break: break-word;
        background: rgba(15, 23, 48, 0.55);
      }

      .pill {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.06);
        color: var(--muted);
        font-size: 11px;
        font-family: var(--mono);
      }

      .small {
        font-size: 11px;
        color: var(--muted);
      }
    </style>
  </head>
  <body>
    <header>
      <h1>CONCAT JSON Viewer</h1>
      <p>
        Paste your ServiceNow <span class="pill">CONCAT("{...}")</span> expression (or just the JSON) and click <b>Render</b>. It will extract the JSON template and show it as pretty JSON + a
        key/value table.
      </p>
    </header>

    <main>
      <section class="card">
        <div class="card-h">
          <div>Input</div>
          <div class="small">Tip: You can paste the full CONCAT expression as-is.</div>
        </div>
        <div class="card-b">
          <textarea id="input" spellcheck="false"></textarea>
          <div class="row">
            <button id="renderBtn">Render</button>
            <button id="copyTemplateBtn" class="secondary">Copy extracted JSON template</button>
            <button id="settingsBtn" class="secondary">Settings</button>
            <button id="clearBtn" class="danger">Clear</button>
          </div>

          <div id="settingsPanel" class="card" style="display: none; margin-top: 12px; border-radius: 12px">
            <div class="card-h">
              <div>Settings</div>
              <div class="row" style="margin: 0; gap: 8px">
                <button id="settingsCloseBtn" class="danger">Close</button>
              </div>
            </div>
            <div class="card-b" style="background: rgba(17, 26, 51, 0.35)">
              <div style="margin-bottom: 14px">
                <div style="font-size: 12px; color: var(--text); margin-bottom: 6px">History settings</div>
                <div class="small" style="margin-bottom: 10px">Controls how many history entries show per page and how many are retained.</div>

                <div class="row" style="margin-top: 0">
                  <label class="small" style="display: flex; align-items: center; gap: 8px">
                    Page size
                    <input
                      id="historyPageSize"
                      type="number"
                      min="1"
                      max="50"
                      value="6"
                      style="
                        width: 72px;
                        padding: 6px 8px;
                        border-radius: 10px;
                        border: 1px solid rgba(255, 255, 255, 0.16);
                        background: rgba(15, 23, 48, 0.65);
                        color: var(--text);
                        font-family: var(--mono);
                        font-size: 12px;
                      "
                    />
                  </label>
                </div>
              </div>

              <div style="margin-bottom: 14px">
                <div style="font-size: 12px; color: var(--text); margin-bottom: 6px">Editor settings</div>
                <div class="small">(placeholder for future)</div>
              </div>

              <div>
                <div style="font-size: 12px; color: var(--text); margin-bottom: 6px">Output settings</div>
                <div class="small">(placeholder for future)</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div id="status" class="status">Waiting for input…</div>
          </div>

          <div class="row" style="margin-top: 10px; align-items: flex-start">
            <div style="width: 100%">
              <div class="small" style="margin: 0 0 6px 0; display: flex; align-items: center; justify-content: space-between; gap: 10px">
                <span>History</span>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
                  <button id="historyPrevBtn" class="secondary">← Prev</button>
                  <div id="historyPageInfo" class="small" style="min-width: 140px; text-align: center">Page 1 of 1</div>
                  <button id="historyNextBtn" class="secondary">Next →</button>

                  <label class="small" style="display: flex; align-items: center; gap: 8px">
                    Max saved
                    <input
                      id="historyLimit"
                      type="number"
                      min="0"
                      max="200"
                      value="10"
                      style="
                        width: 84px;
                        padding: 6px 8px;
                        border-radius: 10px;
                        border: 1px solid rgba(255, 255, 255, 0.16);
                        background: rgba(15, 23, 48, 0.65);
                        color: var(--text);
                        font-family: var(--mono);
                        font-size: 12px;
                      "
                    />
                  </label>

                  <button id="clearHistoryBtn" class="danger">Clear history</button>
                  <button id="purgeHistoryBtn" class="danger">Purge storage</button>
                </div>
              </div>
              <div id="history" class="historyBox" style="overflow-x: hidden; white-space: normal">(no history yet)</div>
            </div>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-h">
          <div>Readable output</div>
          <div class="small">This is the JSON <i>template</i>. It will keep tokens like <span class="pill">@state.foo</span> intact.</div>
        </div>
        <div class="card-b">
          <div class="grid2">
            <div>
              <div class="small" style="margin: 0 0 6px 0; display: flex; align-items: center; justify-content: space-between; gap: 10px">
                <span>Pretty JSON</span>
                <button id="copyPrettyBtn" class="secondary">Copy pretty JSON</button>
              </div>
              <pre id="pretty">(rendered JSON will appear here)</pre>

              <div style="margin-top: 10px">
                <div class="small" style="margin: 0 0 6px 0; display: flex; align-items: center; justify-content: space-between; gap: 10px">
                  <span>Generated CONCAT</span>
                  <button id="copyConcatBtn" class="secondary">Copy CONCAT</button>
                </div>
                <pre id="concatOut" style="white-space: pre-wrap; word-break: break-word">(generated CONCAT will appear here)</pre>
                <div class="small" style="margin-top: 6px">
                  Tokens <span class="pill">{{...}}</span> are treated as <b>string tokens</b> by default (quoted), matching the original working pattern. Use <span class="pill">{{{...}}}</span> only
                  when you want a <b>raw token</b> (unquoted, for booleans/numbers). Example: <span class="pill">{{@state.clientNameTemp}}</span> (string) vs
                  <span class="pill">{{{@state.allow_partial_search}}}</span> (raw).
                </div>
              </div>
            </div>
            <div>
              <div class="small" style="margin: 0 0 6px 0">Key / Value</div>

              <div class="row" style="margin-top: 0; margin-bottom: 8px">
                <button id="addFieldBtn" class="secondary">Add field</button>
                <button id="deleteSelectedBtn" class="danger">Delete selected</button>
                <button id="copyEditedJsonBtn" class="secondary">Copy edited JSON</button>
              </div>

              <div class="row" style="margin-top: 0">
                <label class="small" style="display: flex; align-items: center; gap: 8px">
                  <input id="editModeToggle" type="checkbox" checked />
                  Enable editing
                </label>
              </div>

              <div id="addInline" style="margin: 8px 0 10px 0; padding: 10px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(15, 23, 48, 0.55)">
                <div class="small" style="margin-bottom: 8px">Add a field</div>
                <div class="row" style="margin-top: 0">
                  <input
                    id="newKey"
                    type="text"
                    placeholder="key (e.g. customer_id)"
                    style="
                      flex: 1;
                      min-width: 220px;
                      padding: 8px 10px;
                      border-radius: 10px;
                      border: 1px solid rgba(255, 255, 255, 0.16);
                      background: rgba(15, 23, 48, 0.65);
                      color: var(--text);
                      font-family: var(--mono);
                      font-size: 12px;
                    "
                  />
                  <input
                    id="newValue"
                    type="text"
                    placeholder="value (true/false, number, JSON, or text)"
                    style="
                      flex: 2;
                      min-width: 280px;
                      padding: 8px 10px;
                      border-radius: 10px;
                      border: 1px solid rgba(255, 255, 255, 0.16);
                      background: rgba(15, 23, 48, 0.65);
                      color: var(--text);
                      font-family: var(--mono);
                      font-size: 12px;
                    "
                  />
                  <button id="addInlineBtn" class="secondary">Add</button>
                </div>
                <div class="small" style="margin-top: 8px">Tip: Use <span class="pill">{{@state.foo}}</span> if you want to represent a token.</div>
              </div>

              <table class="kv" id="kvTable">
                <thead>
                  <tr>
                    <th style="width: 44px">sel</th>
                    <th>key</th>
                    <th>value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="3" style="color: rgba(255, 255, 255, 0.55)">(rendered table will appear here)</td>
                  </tr>
                </tbody>
              </table>

              <div id="nestedEditor" style="display: none; margin-top: 12px; padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(17, 26, 51, 0.55)">
                <div class="small" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px">
                  <div>
                    <div style="font-size: 12px; color: var(--text)">Nested editor</div>
                    <div id="nestedPath" class="small" style="margin-top: 4px">root</div>
                  </div>
                  <div class="row" style="margin: 0; gap: 8px">
                    <button id="nestedBackBtn" class="secondary">Back</button>
                    <button id="nestedCloseBtn" class="danger">Close</button>
                  </div>
                </div>
                <table class="kv" id="nestedKvTable">
                  <thead>
                    <tr>
                      <th style="width: 44px">sel</th>
                      <th>key</th>
                      <th>value</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
                <div class="row">
                  <button id="nestedAddBtn" class="secondary">Add field</button>
                  <button id="nestedDeleteBtn" class="danger">Delete selected</button>
                  <button id="nestedApplyBtn">Apply to parent</button>
                </div>
                <div class="small" style="margin-top: 8px">Tip: Objects/arrays in nested view can be opened too (drill down).</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <script>
      /**
       * Extract a JSON-like template from a ServiceNow CONCAT expression.
       * Supports:
       *  - CONCAT("{\"a\":\"", @state.a, "\",\"b\":\"", @state.b, "\"}")
       *  - Plain JSON already
       *
       * Returns a best-effort JSON template string where variables become tokens like:
       *  {{@state.a}}
       *
       * @param {string} input
       * @returns {{ template: string, notes: string[] }}
       */
      function extractJsonTemplate(input) {
        const notes = [];
        const trimmed = (input || "").trim();
        if (!trimmed) return { template: "", notes };

        // If it's already JSON (starts with { and ends with }) assume it's template JSON.
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
          notes.push("Detected plain JSON input (not CONCAT).");
          return { template: trimmed, notes };
        }

        // Try to isolate inside CONCAT(...)
        let inner = trimmed;
        const m = trimmed.match(/^CONCAT\((.*)\)\s*$/s);
        if (m && m[1]) {
          inner = m[1];
          notes.push("Detected CONCAT(...) wrapper.");
        } else {
          notes.push("No CONCAT(...) wrapper detected. Attempting best-effort parse.");
        }

        // Tokenize by commas at top-level (not inside quotes)
        const tokens = [];
        let cur = "";
        let inQuote = false;
        let esc = false;
        for (let i = 0; i < inner.length; i++) {
          const ch = inner[i];
          if (esc) {
            cur += ch;
            esc = false;
            continue;
          }
          if (ch === "\\") {
            cur += ch;
            esc = true;
            continue;
          }
          if (ch === '"') {
            inQuote = !inQuote;
            cur += ch;
            continue;
          }
          if (ch === "," && !inQuote) {
            tokens.push(cur.trim());
            cur = "";
            continue;
          }
          cur += ch;
        }
        if (cur.trim()) tokens.push(cur.trim());

        if (!tokens.length) {
          notes.push("Could not tokenize expression.");
          return { template: "", notes };
        }

        // Build template by concatenating string literals and inserting placeholders for non-literals
        let out = "";
        for (const t of tokens) {
          // String literal token like "{\"a\":\""
          const isString = t.startsWith('"') && t.endsWith('"');
          if (isString) {
            // Remove surrounding quotes
            let s = t.slice(1, -1);
            // Unescape typical sequences present in SN expressions
            // NOTE: This is best-effort and intentionally conservative
            s = s.replace(/\\"/g, '"');
            s = s.replace(/\\n/g, "\n");
            s = s.replace(/\\t/g, "\t");
            s = s.replace(/\\\\/g, "\\");
            out += s;
          } else if (t) {
            out += `{{${t}}}`;
          }
        }

        const final = out.trim();
        if (!(final.startsWith("{") && final.endsWith("}"))) {
          notes.push("Warning: Extracted template does not look like a full JSON object (missing { }?).");
        }
        return { template: final, notes };
      }

      /**
       * Build a key/value table from a parsed object.
       * @param {Record<string, any>} obj
       */
      function renderKvTable(obj) {
        const tbody = document.querySelector("#kvTable tbody");
        tbody.innerHTML = "";

        const keys = Object.keys(obj || {});
        if (!keys.length) {
          const tr = document.createElement("tr");
          const td = document.createElement("td");
          td.colSpan = 3;
          td.style.color = "rgba(255,255,255,0.55)";
          td.textContent = "(no keys found)";
          tr.appendChild(td);
          tbody.appendChild(tr);
          return;
        }

        keys.sort((a, b) => a.localeCompare(b));
        for (const k of keys) {
          const tr = document.createElement("tr");

          const tdSel = document.createElement("td");
          tdSel.style.width = "44px";
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.className = "rowSelect";
          cb.dataset.key = k;
          tdSel.appendChild(cb);

          const th = document.createElement("th");

          const td = document.createElement("td");
          const v = obj[k];

          const editEnabled = document.getElementById("editModeToggle")?.checked;
          if (editEnabled) {
            const keyInp = document.createElement("input");
            keyInp.type = "text";
            keyInp.value = k;
            keyInp.dataset.key = k;
            keyInp.style.width = "100%";
            keyInp.style.boxSizing = "border-box";
            keyInp.style.padding = "7px 8px";
            keyInp.style.borderRadius = "8px";
            keyInp.style.border = "1px solid rgba(255,255,255,0.16)";
            keyInp.style.background = "rgba(15, 23, 48, 0.65)";
            keyInp.style.color = "var(--text)";
            keyInp.style.fontFamily = "var(--mono)";
            keyInp.style.fontSize = "12px";
            keyInp.addEventListener("change", onKeyEdit);
            th.appendChild(keyInp);

            if (v && typeof v === "object") {
              // Nested object/array: show preview + Open button
              const wrap = document.createElement("div");
              wrap.style.display = "flex";
              wrap.style.gap = "8px";
              wrap.style.alignItems = "center";

              const preview = document.createElement("div");
              preview.className = "small";
              preview.style.flex = "1";
              preview.style.minWidth = "0";
              const isArr = Array.isArray(v);
              preview.textContent = isArr ? `Array(${v.length})` : "Object";

              const openBtn = document.createElement("button");
              openBtn.type = "button";
              openBtn.className = "secondary";
              openBtn.textContent = "Open";
              openBtn.dataset.key = k;
              openBtn.addEventListener("click", onOpenNested);

              wrap.appendChild(preview);
              wrap.appendChild(openBtn);
              td.appendChild(wrap);
            } else {
              const inp = document.createElement("input");
              inp.type = "text";
              inp.value = typeof v === "string" ? v : JSON.stringify(v);
              inp.dataset.key = k;
              inp.style.width = "100%";
              inp.style.boxSizing = "border-box";
              inp.style.padding = "7px 8px";
              inp.style.borderRadius = "8px";
              inp.style.border = "1px solid rgba(255,255,255,0.16)";
              inp.style.background = "rgba(15, 23, 48, 0.65)";
              inp.style.color = "var(--text)";
              inp.style.fontFamily = "var(--mono)";
              inp.style.fontSize = "12px";
              inp.addEventListener("input", onValueEdit);
              td.appendChild(inp);
            }
          } else {
            th.textContent = k;
            td.textContent = typeof v === "string" ? v : JSON.stringify(v, null, 2);
          }

          tr.appendChild(tdSel);
          tr.appendChild(th);
          tr.appendChild(td);
          tbody.appendChild(tr);
        }
      }

      /**
       * Try parsing JSON. If it fails due to {{tokens}}, replace them with safe strings and re-parse.
       * @param {string} jsonText
       * @returns {{ parsed: any, parseMode: string }}
       */
      function parseJsonTemplate(jsonText) {
        // First attempt: direct parse
        try {
          return { parsed: JSON.parse(jsonText), parseMode: "direct" };
        } catch (e1) {
          // Replace {{...}} tokens with placeholder strings
          const tokenReplaced = jsonText.replace(/\{\{[^}]+\}\}/g, '"__TEMPLATE_TOKEN__"');
          return { parsed: JSON.parse(tokenReplaced), parseMode: "token_replaced" };
        }
      }

      function setStatus(kind, msg) {
        const el = document.getElementById("status");
        el.classList.remove("ok", "bad");
        if (kind === "ok") el.classList.add("ok");
        if (kind === "bad") el.classList.add("bad");
        el.textContent = msg;
      }

      function saveHistory() {
        try {
          const h = window.__history || [];
          localStorage.setItem("concat_json_viewer_history_v1", JSON.stringify(h));
          localStorage.setItem("concat_json_viewer_history_limit_v1", String(window.__historyLimit ?? 10));
          localStorage.setItem("concat_json_viewer_history_page_size_v1", String(window.__historyPageSize ?? 6));
        } catch (e) {
          // ignore storage errors
        }
      }

      function loadHistory() {
        try {
          const raw = localStorage.getItem("concat_json_viewer_history_v1");
          if (!raw) return [];
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }

      function loadHistoryLimit() {
        try {
          const raw = localStorage.getItem("concat_json_viewer_history_limit_v1");
          const n = Number(raw);
          if (isNaN(n)) return 10;
          return Math.max(0, Math.min(200, n));
        } catch (e) {
          return 10;
        }
      }

      function loadHistoryPageSize() {
        try {
          const raw = localStorage.getItem("concat_json_viewer_history_page_size_v1");
          const n = Number(raw);
          if (isNaN(n)) return 6;
          return Math.max(1, Math.min(50, n));
        } catch (e) {
          return 6;
        }
      }

      function escapeHtml(str) {
        return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      }

      // History paging
      window.__historyPageSize = window.__historyPageSize || 6;
      window.__historyPageIndex = window.__historyPageIndex || 0;

      function renderHistory() {
        const el = document.getElementById("history");
        if (!el) return;

        const h = window.__history || [];
        if (!h.length) {
          el.textContent = "(no history yet)";
          const info = document.getElementById("historyPageInfo");
          if (info) info.textContent = "Page 0 of 0";
          return;
        }

        const pageSize = Math.max(1, Number(window.__historyPageSize || 6));
        const totalPages = Math.max(1, Math.ceil(h.length / pageSize));
        window.__historyPageIndex = Math.max(0, Math.min(totalPages - 1, Number(window.__historyPageIndex || 0)));

        const start = window.__historyPageIndex * pageSize;
        const end = Math.min(h.length, start + pageSize);
        const pageItems = h.slice(start, end);

        const info = document.getElementById("historyPageInfo");
        if (info) info.textContent = "Page " + (window.__historyPageIndex + 1) + " of " + totalPages;

        const prevBtn = document.getElementById("historyPrevBtn");
        const nextBtn = document.getElementById("historyNextBtn");
        if (prevBtn) prevBtn.disabled = window.__historyPageIndex <= 0;
        if (nextBtn) nextBtn.disabled = window.__historyPageIndex >= totalPages - 1;

        const rows = pageItems
          .map((it, localIdx) => {
            const idx = start + localIdx;
            const when = escapeHtml(it.at || "");
            const preview = escapeHtml((it.template || "").slice(0, 180));
            return `
          <div style="display:flex; gap:10px; align-items:flex-start; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.10);">
            <div style="flex: 0 0 auto; font-family: var(--mono); color: var(--muted);">${idx + 1}.</div>
            <div style="flex: 1 1 auto; min-width: 0;">
              <div class="small" style="margin-bottom: 6px;">${when}</div>
              <div style="font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,0.75); word-break: break-word;">${preview}${(it.template || "").length > 180 ? "…" : ""}</div>
              <div class="row" style="margin-top: 8px;">
                <button class="secondary" data-h-action="load" data-h-index="${idx}">Load</button>
                <button class="secondary" data-h-action="copy_template" data-h-index="${idx}">Copy template</button>
                <button class="secondary" data-h-action="copy_concat" data-h-index="${idx}">Copy CONCAT</button>
                <button class="secondary" data-h-action="copy_pretty" data-h-index="${idx}">Copy pretty</button>
                <button class="danger" data-h-action="delete" data-h-index="${idx}">Delete</button>
              </div>
            </div>
          </div>`;
          })
          .join("");

        el.innerHTML = rows;

        // Paging: no scrollbars needed
        el.style.height = "";
        el.style.maxHeight = "";
        el.style.overflowY = "visible";

        // Delegate clicks
        el.querySelectorAll("button[data-h-action]").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const action = e.target.getAttribute("data-h-action");
            const index = Number(e.target.getAttribute("data-h-index"));
            const item = (window.__history || [])[index];
            if (!item) return;

            if (action === "load") {
              document.getElementById("input").value = item.input || item.template || "";
              window.__lastTemplate = item.template || "";
              window.__generatedConcat = item.concat || "";
              render();
            } else if (action === "copy_template") {
              navigator.clipboard.writeText(item.template || "").then(
                () => setStatus("ok", "Copied template from history."),
                (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
              );
            } else if (action === "copy_concat") {
              navigator.clipboard.writeText(item.concat || "").then(
                () => setStatus("ok", "Copied CONCAT from history."),
                (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
              );
            } else if (action === "copy_pretty") {
              navigator.clipboard.writeText(item.pretty || "").then(
                () => setStatus("ok", "Copied pretty JSON from history."),
                (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
              );
            } else if (action === "delete") {
              const h = window.__history || [];
              h.splice(index, 1);
              window.__history = h;

              // If current page is now out of range, move back one
              const pageSize = Math.max(1, Number(window.__historyPageSize || 6));
              const totalPages = Math.max(1, Math.ceil(h.length / pageSize));
              window.__historyPageIndex = Math.max(0, Math.min(totalPages - 1, Number(window.__historyPageIndex || 0)));

              saveHistory();
              renderHistory();
              setStatus("ok", "Deleted history entry #" + (index + 1) + ".");
            }
          });
        });
      }

      function clearHistory() {
        window.__history = [];
        saveHistory();
        renderHistory();
        setStatus("ok", "Cleared history.");
      }

      function purgeHistory() {
        try {
          localStorage.removeItem("concat_json_viewer_history_v1");
          localStorage.removeItem("concat_json_viewer_history_limit_v1");
          localStorage.removeItem("concat_json_viewer_history_page_size_v1");
        } catch (e) {
          // ignore
        }
        window.__history = [];
        window.__historyLimit = 10;
        window.__historyPageSize = 6;
        window.__historyPageIndex = 0;

        const limitEl = document.getElementById("historyLimit");
        if (limitEl) limitEl.value = String(window.__historyLimit);
        const pageSizeEl = document.getElementById("historyPageSize");
        if (pageSizeEl) pageSizeEl.value = String(window.__historyPageSize);

        renderHistory();
        setStatus("ok", "Purged history storage.");
      }

      function onHistoryLimitChange() {
        const el = document.getElementById("historyLimit");
        const n = Number(el ? el.value : 10);
        const limit = isNaN(n) ? 10 : Math.max(0, Math.min(200, n));
        window.__historyLimit = limit;

        // Apply limit immediately
        window.__history = (window.__history || []).slice(0, limit);
        // Clamp page index after trimming
        const pageSize = Math.max(1, Number(window.__historyPageSize || 6));
        const totalPages = Math.max(1, Math.ceil((window.__history || []).length / pageSize));
        window.__historyPageIndex = Math.max(0, Math.min(totalPages - 1, Number(window.__historyPageIndex || 0)));

        saveHistory();
        renderHistory();
        setStatus("ok", "History max saved set to " + limit + ".");
      }

      function onHistoryPageSizeChange() {
        const el = document.getElementById("historyPageSize");
        const n = Number(el ? el.value : 6);
        const size = isNaN(n) ? 6 : Math.max(1, Math.min(50, n));
        window.__historyPageSize = size;
        window.__historyPageIndex = 0;
        saveHistory();
        renderHistory();
        setStatus("ok", "History page size set to " + size + ".");
      }

      function historyPrev() {
        window.__historyPageIndex = Math.max(0, Number(window.__historyPageIndex || 0) - 1);
        renderHistory();
      }

      function historyNext() {
        window.__historyPageIndex = Number(window.__historyPageIndex || 0) + 1;
        renderHistory();
      }

      function openSettings() {
        const p = document.getElementById("settingsPanel");
        if (p) p.style.display = "block";
      }

      function closeSettings() {
        const p = document.getElementById("settingsPanel");
        if (p) p.style.display = "none";
      }

      function generateConcatFromTemplate(template) {
        const t = (template || "").trim();
        if (!t) return "";

        // Split into parts:
        //  - literal text
        //  - string token placeholders: {{ token }}  -> inserted as raw expression BUT template should include quotes around it
        //  - raw token placeholders:    {{{ token }}} -> inserted raw and template should NOT include quotes
        const re = /\{\{\{([^}]+)\}\}\}|\{\{([^}]+)\}\}/g;
        let last = 0;
        let m;
        const parts = [];

        while ((m = re.exec(t)) !== null) {
          const literal = t.substring(last, m.index);
          if (literal) parts.push({ type: "lit", value: literal });

          // m[1] -> raw token inside {{{ }}} ; m[2] -> string token inside {{ }}
          const rawToken = (m[1] || "").trim();
          const strToken = (m[2] || "").trim();
          if (rawToken) parts.push({ type: "expr", value: rawToken });
          else if (strToken) parts.push({ type: "expr", value: strToken });

          last = re.lastIndex;
        }
        const tail = t.substring(last);
        if (tail) parts.push({ type: "lit", value: tail });

        // Build CONCAT("...") where literals are quoted strings with escapes and expr are raw
        const out = [];
        for (const p of parts) {
          if (p.type === "lit") {
            let s = p.value;
            // Escape for being inside a double-quoted ServiceNow string
            s = s.replace(/\\/g, "\\\\");
            s = s.replace(/"/g, '\\"');
            s = s.replace(/\n/g, "\\n");
            s = s.replace(/\r/g, "\\r");
            s = s.replace(/\t/g, "\\t");
            out.push('"' + s + '"');
          } else if (p.type === "expr") {
            out.push(p.value);
          }
        }

        return "CONCAT(" + out.join(", ") + ")";
      }

      function render() {
        const input = document.getElementById("input").value;
        const { template, notes } = extractJsonTemplate(input);

        if (!template) {
          document.getElementById("pretty").textContent = "(rendered JSON will appear here)";
          document.getElementById("concatOut").textContent = "(generated CONCAT will appear here)";
          window.__generatedConcat = "";
          window.__editableObject = {};
          renderKvTable(window.__editableObject);
          setStatus("bad", "No JSON template extracted.");
          return;
        }

        // Pretty print (even if parse fails, show template)
        let parsed;
        let parseMode = "";
        try {
          const r = parseJsonTemplate(template);
          parsed = r.parsed;
          parseMode = r.parseMode;
        } catch (e) {
          document.getElementById("pretty").textContent = template;
          document.getElementById("concatOut").textContent = "(generated CONCAT will appear here)";
          window.__generatedConcat = "";
          window.__editableObject = {};
          renderKvTable(window.__editableObject);
          setStatus("bad", `Extracted template but JSON parse failed: ${e.message}. Notes: ${notes.join(" | ")}`);
          return;
        }

        // Keep a working copy that you can edit/add/delete
        window.__editableObject = JSON.parse(JSON.stringify(parsed));

        document.getElementById("pretty").textContent = JSON.stringify(window.__editableObject, null, 2);
        renderKvTable(window.__editableObject);

        // Generate CONCAT from extracted template (preserves {{...}} tokens)
        window.__generatedConcat = generateConcatFromTemplate(template);
        document.getElementById("concatOut").textContent = window.__generatedConcat || "(could not generate CONCAT)";

        const noteText = notes.length ? ` Notes: ${notes.join(" | ")}` : "";
        const modeText = parseMode ? ` Parse mode: ${parseMode}.` : "";
        setStatus("ok", `Rendered successfully.${modeText}${noteText}`);

        // Store last extracted template for copy button
        window.__lastTemplate = template;

        // History (last 10 renders)
        window.__history = window.__history || [];
        const entry = {
          at: new Date().toISOString(),
          input: (input || "").trim(),
          template: template,
          pretty: JSON.stringify(window.__editableObject, null, 2),
          concat: window.__generatedConcat || "",
        };
        // De-dupe consecutive identical templates
        const last = window.__history.length ? window.__history[0] : null;
        if (!last || last.template !== entry.template) {
          window.__history.unshift(entry);
          const limit = Number(window.__historyLimit);
          if (!isNaN(limit) && limit >= 0) {
            window.__history = window.__history.slice(0, limit);
          } else {
            window.__history = window.__history.slice(0, 10);
          }
        }
        saveHistory();
        renderHistory();
      }

      function copyExtractedTemplate() {
        const t = window.__lastTemplate || "";
        if (!t) {
          setStatus("bad", "Nothing to copy yet — click Render first.");
          return;
        }
        navigator.clipboard.writeText(t).then(
          () => setStatus("ok", "Copied extracted JSON template to clipboard."),
          (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
        );
      }

      function copyEditedJson() {
        const obj = window.__editableObject || {};
        const text = JSON.stringify(obj, null, 2);
        navigator.clipboard.writeText(text).then(
          () => setStatus("ok", "Copied edited JSON to clipboard."),
          (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
        );
      }

      function copyPrettyJson() {
        const text = document.getElementById("pretty")?.textContent || "";
        if (!text || text.includes("(rendered JSON will appear here)")) {
          setStatus("bad", "Nothing to copy yet — click Render first.");
          return;
        }
        navigator.clipboard.writeText(text).then(
          () => setStatus("ok", "Copied pretty JSON to clipboard."),
          (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
        );
      }

      function copyGeneratedConcat() {
        const t = window.__generatedConcat || "";
        if (!t) {
          setStatus("bad", "No CONCAT to copy yet — click Render first.");
          return;
        }
        navigator.clipboard.writeText(t).then(
          () => setStatus("ok", "Copied generated CONCAT to clipboard."),
          (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
        );
      }

      function updateDerivedOutputs() {
        const obj = window.__editableObject || {};
        document.getElementById("pretty").textContent = JSON.stringify(obj, null, 2);

        // Generate CONCAT based on current edited object.
        // If a value is a token like {{@state.foo}}, it will be injected as a raw expression.
        const template = objectToTemplate(obj);
        window.__generatedConcat = generateConcatFromTemplate(template);
        document.getElementById("concatOut").textContent = window.__generatedConcat || "(could not generate CONCAT)";
      }

      function isObjectLike(v) {
        return v !== null && typeof v === "object";
      }

      function formatPath(path) {
        if (!path || !path.length) return "root";
        return "root" + path.map((p) => (typeof p === "number" ? `[${p}]` : `.${p}`)).join("");
      }

      function getAtPath(root, path) {
        let cur = root;
        for (const p of path) {
          if (cur == null) return undefined;
          cur = cur[p];
        }
        return cur;
      }

      function setAtPath(root, path, value) {
        if (!path.length) return value;
        let cur = root;
        for (let i = 0; i < path.length - 1; i++) {
          cur = cur[path[i]];
        }
        cur[path[path.length - 1]] = value;
        return root;
      }

      function deleteAtPath(root, path) {
        if (!path.length) return root;
        const parent = getAtPath(root, path.slice(0, -1));
        const last = path[path.length - 1];
        if (Array.isArray(parent) && typeof last === "number") {
          parent.splice(last, 1);
        } else if (parent && typeof parent === "object") {
          delete parent[last];
        }
        return root;
      }

      function renameKeyAtPath(root, path, oldKey, newKey) {
        const obj = getAtPath(root, path);
        if (!obj || typeof obj !== "object" || Array.isArray(obj)) return root;
        if (!Object.prototype.hasOwnProperty.call(obj, oldKey)) return root;
        if (oldKey !== newKey && Object.prototype.hasOwnProperty.call(obj, newKey)) return root;
        const val = obj[oldKey];
        delete obj[oldKey];
        obj[newKey] = val;
        return root;
      }

      function showNestedEditor(path) {
        window.__nestedPath = path || [];
        const panel = document.getElementById("nestedEditor");
        panel.style.display = "block";
        document.getElementById("nestedPath").textContent = formatPath(window.__nestedPath);
        renderNestedTable();
      }

      function hideNestedEditor() {
        const panel = document.getElementById("nestedEditor");
        panel.style.display = "none";
        window.__nestedPath = [];
      }

      function onOpenNested(e) {
        const k = e?.target?.dataset?.key;
        if (!k) return;
        const obj = window.__editableObject || {};
        const v = obj[k];
        if (!isObjectLike(v)) return;
        showNestedEditor([k]);
      }

      function renderNestedTable() {
        const tbody = document.querySelector("#nestedKvTable tbody");
        tbody.innerHTML = "";

        const root = window.__editableObject || {};
        const node = getAtPath(root, window.__nestedPath || []);

        if (!isObjectLike(node)) {
          const tr = document.createElement("tr");
          const td = document.createElement("td");
          td.colSpan = 3;
          td.style.color = "rgba(255,255,255,0.55)";
          td.textContent = "(not an object/array)";
          tr.appendChild(td);
          tbody.appendChild(tr);
          return;
        }

        const editEnabled = document.getElementById("editModeToggle")?.checked;

        // Build rows for object keys or array indices
        const entries = [];
        if (Array.isArray(node)) {
          for (let i = 0; i < node.length; i++) entries.push([i, node[i]]);
        } else {
          const ks = Object.keys(node);
          ks.sort((a, b) => a.localeCompare(b));
          for (const k of ks) entries.push([k, node[k]]);
        }

        if (!entries.length) {
          const tr = document.createElement("tr");
          const td = document.createElement("td");
          td.colSpan = 3;
          td.style.color = "rgba(255,255,255,0.55)";
          td.textContent = "(empty)";
          tr.appendChild(td);
          tbody.appendChild(tr);
          return;
        }

        for (const [k, v] of entries) {
          const tr = document.createElement("tr");

          const tdSel = document.createElement("td");
          tdSel.style.width = "44px";
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.className = "nestedRowSelect";
          cb.dataset.key = String(k);
          cb.dataset.keyType = typeof k === "number" ? "number" : "string";
          tdSel.appendChild(cb);

          const th = document.createElement("th");
          const td = document.createElement("td");

          // Key cell
          if (editEnabled && !Array.isArray(node)) {
            const keyInp = document.createElement("input");
            keyInp.type = "text";
            keyInp.value = String(k);
            keyInp.dataset.key = String(k);
            keyInp.style.width = "100%";
            keyInp.style.boxSizing = "border-box";
            keyInp.style.padding = "7px 8px";
            keyInp.style.borderRadius = "8px";
            keyInp.style.border = "1px solid rgba(255,255,255,0.16)";
            keyInp.style.background = "rgba(15, 23, 48, 0.65)";
            keyInp.style.color = "var(--text)";
            keyInp.style.fontFamily = "var(--mono)";
            keyInp.style.fontSize = "12px";
            keyInp.addEventListener("change", (ev) => {
              const oldKey = ev?.target?.dataset?.key;
              const newKey = String(ev?.target?.value || "").trim();
              if (!newKey) {
                setStatus("bad", "Key cannot be blank.");
                renderNestedTable();
                return;
              }
              renameKeyAtPath(window.__editableObject, window.__nestedPath, oldKey, newKey);
              updateDerivedOutputs();
              renderNestedTable();
            });
            th.appendChild(keyInp);
          } else {
            th.textContent = String(k);
          }

          // Value cell
          if (editEnabled) {
            if (isObjectLike(v)) {
              const wrap = document.createElement("div");
              wrap.style.display = "flex";
              wrap.style.gap = "8px";
              wrap.style.alignItems = "center";

              const preview = document.createElement("div");
              preview.className = "small";
              preview.style.flex = "1";
              preview.style.minWidth = "0";
              preview.textContent = Array.isArray(v) ? `Array(${v.length})` : "Object";

              const openBtn = document.createElement("button");
              openBtn.type = "button";
              openBtn.className = "secondary";
              openBtn.textContent = "Open";
              openBtn.addEventListener("click", () => {
                const nextPath = (window.__nestedPath || []).slice();
                nextPath.push(k);
                showNestedEditor(nextPath);
              });

              wrap.appendChild(preview);
              wrap.appendChild(openBtn);
              td.appendChild(wrap);
            } else {
              const inp = document.createElement("input");
              inp.type = "text";
              inp.value = typeof v === "string" ? v : JSON.stringify(v);
              inp.style.width = "100%";
              inp.style.boxSizing = "border-box";
              inp.style.padding = "7px 8px";
              inp.style.borderRadius = "8px";
              inp.style.border = "1px solid rgba(255,255,255,0.16)";
              inp.style.background = "rgba(15, 23, 48, 0.65)";
              inp.style.color = "var(--text)";
              inp.style.fontFamily = "var(--mono)";
              inp.style.fontSize = "12px";
              inp.addEventListener("input", (ev) => {
                const raw = ev.target.value;
                const coerced = coerceValue(raw);
                const node2 = getAtPath(window.__editableObject, window.__nestedPath);
                if (Array.isArray(node2) && typeof k === "number") node2[k] = coerced;
                else if (node2 && typeof node2 === "object") node2[k] = coerced;
                updateDerivedOutputs();
              });
              td.appendChild(inp);
            }
          } else {
            td.textContent = typeof v === "string" ? v : JSON.stringify(v, null, 2);
          }

          tr.appendChild(tdSel);
          tr.appendChild(th);
          tr.appendChild(td);
          tbody.appendChild(tr);
        }
      }

      function nestedBack() {
        const p = window.__nestedPath || [];
        if (p.length <= 1) {
          hideNestedEditor();
          return;
        }
        showNestedEditor(p.slice(0, -1));
      }

      function nestedClose() {
        hideNestedEditor();
      }

      function nestedApply() {
        // No-op: edits are live on window.__editableObject; just refresh main table.
        updateDerivedOutputs();
        renderKvTable(window.__editableObject || {});
        setStatus("ok", "Applied nested changes.");
      }

      function nestedAdd() {
        const root = window.__editableObject || {};
        const node = getAtPath(root, window.__nestedPath || []);
        if (!isObjectLike(node)) return;

        if (Array.isArray(node)) {
          node.push("");
        } else {
          const key = prompt("New field key (for this nested object):");
          if (!key) return;
          const k = key.trim();
          if (!k) return;
          if (Object.prototype.hasOwnProperty.call(node, k)) {
            setStatus("bad", "Key already exists: " + k);
            return;
          }
          const value = prompt("Value (true/false, number, JSON, token, or text):", "");
          node[k] = coerceValue(value);
        }

        updateDerivedOutputs();
        renderNestedTable();
      }

      function nestedDeleteSelected() {
        const root = window.__editableObject || {};
        const node = getAtPath(root, window.__nestedPath || []);
        if (!isObjectLike(node)) return;

        const checks = Array.from(document.querySelectorAll("input.nestedRowSelect:checked"));
        if (!checks.length) {
          setStatus("bad", "No nested rows selected.");
          return;
        }

        // Delete from end to start for arrays
        const keys = checks.map((cb) => (cb.dataset.keyType === "number" ? Number(cb.dataset.key) : cb.dataset.key));
        if (Array.isArray(node)) {
          keys.sort((a, b) => b - a);
          for (const idx of keys) node.splice(idx, 1);
        } else {
          for (const k of keys) delete node[k];
        }

        updateDerivedOutputs();
        renderNestedTable();
      }

      function onKeyEdit(e) {
        const oldKey = e?.target?.dataset?.key;
        if (!oldKey) return;

        const newKeyRaw = e?.target?.value;
        const newKey = String(newKeyRaw || "").trim();
        if (!newKey) {
          setStatus("bad", "Key cannot be blank.");
          // Re-render to restore old value
          renderKvTable(window.__editableObject || {});
          return;
        }

        const obj = window.__editableObject || {};
        if (!Object.prototype.hasOwnProperty.call(obj, oldKey)) {
          setStatus("bad", `Original key not found: ${oldKey}`);
          renderKvTable(obj);
          return;
        }

        if (newKey !== oldKey && Object.prototype.hasOwnProperty.call(obj, newKey)) {
          setStatus("bad", `Key already exists: ${newKey}`);
          renderKvTable(obj);
          return;
        }

        // Rename key
        const val = obj[oldKey];
        delete obj[oldKey];
        obj[newKey] = val;
        window.__editableObject = obj;

        updateDerivedOutputs();
        renderKvTable(obj);
        setStatus("ok", `Renamed key: ${oldKey} → ${newKey}`);
      }

      function onValueEdit(e) {
        const key = e?.target?.dataset?.key;
        if (!key) return;

        const obj = window.__editableObject || {};
        const raw = e.target.value;
        obj[key] = coerceValue(raw);
        window.__editableObject = obj;

        updateDerivedOutputs();
      }

      function coerceValue(raw) {
        const s = raw == null ? "" : String(raw);
        const t = s.trim();
        if (t === "") return "";
        if (t === "true") return true;
        if (t === "false") return false;
        if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);

        // Preserve tokens the user types as literal strings (template tokens)
        //  - {{...}}   = string token
        //  - {{{...}}} = raw token
        if (/^\{\{[^}]+\}\}$/.test(t)) return t;
        if (/^\{\{\{[^}]+\}\}\}$/.test(t)) return t;

        // If user typed valid JSON (object/array/null/string/number), accept it.
        // Example: {"a":1} or [1,2] or null or "text"
        try {
          return JSON.parse(t);
        } catch (e) {
          // Not valid JSON, treat as string
          return s;
        }
      }

      function objectToTemplate(obj) {
        const o = obj || {};
        const keys = Object.keys(o);
        keys.sort((a, b) => a.localeCompare(b));

        const out = {};
        for (const k of keys) {
          const v = o[k];
          if (typeof v === "string" && /^\{\{[^}]+\}\}$/.test(v.trim())) {
            // Mark as token placeholder (no quotes in CONCAT output)
            out[k] = v.trim();
          } else {
            // For everything else, represent as a JSON value, but stringify as text for template.
            // We keep it as real JSON value in edited JSON; template needs strings for non-token values.
            if (typeof v === "string") out[k] = v;
            else out[k] = v;
          }
        }

        // Build template JSON text.
        // Rule:
        //  - {{...}} tokens are STRING tokens and must remain QUOTED in JSON ("{{...}}")
        //  - {{{...}}} tokens are RAW tokens and must be UNQUOTED in JSON ({{{...}}})
        //
        // We do this safely by temporarily replacing RAW tokens with markers, JSON.stringify,
        // then replacing the quoted markers with the raw token text.

        const marker = "__RAW_TOKEN_MARKER__";
        const rawTokenMap = {};

        for (const k of Object.keys(out)) {
          const v = out[k];
          if (typeof v === "string" && /^\{\{\{[^}]+\}\}\}$/.test(v)) {
            rawTokenMap[k] = v;
            out[k] = marker + k + marker;
          }
        }

        let json = JSON.stringify(out, null, 0);

        // Replace "__RAW_TOKEN_MARKER__key__RAW_TOKEN_MARKER__" with {{{token}}}
        for (const k of Object.keys(rawTokenMap)) {
          const needle = '"' + marker + k + marker + '"';
          json = json.replaceAll(needle, rawTokenMap[k]);
        }

        return json;
      }

      function addField() {
        // Backwards compatible (button still exists): route to inline add
        addFieldInline();
      }

      function addFieldInline() {
        const keyEl = document.getElementById("newKey");
        const valEl = document.getElementById("newValue");
        const key = keyEl && keyEl.value ? keyEl.value : "";
        const k = String(key).trim();
        if (!k) {
          setStatus("bad", "Enter a key to add.");
          return;
        }

        const obj = window.__editableObject || {};
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          setStatus("bad", `Key already exists: ${k}`);
          return;
        }

        const value = valEl ? valEl.value : "";
        obj[k] = coerceValue(value);
        window.__editableObject = obj;

        if (keyEl) keyEl.value = "";
        if (valEl) valEl.value = "";

        // If user typed an expression (like @state.foo) without token braces, normalize it to a STRING token by default.
        // Use {{{...}}} when you need RAW output (booleans/numbers).
        if (typeof obj[k] === "string") {
          const s = obj[k].trim();
          const isStrToken = /^\{\{[^}]+\}\}$/.test(s);
          const isRawToken = /^\{\{\{[^}]+\}\}\}$/.test(s);
          if (s.startsWith("@") && !isStrToken && !isRawToken) obj[k] = "{{" + s + "}}";
        }

        updateDerivedOutputs();
        renderKvTable(window.__editableObject);
        setStatus("ok", `Added field: ${k}`);
      }

      function deleteSelected() {
        const obj = window.__editableObject || {};
        const checks = Array.from(document.querySelectorAll("input.rowSelect:checked"));
        if (!checks.length) {
          setStatus("bad", "No rows selected.");
          return;
        }
        for (const cb of checks) {
          const k = cb.dataset.key;
          if (k && Object.prototype.hasOwnProperty.call(obj, k)) delete obj[k];
        }
        window.__editableObject = obj;
        updateDerivedOutputs();
        renderKvTable(window.__editableObject);
        setStatus("ok", `Deleted ${checks.length} field(s).`);
      }

      function rerenderTableOnly() {
        renderKvTable(window.__editableObject || {});
      }

      function clearAll() {
        document.getElementById("input").value = "";
        document.getElementById("pretty").textContent = "(rendered JSON will appear here)";
        document.getElementById("concatOut").textContent = "(generated CONCAT will appear here)";
        renderKvTable({});
        window.__lastTemplate = "";
        window.__generatedConcat = "";
        window.__editableObject = {};
        setStatus("ok", "Cleared.");
      }

      // Wire up
      document.getElementById("renderBtn").addEventListener("click", render);
      document.getElementById("copyTemplateBtn").addEventListener("click", copyExtractedTemplate);
      document.getElementById("settingsBtn").addEventListener("click", openSettings);
      document.getElementById("settingsCloseBtn").addEventListener("click", closeSettings);

      document.getElementById("copyPrettyBtn").addEventListener("click", copyPrettyJson);
      document.getElementById("copyEditedJsonBtn").addEventListener("click", copyEditedJson);
      document.getElementById("copyConcatBtn").addEventListener("click", copyGeneratedConcat);
      document.getElementById("addFieldBtn").addEventListener("click", addField);
      document.getElementById("addInlineBtn").addEventListener("click", addFieldInline);
      document.getElementById("newKey").addEventListener("keydown", (e) => {
        if (e.key === "Enter") addFieldInline();
      });
      document.getElementById("newValue").addEventListener("keydown", (e) => {
        if (e.key === "Enter") addFieldInline();
      });
      document.getElementById("deleteSelectedBtn").addEventListener("click", deleteSelected);
      document.getElementById("editModeToggle").addEventListener("change", rerenderTableOnly);
      document.getElementById("clearBtn").addEventListener("click", clearAll);
      document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);

      // Nested editor wire-up
      document.getElementById("nestedBackBtn").addEventListener("click", nestedBack);
      document.getElementById("nestedCloseBtn").addEventListener("click", nestedClose);
      document.getElementById("nestedApplyBtn").addEventListener("click", nestedApply);
      document.getElementById("nestedAddBtn").addEventListener("click", nestedAdd);
      document.getElementById("nestedDeleteBtn").addEventListener("click", nestedDeleteSelected);
      document.getElementById("purgeHistoryBtn").addEventListener("click", purgeHistory);
      document.getElementById("historyLimit").addEventListener("change", onHistoryLimitChange);
      document.getElementById("historyPageSize").addEventListener("change", onHistoryPageSizeChange);
      document.getElementById("historyPrevBtn").addEventListener("click", historyPrev);
      document.getElementById("historyNextBtn").addEventListener("click", historyNext);

      // Load history on startup
      window.__historyLimit = loadHistoryLimit();
      document.getElementById("historyLimit").value = String(window.__historyLimit);

      window.__historyPageSize = loadHistoryPageSize();
      document.getElementById("historyPageSize").value = String(window.__historyPageSize);
      window.__historyPageIndex = 0;

      window.__history = loadHistory();
      // Enforce limit in case stored history is bigger
      window.__history = window.__history.slice(0, window.__historyLimit);
      saveHistory();
      renderHistory();

      // Seed with your example for convenience
      document.getElementById("input").value =
        'CONCAT("{\\"searchType\\":\\"", @state.searchType, "\\",\\"client_id\\":\\"", @state.clientIdTemp, "\\",\\"client_name\\":\\"", @state.clientNameTemp, "\\",\\"customer_search_value\\":\\"", @state.cust_pln_value_temp, "\\",\\"by_customer_payer_id\\":\\"", @state.checkbox_customer_health_plan_id_state, "\\",\\"by_customer_payer_name\\":\\"", @state.checkbox_customer_health_plan_name_state, "\\",\\"allow_partial_search\\":\\"", @state.allow_partial_search, "\\"}")';

      // Init state
      window.__editableObject = {};
      window.__lastTemplate = "";
      window.__lastRenderedInput = "";
    </script>
  </body>
</html>
