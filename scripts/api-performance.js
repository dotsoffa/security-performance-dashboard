const fs = require('fs');

// Como este é um script de demonstração, simulamos os resultados
// Em um ambiente real, usaríamos o axios para fazer as requisições reais
function simulateApiCalls() {
  console.log('Carregando configuração de repositórios...');
  
  let repositoriesConfig;
  try {
    const configFile = fs.readFileSync('repositories.json', 'utf8');
    repositoriesConfig = JSON.parse(configFile);
  } catch (error) {
    console.error('Erro ao carregar configuração:', error);
    repositoriesConfig = { repositories: [] };
  }
  
  const results = [];
  const now = new Date().toISOString();
  
  console.log('Verificando endpoints...');
  
  // Percorre os repositórios configurados
  repositoriesConfig.repositories.forEach(repo => {
    if (repo.endpoints && Array.isArray(repo.endpoints)) {
      repo.endpoints.forEach(endpoint => {
        // Simulação de resposta da API
        // Em uma implementação real, faríamos requisições HTTP reais
        const responseTime = Math.floor(Math.random() * 2000); // Simula tempo entre 0-2000ms
        const isError = Math.random() < 0.2; // 20% de chance de erro
        
        results.push({
          repository: `${repo.owner}/${repo.name}`,
          endpoint: endpoint.name,
          url: endpoint.url,
          status: isError ? 500 : 200,
          responseTime: responseTime,
          timestamp: now,
          threshold: endpoint.alert_threshold_ms || 1000,
          isOverThreshold: responseTime > (endpoint.alert_threshold_ms || 1000)
        });
      });
    }
  });
  
  return results;
}

function generateReport(results) {
  const now = new Date().toISOString();
  let report = '# Relatório de Performance de APIs\n\n';
  report += `Gerado em: ${now}\n\n`;
  
  // Adiciona resumo
  report += '## Resumo\n\n';
  
  const overThresholdCount = results.filter(r => r.isOverThreshold).length;
  const errorCount = results.filter(r => r.status !== 200).length;
  
  report += `- **Total de endpoints monitorados:** ${results.length}\n`;
  report += `- **Endpoints com performance abaixo do esperado:** ${overThresholdCount}\n`;
  report += `- **Endpoints com erros:** ${errorCount}\n\n`;
  
  // Adiciona tabela de resultados
  report += '## Resultados\n\n';
  report += '| Repositório | Endpoint | Status | Tempo de Resposta | Limite | Situação |\n';
  report += '|-------------|----------|--------|-------------------|--------|----------|\n';
  
  results.forEach(result => {
    const status = result.status === 200 ? '✅ OK' : `❌ Erro (${result.status})`;
    const performance = result.isOverThreshold ? 
      `⚠️ ${result.responseTime}ms` : 
      `✅ ${result.responseTime}ms`;
    
    const situation = result.status !== 200 ? 
      '❌ Falha' : 
      (result.isOverThreshold ? '⚠️ Lento' : '✅ Normal');
    
    report += `| ${result.repository} | ${result.endpoint} | ${status} | ${performance} | ${result.threshold}ms | ${situation} |\n`;
  });
  
  // Adiciona detalhes para endpoints com problemas
  const problemEndpoints = results.filter(r => r.status !== 200 || r.isOverThreshold);
  
  if (problemEndpoints.length > 0) {
    report += '\n## Endpoints com Problemas\n\n';
    
    problemEndpoints.forEach(endpoint => {
      report += `### ${endpoint.endpoint} (${endpoint.url})\n\n`;
      report += `- **Repositório:** ${endpoint.repository}\n`;
      report += `- **Status:** ${endpoint.status === 200 ? 'OK' : 'Erro'}\n`;
      report += `- **Tempo de Resposta:** ${endpoint.responseTime}ms\n`;
      report += `- **Limite configurado:** ${endpoint.threshold}ms\n`;
      report += `- **Problema:** ${endpoint.status !== 200 ? 'Endpoint retornou erro' : 'Tempo de resposta acima do limite'}\n\n`;
      
      // Adiciona recomendações baseadas no tipo de problema
      report += '**Recomendações:**\n';
      
      if (endpoint.status !== 200) {
        report += '- Verificar se o serviço está em execução\n';
        report += '- Verificar logs do serviço para erros\n';
        report += '- Confirmar configuração de rede e firewalls\n';
      } else {
        report += '- Verificar carga do servidor\n';
        report += '- Analisar queries de banco de dados\n';
        report += '- Considerar otimização de código ou cache\n';
      }
      
      report += '\n';
    });
  }
  
  // Adiciona gráfico (em um ambiente real, poderíamos gerar um gráfico com chart.js)
  report += '## Tendência de Performance\n\n';
  report += 'Para visualizar tendências de performance ao longo do tempo, acesse o dashboard completo em:\n';
  report += 'https://github.com/dotsoffa/security-performance-dashboard/projects\n\n';
  
  // Escreve o relatório em um arquivo
  fs.writeFileSync('performance-report.md', report);
  console.log('Relatório de performance gerado com sucesso!');
  
  return report;
}

// Executa o monitoramento
console.log('Iniciando monitoramento de performance de APIs...');
const results = simulateApiCalls();
generateReport(results);
console.log('Monitoramento concluído!');