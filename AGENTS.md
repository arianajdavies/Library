# Library Instructions

This repository is the user's personal webapp library. Every webapp created in this workspace must be reachable from the library homepage without the user needing to ask.

## Required Workflow For New Webapps

1. Put standalone webapps in `apps/`.
2. Use a clear, URL-safe filename such as `apps/my-tool-name.html`.
3. Update `index.html` in the `<!-- APP_LIST_START -->` section with a new app card.
4. Update the homepage app count in every visible count location.
5. Keep cards ordered newest last unless the user asks for a different order.
6. Each card must include:
   - A two-digit app number.
   - The app name.
   - A short plain-language description.
   - A working link to the app file.

## Homepage Card Template

```html
<article class="app-card">
  <div class="app-icon" aria-hidden="true">02</div>
  <div>
    <h3>App Name</h3>
    <p>Short description of what the app helps the user do.</p>
  </div>
  <a class="button" href="apps/app-file-name.html">Open app</a>
</article>
```

## Quality Bar

- The homepage must not contain broken app links.
- A new app is not complete until it is linked from `index.html`.
- Prefer static, portable HTML/CSS/JavaScript unless a project genuinely needs a framework or build step.
- Do not remove or rewrite existing app entries unless the user asks.
