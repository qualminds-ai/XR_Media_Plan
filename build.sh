#!/bin/bash
set -e

echo "Installing system dependencies..."
apt-get update
apt-get install -y build-essential python3-dev python3-setuptools pkg-config

echo "Upgrading pip and installing build tools..."
pip install --upgrade pip setuptools wheel

echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

echo "Build completed successfully!"
