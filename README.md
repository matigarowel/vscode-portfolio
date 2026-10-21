# vscode-portfolio
[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://vscode.dev/github/itsnitinr/vscode-portfolio)

A Visual Studio Code themed developer portfolio website built with Next.js and deployed on Vercel.

![vscode-portfolio banner](https://imgur.com/JXJ9mpO.gif)

## Features Roadmap

- [ ] Themes and customizations
  - [x] GitHub Dark (default)
  - [ ] One Dark Pro
  - [x] Dracula
  - [x] Ayu
  - [x] Nord
- [x] Interactive custom terminal

For other features and themes suggestions, please open an issue.

## Environment Variables

For fetching your articles from dev.to, create an `.env.local` file inside the project directory. See `.env.example` for the required variables.

To enable Google Analytics 4, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to your GA4 measurement ID (for example, `G-XXXXXXXXXX`). This is a public ID, not a secret. For Docker builds, pass it through `.env.local`; for GitHub Actions deployments, configure it as the repository variable `NEXT_PUBLIC_GA_MEASUREMENT_ID`. If unset, analytics is disabled.

To enable Microsoft Clarity, set `NEXT_PUBLIC_CLARITY_PROJECT_ID` to your Clarity project ID. For Docker builds, add it to `.env.local`; for GitHub Actions deployments, configure it as the repository variable `NEXT_PUBLIC_CLARITY_PROJECT_ID`. The ID is public, and Clarity is disabled when it is unset.

The chat panel embeds Langflow directly. If the flow requires an API key, set `NEXT_PUBLIC_LANGFLOW_API_KEY` in `.env.local`. This key is sent to the browser by the embedded chat, so use a key intended for public client-side use and restrict it appropriately.

## Running Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

All VSCode related components can be found in the `components` folder. To change the content of the portfolio, check out the `pages` folder. To add or remove pages, modify `components/Sidebar.jsx` and `components/Tabsbar.jsx`.

## Deploy with Docker

Create `.env.local` for optional runtime integrations such as `LANGFLOW_API_KEY` and `DEV_TO_API_KEY`:

```bash
docker compose --env-file .env.local up --build -d
```

The portfolio will be available at [http://localhost:3006](http://localhost:3006).

## Next.js Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
