.PHONY: setup-windows setup-linux run-windows run-linux clean-windows clean-linux

# Windows commands (mantenidos por compatibilidad)
setup-windows:
	python -m venv venv
	.\venv\Scripts\activate && \
	pip install fastapi uvicorn python-multipart

run-windows:
	.\venv\Scripts\activate && \
	uvicorn app.main:app --reload

clean-windows:
	if exist venv rmdir /s /q venv
	if exist __pycache__ rmdir /s /q __pycache__
	if exist app\__pycache__ rmdir /s /q app\__pycache__

# Linux commands (adaptados para Docker/Ubuntu)
setup-linux:
	python3 -m venv venv
	. venv/bin/activate && \
	pip install fastapi uvicorn python-multipart

run-linux:
	. venv/bin/activate && \
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

clean-linux:
	rm -rf venv
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

# Detect OS and run appropriate commands
ifeq ($(OS),Windows_NT)
    setup: setup-windows
    run: run-windows
    clean: clean-windows
else
    setup: setup-linux
    run: run-linux
    clean: clean-linux
endif