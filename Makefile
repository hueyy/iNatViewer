build: $(shell find src) public/* node_modules
	mkdir -p build
	pnpm run shadow-cljs release app
	rsync -aLz --exclude js --exclude '.*.swp' public/ build
	touch build

node_modules: package.json
	pnpm i

.PHONY: watch clean

watch-shadow-cljs: node_modules
	pnpm exec shadow-cljs watch app

watch-tailwindcss: node_modules
	pnpm exec postcss public/style.css -o ./public/built.css --verbose -w

watch:
	make -j2 watch-shadow-cljs watch-tailwindcss

repl: node_modules
	pnpm run shadow-cljs cljs-repl app

clean:
	rm -rf build

deploy:
	netlify deploy --prod