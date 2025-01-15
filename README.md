# Career-Loop: Job Hunting Automation Platform

## Project Overview

Career-Loop is an advanced job hunting automation platform designed to streamline the job application process. It features a modern frontend dashboard for configuration and tracking, a robust FastAPI backend for API services, and specialized microservices for web scraping and automated applications. The entire application is built for deployment on Kubernetes.

## Architecture

The project follows a modular, multi-repository architecture, promoting separation of concerns and independent development cycles for each core component.

*   **Main Repository (`career-loop/`):** Contains project-wide configuration, Kubernetes deployment manifests (`k8s/`), database schema (`database/`), and documentation like this `README.md`.
*   **Frontend (`frontend/`):** A single-page application (SPA) built with **TanStack Start** (using React, Vite, and TanStack Router). It provides a dashboard for users to manage job applications, configure settings, and monitor automated processes.
*   **Backend (`backend/`):** A high-performance API service built with **Python FastAPI**. It handles business logic, data persistence, and serves as the central hub for frontend and microservice communication.
*   **Scraper Microservice (`services/scraper/`):** A specialized **Python** microservice designed for web scraping job boards and potentially automating application submissions.

### Technologies Used

*   **Frontend:** React, TanStack Start, TanStack Router, TanStack Query, Shadcn UI
*   **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL
*   **Database:** PostgreSQL
*   **Containerization:** Docker
*   **Orchestration:** Kubernetes (specifically `k3s` for self-hosted deployments)

## Getting Started (Local Development)

To run the application locally, you will need Docker, Docker Compose (for the database), and Node.js/npm for the frontend, and Python/pip for the backend/scraper.

### 1. Database Setup (with Docker Compose)

(Future work: Add a `docker-compose.yaml` to easily spin up a local PostgreSQL instance.)

### 2. Backend Service

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Run migrations/create tables:** (This will be implicitly handled by `main.py` for now, but a dedicated migration tool like Alembic will be integrated in the future.)
4.  **Start the backend:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The backend will be available at `http://localhost:8000`.

### 3. Frontend Service

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend:**
    ```bash
    npm run dev
    ```
    The frontend will typically be available at `http://localhost:3000`.

### 4. Scraper Microservice

1.  **Navigate to the scraper directory:**
    ```bash
    cd services/scraper
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Run a scraper task:**
    ```bash
    # This will typically be run as a Docker container or a scheduled task
    # For now, this is a placeholder.
    python app/main.py
    ```

## Deployment (Kubernetes)

The entire application is designed to be deployed to a Kubernetes cluster. For self-hosted scenarios, `k3s` is recommended.

1.  **Build Docker Images:**
    Build and tag Docker images for the frontend, backend, and scraper services.
    ```bash
    # Example for backend (from project root)
    docker build -t career-loop-backend:latest -f backend/Dockerfile .
    # ... similarly for frontend and scraper
    ```
2.  **Load Images into k3s:**
    If using k3s locally, load the images into its registry.
    ```bash
    # Example
    k3s ctr images import career-loop-backend:latest
    ```
3.  **Apply Kubernetes Manifests:**
    Apply the Kubernetes YAML files located in the `k8s/` directory.
    ```bash
    kubectl apply -f k8s/
    ```
    Ensure your `kubeconfig` is set up to point to your k3s cluster.

## Future Work / TODOs

*   **User Authentication & Authorization:** Implement robust user login, registration, and session management.
*   **Database Migrations:** Integrate Alembic for managing database schema changes for PostgreSQL.
*   **Scraper Logic:** Develop concrete scraping implementations for various job boards.
*   **Automated Applying:** Implement logic for automating job applications.
*   **Notifications:** Add features for email or in-app notifications.
*   **Advanced Configuration:** Expand dashboard controls for detailed job search customization.
*   **CI/CD Pipeline:** Set up automated building, testing, and deployment workflows.
*   **Secret Management:** Replace hardcoded database credentials with Kubernetes Secrets.
*   **Observability:** Integrate logging, monitoring, and tracing.

