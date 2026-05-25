# mini-claw

## 练习两年半，学习openclaw原理
# mini-claw

A lightweight AI coding agent inspired by Claude Code and OpenClaw.

mini-claw is a local-first experimental AI runtime built with Node.js.  
It supports:

- Multi-turn conversations
- Tool calling
- File system operations
- Shell execution
- Runtime logging
- Context/message management

The project is designed for learning how modern AI agents work internally.

---

# Features

- OpenAI-compatible API support
- Tool calling loop
- File system tools
- Shell execution
- Runtime logging
- Context trimming
- Modular runtime architecture
- Local workspace support

---

# Architecture

```text
User
  ↓
Loop Runtime
  ↓
LLM Request
  ↓
Tool Calls
  ↓
Tool Execution
  ↓
Messages Updated
  ↓
LLM Continues Reasoning

```
# Usage
1. Install dependencies:

```bash
npm install
```
2. Run the agent:

```bash
npm run start
```
3. Interact with the agent in the terminal.
4. Type `exit` to quit the agent.
5. Check the `workspace` directory for any files created by the agent.
6. Review the `logs` directory for runtime logs.
7. Customize tools and prompts in the `src/tools` and `src/prompts` directories.
8. Experiment with different models by changing the `MODEL` variable in `src/core/loop.js`.
9. Feel free to modify the code and explore how the agent works internally!
10. Happy coding! 🚀