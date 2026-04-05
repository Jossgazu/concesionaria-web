.PHONY: build run test clean migrate tidy

APP_NAME=concesionaria-backend
BUILD_DIR=./bin

build:
	@echo "Building..."
	@mkdir -p $(BUILD_DIR)
	go build -o $(BUILD_DIR)/$(APP_NAME) ./cmd/server

run: build
	@echo "Running..."
	$(BUILD_DIR)/$(APP_NAME)

test:
	go test -v ./...

tidy:
	go mod tidy

clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)

migrate:
	@echo "Running migrations..."
	go run ./cmd/server migrate

docker-build:
	docker build -t $(APP_NAME) .

docker-run:
	docker run -p 3000:3000 --env-file .env $(APP_NAME)

lint:
	golangci-lint run ./...

setup:
	@echo "Installing dependencies..."
	go mod download
	@echo "Setup complete!"
