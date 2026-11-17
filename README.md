# Business Trips – Frontend

React + Vite frontend for the RefCard05 business-trips application. The app
loads trips from the Spring Boot API and stores the wishlist in the browser.

## Local development

```bash
npm ci
npm run dev
```

By default, the frontend calls `http://localhost:8080/v1/trips`. To use another
backend, create `.env.local` in the repository root:

```dotenv
VITE_API_BASE_URL=http://localhost:8080/
VITE_IMGS=items
```

`VITE_API_BASE_URL` is the backend base URL, not a secret. Vite compiles it into
the frontend at build time, so changing it for ECS requires a new image.

Run checks and create a production build with:

```bash
npm test
npm run lint
npm run build
```

## GitHub Actions and AWS

Pull requests run tests, lint, and the production build. A push to `main`
additionally publishes a commit-SHA image and `latest` to ECR, then deploys it
to ECS. Pushing a version tag such as `v1.2.0` publishes that exact tag and
deploys the matching image. Version tags do not move `latest`.

Configure these GitHub Actions repository variables for your AWS resources:

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Public base URL of the deployed backend |
| `VITE_IMGS` | Image folder in the frontend assets; defaults to `items` |
| `AWS_REGION` | AWS region; defaults to `us-east-1` |
| `ECR_REPOSITORY` | Frontend ECR repository; defaults to `biztrips` |
| `ECS_CLUSTER` | ECS cluster; defaults to `biztrips-cluster` |
| `ECS_SERVICE` | Frontend ECS service; defaults to `biztrips-service` |
| `ECS_CONTAINER_NAME` | Container name in the task definition; defaults to `biztrips` |

For AWS Academy Learner Lab, add the current session values as repository
secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and
`AWS_SESSION_TOKEN`. Refresh them whenever the lab session expires. The
`executionRoleArn` in `task-definition.json` must also refer to the
`LabRole` in your account. Do not commit credentials.

Create and push a version tag to publish a release:

```bash
git tag v1.2.0
git push origin v1.2.0
```

The Docker image serves the Vite build through nginx on port 80. The ECS task
definition and service must use that container port.
