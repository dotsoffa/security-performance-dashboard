import os
import json
from datetime import datetime

def load_security_report():
    try:
        with open("security-report.json", "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Erro ao carregar relatório de segurança: {str(e)}")
        return {"generated_at": datetime.now().isoformat(), "results": []}

def generate_markdown_report(data):
    report = "# Relatório de Segurança\n\n"
    report += f"Gerado em: {datetime.now().isoformat()}\n\n"
    
    report += "## Resumo\n\n"
    report += "| Repositório | Status | Vulnerabilidades |\n"
    report += "|------------|--------|------------------|\n"
    
    total_vulnerabilities = 0
    
    for result in data.get("results", []):
        repo = result.get("repository")
        scan_result = result.get("result", {})
        status = "✅ OK" if scan_result.get("status") == "success" and scan_result.get("vulnerabilities", 0) == 0 else "❌ Problemas"
        vulnerabilities = scan_result.get("vulnerabilities", "N/A")
        
        if isinstance(vulnerabilities, int):
            total_vulnerabilities += vulnerabilities
        
        report += f"| {repo} | {status} | {vulnerabilities} |\n"
    
    report += f"\n**Total de vulnerabilidades encontradas:** {total_vulnerabilities}\n\n"
    
    report += "## Detalhes\n\n"
    for result in data.get("results", []):
        repo = result.get("repository")
        report += f"### {repo}\n\n"
        scan_result = result.get("result", {})
        
        if scan_result.get("status") == "error":
            report += f"Erro durante o escaneamento: {scan_result.get('message', 'Desconhecido')}\n\n"
        else:
            vulnerabilities = scan_result.get("vulnerabilities", 0)
            report += f"Vulnerabilidades encontradas: {vulnerabilities}\n\n"
            
            if vulnerabilities > 0 and scan_result.get("details"):
                report += "#### Detalhes das vulnerabilidades\n\n"
                for vuln in scan_result.get("details", [])[:5]:  # Limitar a 5 para não sobrecarregar o relatório
                    report += f"- **{vuln.get('package', 'Desconhecido')}**: {vuln.get('description', 'Sem descrição')}\n"
                    report += f"  - Severidade: {vuln.get('severity', 'Não especificada')}\n"
                    report += f"  - CVSS: {vuln.get('cvss_score', 'N/A')}\n\n"
    
    report += "## Recomendações\n\n"
    report += "1. Atualize as dependências com vulnerabilidades críticas o mais rápido possível\n"
    report += "2. Agende atualizações regulares para dependências com vulnerabilidades de baixa severidade\n"
    report += "3. Considere alternativas para pacotes com histórico constante de problemas de segurança\n"
    
    with open("security-report.md", "w") as f:
        f.write(report)
    
    return report

def create_github_issue():
    # Na implementação real, esta função usaria a API do GitHub para criar uma issue
    # Isso será feito pelo workflow do GitHub Actions utilizando a action peter-evans/create-issue-from-file
    pass

if __name__ == "__main__":
    print("Gerando relatório formatado...")
    data = load_security_report()
    report_md = generate_markdown_report(data)
    print("Relatório gerado com sucesso!")