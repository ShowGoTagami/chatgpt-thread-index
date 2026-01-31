# ChatGPT Question Navigator

Chrome extension to improve ChatGPT chat searchability and visibility.

## Active Specifications

| Feature | Phase | Status |
|---------|-------|--------|
| [chatgpt-question-navigator](.kiro/specs/chatgpt-question-navigator/) | initialized | Awaiting requirements generation |

## Development Workflow

Follow the spec-driven development process:
1. `/kiro:spec-requirements chatgpt-question-navigator` - Generate requirements
2. `/kiro:spec-design chatgpt-question-navigator` - Create technical design
3. `/kiro:spec-tasks chatgpt-question-navigator` - Generate implementation tasks
4. `/kiro:spec-impl chatgpt-question-navigator` - Execute implementation

## Project Structure

```
/src
 ├─ content_script.ts
 ├─ sidebar.ts
 ├─ styles.css
 └─ utils/
/manifest.json
/.kiro/specs/
```
