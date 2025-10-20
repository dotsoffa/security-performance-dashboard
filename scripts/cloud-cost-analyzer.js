const fs = require('fs');

// Este é um script de demonstração que simula análise de custos cloud
// Em um ambiente real, usaríamos as APIs oficiais dos provedores cloud (AWS, Azure, GCP)

function simulateCloudCosts() {
  console.log('Carregando configuração...');
  
  let repositoriesConfig;
  try {
    const configFile = fs.readFileSync('repositories.json', 'utf8');
    repositoriesConfig = JSON.parse(configFile);
  } catch (error) {
    console.error('Erro ao carregar configuração:', error);
    repositoriesConfig = { repositories: [] };
  }
  
  // Data para simulação
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 30); // Últimos 30 dias
  
  const results = {
    period: {
      start: startDate.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    },
    total_cost: 0,
    resources: [],
    trends: {
      previous_month_cost: 0,
      current_month_cost: 0,
      percentage_change: 0
    },
    recommendations: []
  };
  
  // Simulação de custos por repositório e recurso
  repositoriesConfig.repositories.forEach(repo => {
    if (repo.cloud_resources && Array.isArray(repo.cloud_resources)) {
      repo.cloud_resources.forEach(resource => {
        // Simula custos diários variados para gerar flutuações realistas
        const dailyCosts = [];
        let resourceTotalCost = 0;
        
        for (let i = 0; i < 30; i++) {
          // Gera um custo diário com pequenas variações
          const baseCost = resource.type === 'RDS' ? 15 : (resource.type === 'EC2' ? 8 : 5);
          const dailyCost = baseCost * (0.85 + Math.random() * 0.3); // Variação de -15% a +15%
          dailyCosts.push(dailyCost);
          resourceTotalCost += dailyCost;
        }
        
        // Calcula alguns valores úteis para a análise
        const avgCost = resourceTotalCost / 30;
        const previousPeriodCost = resourceTotalCost * (0.9 + Math.random() * 0.2); // Simula custo anterior
        const costChange = ((resourceTotalCost - previousPeriodCost) / previousPeriodCost) * 100;
        
        // Adiciona aos custos totais
        results.total_cost += resourceTotalCost;
        results.trends.previous_month_cost += previousPeriodCost;
        results.trends.current_month_cost += resourceTotalCost;
        
        // Adiciona o recurso aos resultados
        results.resources.push({
          repository: `${repo.owner}/${repo.name}`,
          resource: resource.name,
          type: resource.type,
          cost_center: resource.cost_center,
          total_cost: Math.round(resourceTotalCost * 100) / 100,
          daily_average: Math.round(avgCost * 100) / 100,
          cost_change_percent: Math.round(costChange * 100) / 100,
          daily_costs: dailyCosts.map(cost => Math.round(cost * 100) / 100)
        });
        
        // Gera recomendações baseadas nos padrões de uso simulados
        if (costChange > 15) {
          results.recommendations.push({
            resource: resource.name,
            type: "cost_increase",
            message: `O recurso ${resource.name} apresentou aumento de custo de ${Math.round(costChange)}% em relação ao período anterior.`,
            severity: "high",
            potential_savings: Math.round(resourceTotalCost * 0.2 * 100) / 100
          });
        }
        
        // Simula detecção de recursos subutilizados
        if (resource.type === 'EC2' && Math.random() > 0.7) {
          results.recommendations.push({
            resource: resource.name,
            type: "underutilized",
            message: `O recurso ${resource.name} apresenta baixa utilização (<20% CPU). Considere redimensionar.`,
            severity: "medium",
            potential_savings: Math.round(resourceTotalCost * 0.4 * 100) / 100
          });
        }
      });
    }
  });
  
  // Calcula a mudança percentual total
  results.trends.percentage_change = Math.round(((results.trends.current_month_cost - results.trends.previous_month_cost) / results.trends.previous_month_cost) * 100 * 100) / 100;
  
  // Arredonda os totais
  results.total_cost = Math.round(results.total_cost * 100) / 100;
  results.trends.previous_month_cost = Math.round(results.trends.previous_month_cost * 100) / 100;
  results.trends.current_month_cost = Math.round(results.trends.current_month_cost * 100) / 100;
  
  return results;
}

function generateReport(results) {
  const now = new Date().toISOString();
  let report = '# Relatório de Custos Cloud\n\n';
  report += `Gerado em: ${now}\n\n`;
  report += `Período analisado: ${results.period.start} a ${results.period.end}\n\n`;
  
  // Adiciona resumo
  report += '## Resumo\n\n';
  report += `- **Custo total no período:** $${results.total_cost}\n`;
  report += `- **Custo do período anterior:** $${results.trends.previous_month_cost}\n`;
  report += `- **Variação:** ${results.trends.percentage_change > 0 ? '+' : ''}${results.trends.percentage_change}%\n\n`;
  
  // Adiciona tabela de recursos
  report += '## Recursos por Custo\n\n';
  report += '| Repositório | Recurso | Tipo | Centro de Custo | Custo Total | Média Diária | Variação |\n';
  report += '|-------------|---------|------|----------------|-------------|--------------|----------|\n';
  
  // Ordena recursos por custo total (decrescente)
  const sortedResources = [...results.resources].sort((a, b) => b.total_cost - a.total_cost);
  
  sortedResources.forEach(resource => {
    const changeEmoji = resource.cost_change_percent > 10 ? '🔺' : 
                       (resource.cost_change_percent < -10 ? '🔽' : '');
    
    report += `| ${resource.repository} | ${resource.resource} | ${resource.type} | ${resource.cost_center} | $${resource.total_cost} | $${resource.daily_average} | ${changeEmoji} ${resource.cost_change_percent > 0 ? '+' : ''}${resource.cost_change_percent}% |\n`;
  });
  
  // Adiciona recomendações
  if (results.recommendations.length > 0) {
    report += '\n## Recomendações de Otimização\n\n';
    
    results.recommendations.forEach((rec, index) => {
      const severityEmoji = rec.severity === 'high' ? '🔴' : 
                          (rec.severity === 'medium' ? '🟠' : '🟡');
      
      report += `### ${severityEmoji} Recomendação ${index + 1}\n\n`;
      report += `**Recurso:** ${rec.resource}\n\n`;
      report += `**Problema:** ${rec.message}\n\n`;
      report += `**Economia potencial:** $${rec.potential_savings}/mês\n\n`;
    });
  }
  
  // Adiciona seção de próximos passos
  report += '## Próximos Passos\n\n';
  report += '1. Revisar recursos com maior custo e avaliar necessidade\n';
  report += '2. Implementar recomendações de otimização para redução de custos\n';
  report += '3. Configurar alertas para aumentos inesperados de custo\n';
  report += '4. Revisar políticas de escalabilidade automática\n\n';
  
  // Escreve o relatório em um arquivo
  fs.writeFileSync('cost-report.md', report);
  console.log('Relatório de custos gerado com sucesso!');
  
  return report;
}

// Executa a análise
console.log('Iniciando análise de custos cloud...');
const results = simulateCloudCosts();
generateReport(results);
console.log('Análise concluída!');