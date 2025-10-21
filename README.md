# CHEK+

A production-ready Nuxt 3 streaming experience inspired by [nuxt/movies](https://github.com/nuxt/movies). The app consumes JWPlayer public APIs, normalizes data for fast access, and plays HLS streams through the MIT-licensed Mux Player web component.

## Features

- **SSR-first Nuxt 3 app** with Tailwind CSS, TypeScript, and Pinia state management.
- **JWPlayer integration** via edge-cached Nitro API routes with SWR headers.
- **Mux Player** component for HLS playback with caption support.
- **Home shelves, playlist pages, series hubs, search, and favorites** (localStorage backed).
- **Dark mode toggle**, skeleton loading states, and instant route prefetch.

## Getting Started

```bash
pnpm install
pnpm dev
```

The project also works with `npm` or `yarn` should you prefer different package managers.

### Environment variables

Configure the JWPlayer site configuration identifier via `.env` or your deployment platform:

```
SITE_CONFIG_ID=fv9lohqo
```

This ID can be rotated at any time—Nitro caches playlists and media for five minutes while allowing stale responses for 24 hours.

## Available Scripts

- `pnpm dev` – start the Nuxt development server with hot module replacement.
- `pnpm build` – build the production bundle.
- `pnpm start` – run the production server.
- `pnpm test` – execute unit tests with Vitest (see `tests/playlist-normalizer.spec.ts`).

## Deployment

The app ships with zero server-side secrets and is safe to deploy on **Vercel**, **Netlify**, or **Cloudflare Pages**:

1. Create a new project from this repository.
2. Set the `SITE_CONFIG_ID` environment variable in the platform dashboard.
3. Deploy—Nitro’s cached API routes and the in-memory client cache keep JWPlayer responses fast.

For Cloudflare Pages, ensure the “Functions” runtime is enabled; for Vercel, no extra configuration is required.

## Testing

A sample Vitest spec verifies playlist normalization logic. Extend this suite with additional transformations or edge cases as needed.

## License

The project uses JWPlayer’s public APIs and the MIT-licensed [@mux/mux-player](https://github.com/muxinc/elements/tree/main/packages/mux-player). All application code is MIT licensed unless noted otherwise.
