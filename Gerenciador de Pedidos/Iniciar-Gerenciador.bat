@echo off
title Servidor do Meu Pet Em Arte
echo ===================================================
echo Iniciando o Gerenciador de Pedidos...
echo Por favor, nao feche esta janela preta.
echo ===================================================

cd /d "c:\Users\niilp\OneDrive\Documentos\PROJETO 1\Gerenciador de Pedidos"

start "" "http://localhost:5173"

npm run dev
