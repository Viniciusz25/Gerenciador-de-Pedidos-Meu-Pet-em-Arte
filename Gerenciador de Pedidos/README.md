# Gerenciador de Pedidos - Meu Pet em Arte

Um painel inteligente e completo desenvolvido para o gerenciamento de pedidos, controle de produção, envios e fluxo financeiro da loja **Meu Pet em Arte** (especializada em chaveiros personalizados). 

Este sistema foi construído para funcionar no navegador e armazena os dados localmente utilizando o `LocalStorage`.

## 🚀 Funcionalidades

- **Dashboard Integrada**: Visão geral do negócio com métricas de vendas, filas de produção, alertas de pedidos atrasados e relatórios rápidos.
- **Gestão de Pedidos**: Cadastro detalhado de novos pedidos, dados do cliente, fotos do pet, rastreamento de envio e controle de status de ponta a ponta.
- **Controle de Produção (Kanban)**: Acompanhamento visual da fila de impressão 3D, pintura e acabamentos, permitindo atualizar o status de cada item rapidamente.
- **Controle de Envios**: Gestão dedicada aos pedidos que estão prontos para envio, em postagem e entregues.
- **Catálogo de Produtos**: Cadastro de diferentes tipos de produtos, precificação e cálculo automático de margem de lucro e custos.
- **Gestão Financeira**: Lançamento de despesas (equipamentos, materiais, fretes, anúncios) e cálculo dinâmico de receitas, despesas e lucro líquido mensal.
- **Importação de Dados**: Suporte para importação de planilhas de pedidos.
- **Modo Escuro (Dark Mode)**: Suporte a temas claro e escuro para melhor experiência de uso.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias base da web, sem a necessidade de frameworks pesados, garantindo alta performance e fácil customização:
- **HTML5** & **CSS3** (Variáveis CSS, Flexbox, CSS Grid)
- **JavaScript (Vanilla)**
- **LocalStorage API** (Para persistência de dados no navegador do usuário)

## 📦 Como rodar o projeto

Como o projeto utiliza ES Modules (`<script type="module">`), ele precisa ser executado através de um servidor local (HTTP) ao invés de simplesmente abrir o arquivo diretamente no navegador com `file://`.

Você pode rodar o projeto facilmente de algumas formas:

**Opção 1: Usando a extensão Live Server no VS Code**
1. Abra a pasta do projeto no VS Code.
2. Instale a extensão "Live Server".
3. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.

**Opção 2: Usando Node.js (http-server)**
1. Certifique-se de ter o Node.js instalado.
2. Abra o terminal na pasta do projeto e instale o pacote globalmente (caso não tenha):
   ```bash
   npm install -g http-server
   ```
3. Rode o comando:
   ```bash
   http-server
   ```
4. Acesse o link gerado no terminal (geralmente `http://127.0.0.1:8080`).

## ⚠️ Observações sobre os Dados

Todos os dados, pedidos, produtos e despesas cadastrados são salvos diretamente no navegador (LocalStorage). 
- **O que isso significa?** Se você limpar os dados de navegação (cache/cookies) do seu navegador, as informações inseridas no painel podem ser perdidas. O sistema possui um recurso de **Backup Automático** interno, mas é recomendável ter cuidado ao fazer limpezas profundas no navegador.

---
*Desenvolvido para otimizar o fluxo de trabalho do ateliê Meu Pet em Arte.*
