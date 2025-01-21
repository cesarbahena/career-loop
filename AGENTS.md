# Project Plan: career-loop

This document outlines the plan and rules for building the "career-loop" application.

## 1. Core Goal

The primary goal is to create a multi-part application for job hunting. It will feature a web-based dashboard for managing job applications and automated services for interacting with job boards.

## 2. Technology Stack

-   **Frontend & API:** A full-stack web application built with **TanStack Start**, which includes both the frontend UI and server functions for API logic.
-   **Database:** A **PostgreSQL** database will store all application data, accessed via **Drizzle ORM**.
-   **Microservices:** Independent services written in **Python** for web scraping and job board automation tasks.

## 3. Project and Repository Structure

This project uses a multi-repository structure. The main folder contains project-wide configuration.

-   **Main Repository:** The top-level folder is a Git repository containing project-wide configuration, Kubernetes files (`k8s/`) and this `AGENTS.md` file.
-   **Sub-Repositories:** Each major component lives in its own folder as a separate Git repository:
    -   `frontend/` - TanStack Start full-stack application (frontend + server functions)
    -   `services/scraper/` - Python microservices for job board automation
-   **Isolation (`.gitignore`):** The main repository `.gitignore` file ignores component folders and this `AGENTS.md` file, keeping repositories independent.

## 4. Git and Commit Process

A strict process must be followed for all commits.

-   **Directory Navigation:** ALWAYS use `pwd` before any git command to verify the correct directory. Never assume the current working directory.
-   **Targeted Commits:** All git commands will be directed to the correct repository. Navigate to the specific repository folder before committing (e.g., `cd frontend && pwd && git commit ...`).
-   **Backdated Commits:** All commits will be backdated to simulate a development timeline starting on **January 2nd, 2025**. Use the correct format: `GIT_COMMITTER_DATE="2025-01-20 10:15:33 -0500" git commit --date="2025-01-20 10:15:33 -0500" -m "message"`
-   **Realistic Commit Gaps:** Skip some days between commits to make the history more realistic. Not every day should have commits.
-   **Commit Timing:** Commits occur only on weekdays (Monday-Friday) during standard work hours (9 AM to 7 PM). Generate realistic times with non-zero seconds.
-   **Commit Messages:** Use Conventional Commits format with scope (e.g., `feat(frontend): add job applications CRUD`, `refactor(k8s): improve security`).

## 5. Deployment

-   **Containerization:** Every part of the application will be built to run inside its own container using idiomatic Docker practices.
-   **Kubernetes Manifests:** All manifests must follow Kubernetes best practices:
    -   Use Secrets for sensitive data (never plain text passwords)
    -   Include proper resource requests and limits
    -   Add readiness and liveness probes
    -   Run containers as non-root users with security contexts
    -   Use proper labels for observability
    -   Use semantic versioning for image tags (not `latest`)
-   **Target Environment:** The entire application will be deployed and managed within a **k3s Kubernetes cluster**.

## 6. Operating Rules

-   **No Sudo:** I will not run any commands that require `sudo`. If a command needs elevated permissions, I will provide you with the exact command to run.
-   **Mark Unfinished Work:** Any code or features that are planned but not yet complete will be clearly marked (e.g., with `// TODO:` comment or by raising a `NotImplementedError`).
-   **Testing:** Automated tests will be written alongside new features and bug fixes to ensure the code is working correctly.
-   **TanStack Start Patterns:** Use idiomatic TanStack Start patterns:
    -   Server functions for API logic instead of external API calls
    -   Route loaders for data fetching
    -   Proper TypeScript types across client and server
    -   Environment variables for configuration

## 7. Architecture Notes

-   **Removed FastAPI Backend:** The FastAPI backend has been replaced with TanStack Start server functions for a more modern, type-safe full-stack approach.
-   **Database Access:** TanStack Start server functions connect directly to PostgreSQL using Drizzle ORM.
-   **Microservices Communication:** Python scraper services will communicate with the main application through the TanStack Start server functions when needed.
