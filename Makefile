.PHONY: all
all: ./assets/syntax-light.css ./assets/syntax-dark.css

./assets/syntax-light.css:
	hugo gen chromastyles --style=github > ./assets/syntax-light.css
./assets/syntax-dark.css:
	hugo gen chromastyles --style=github-dark > ./assets/syntax-dark.css
