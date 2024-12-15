{ pkgs, lib, config, inputs, ... }:

{
  packages = [ pkgs.git pkgs.act ];

  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  scripts.dev.exec = ''
    pnpm exec vite dev
  '';

  scripts.build.exec = ''
    pnpm exec vite build
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
  };
}
