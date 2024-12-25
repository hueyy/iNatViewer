# iNatViewer

[iNatViewer](https://github.com/hueyy/iNatViewer) is a simple viewer for [iNaturalist](https://www.inaturalist.org/) observations and images. It is still at a very preliminary stage and is under heavy development. Visit [inatviewer.huey.xyz](https://inatviewer.huey.xyz/) for a demo. 

## Development

This project uses [`devenv`](https://devenv.sh/) to allow you to easily set up the required development environment. After installing `devenv`, cloning this repository, and entering into the repository directory:

```bash
devenv shell
devenv up
```

The app (in development mode) will then be accessible at [`http://localhost:8000`](http://localhost:8000).

## Deployment

Using [`docker-compose`](https://docs.docker.com/compose/)

```bash
docker compose up
```

You can specify the port via a `.env` file:

```
PORT=8002
```

The default port is `8000`.
