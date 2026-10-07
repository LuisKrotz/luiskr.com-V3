# Package Manager Rule

This project uses Yarn as the default package manager. All package management commands must use Yarn.

- Use `yarn` instead of `npm` for all package management operations
- Use `yarn install` instead of `npm install`
- Use `yarn add <package>` instead of `npm install <package>`
- Use `yarn remove <package>` instead of `npm uninstall <package>`
- Use `yarn run <script>` instead of `npm run <script>`

Remember to always use Yarn commands and never use npm commands.

Replace any npm commands with their Yarn equivalents in all documentation, scripts, and examples.

Lock the package manager to Yarn in all CI/CD configurations and build scripts.

Look for any references to npm in package.json scripts and update them to use yarn instead.

CI/CD configurations should use yarn commands instead of npm commands.

GitHub Actions workflows should use yarn commands instead of npm commands.

Git hooks should use yarn commands instead of npm commands.

Use yarn commands in all documentation, scripts, and examples.
