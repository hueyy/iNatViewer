{ pkgs, lib, config, inputs, ... }:

{
  name = "inatviewer";

  packages = [ pkgs.git pkgs.act ];

  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  processes =
    {
      vite.exec = "pnpm exec vite dev --port 8002 app";
      server.exec = "tsx --watch-path=./server server/server.ts";
    };

  services.caddy = {
    enable = true;
    virtualHosts."http://localhost:8000" = {
      extraConfig = ''
        encode gzip
        handle_path /healthcheck {
          respond "OK"
        }

        handle /api/* {
          reverse_proxy localhost:8001
        }

        handle {
          reverse_proxy localhost:8002
        }
      '';
    };
  };

  scripts.build.exec = ''
    pnpm exec vite build app
  '';

  scripts.publish.exec = ''
    pnpm exec netlify deploy --prod
  '';

  enterShell = ''
  '';

  pre-commit.hooks = {
    mdsh.enable = true;
    biome = {
      enable = true;
    };
    nixpkgs-fmt.enable = true;
  };
}
