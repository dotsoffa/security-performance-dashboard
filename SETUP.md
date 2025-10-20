# Configuração do Sistema de Monitoramento

## Pré-requisitos

1. Acesso ao GitHub com permissões para Actions
2. Credenciais AWS (opcional)

## Configuração Inicial

### 1. Configurar Secrets do GitHub

Configure os seguintes secrets:
- `GITHUB_TOKEN`: Automático
- `AWS_ACCESS_KEY_ID`: Para análise de custos
- `AWS_SECRET_ACCESS_KEY`: Chave secreta AWS

### 2. Configurar Repositórios

Edite o arquivo `repositories.json` para incluir os repositórios a monitorar.

### 3. Configurar Project Board

1. Crie um Project Board no repositório
2. Configure colunas: "A Investigar", "Em Análise", "Resolvido"

## Execução Manual

1. Acesse a aba "Actions" 
2. Selecione o workflow
3. Clique em "Run workflow"