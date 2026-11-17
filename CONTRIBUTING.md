# Contributing

## Before opening a pull request

1. Keep each change focused on one user-visible behavior or maintenance task.
2. Add or update a regression test when behavior changes.
3. Run the full local gate:

   ```bash
   npm run check:config
   npm run type-check
   npm run lint:eslint
   npm run lint:style
   npm run format:check
   npm test
   npm run build
   ```

4. Use Conventional Commit messages such as `feat: add role filter` or `fix: handle request timeout`.

## Design boundaries

- Keep API calls in `src/api/`; views should not embed endpoint URLs.
- Treat frontend permissions as presentation controls. The backend owns authorization.
- Reuse existing components and tokens before adding dependencies or configuration.
- Update both `README.md` and `README.en.md` when public usage changes.
