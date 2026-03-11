# S1S2 Development

## Repository Setup

This repository contains the S1S2 app — a heart health app disguised as a space exploration game.

### Initial Setup Checklist

- [x] Initialize git repository
- [x] Create README.md
- [x] Create .gitignore
- [ ] Create GitHub repository (taom/s1s2)
- [ ] Push initial commit
- [ ] Set up branch protection rules
- [ ] Configure GitHub Actions (optional)

### Branch Strategy

```
main           - Production releases
├── develop    - Integration branch
│   ├── feature/*   - Feature branches
│   ├── bugfix/*    - Bug fixes
│   └── release/*   - Release preparation
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

### Development Workflow

1. Create feature branch from `develop`
2. Make changes with conventional commits
3. Open pull request to `develop`
4. After review, merge to `develop`
5. When ready for release, merge `develop` to `main`

### Phase Tracking

Development phases are tracked in:
- [S1S2-Phased-Rollout-Business-Development-Plan.md](../S1S2-Phased-Rollout-Business-Development-Plan.md)
- [planning/S1S2-Phase-Kanban-Board.md](../planning/S1S2-Phase-Kanban-Board.md)

### Quick Links

- [Product Bible](../S1S2-Final-Product-Bible.md)
- [Rollout Plan](../S1S2-Phased-Rollout-Business-Development-Plan.md)
- [Planning Documents](../planning/README.md)
