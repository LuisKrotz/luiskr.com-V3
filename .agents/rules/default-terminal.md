# Terminal Rule

This project uses POSIX-portable bash as the shell for all scripts and git hooks. Everything must run identically on Windows (Git Bash), macOS, and Linux.

- Use bash (`#!/usr/bin/env bash`) for all shell scripts and git hooks
- Never use zsh-only syntax (`print -r`, `${(s: :)…}`, zsh glob qualifiers) — POSIX word-splitting is the portable equivalent
- Never use GNU-only flags without a portable fallback
- WSL must never be used on Windows — commands run in Git Bash natively
- Use bash for all terminal commands
- Use bash for all package management operations
- Use bash for all build operations
- Use bash for all test operations
- Use bash for all deployment operations
- Use bash for all documentation operations
- Use bash for all script operations
- Use bash for all example operations

Shell configurations should use POSIX-compatible bash syntax.

Keep shell configurations organized and documented.
