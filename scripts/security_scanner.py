import os
import json
import requests
from datetime import datetime

def load_repositories():
    try:
        with open("repositories.json", "r") as f:
            data = json.load(f)
        return data.get("repositories", [])
    except Exception as e:
        print(f"Erro ao carregar repositórios: {str(e)}")
        return []

def check_repository_vulnerabilities(owner, repo_name):
    github_token = os.environ.get("GITHUB_TOKEN")
    
    # Esta é uma simulação. Em um ambiente real, usaríamos a API do GitHub
    # para verificar vulnerabilidades reais usando Dependabot ou outras ferramentas
    url = f"https://api.github.com/repos/{owner}/{repo_name}/vulnerability-alerts"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.dorian-preview+json"
    }
    
    # Como estamos apenas simulando, retornamos dados fictícios
    # Em um ambiente real, isso seria substituído por uma verificação real
    simulated_vulnerabilities = [
        {
            "package": "example-package",
            "severity": "high",
            "description": "Vulnerabilidade de execução de código remoto",
            "cvss_score": "8.9"
        },
        {
            "package": "another-library",
            "severity": "medium",
            "description": "Risco de exposição de informações",
            "cvss_score": "5.4"
        }
    ]
    
    # Na implementação real, descomente o código abaixo:
    '''
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            vulnerabilities = response.json()
            return {
                "status": "success",
                "vulnerabilities": len(vulnerabilities),
                "details": vulnerabilities
            }
        else:
            return {
                "status": "error",
                "message": f"Falha ao buscar vulnerabilidades: {response.status_code}"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
    '''
    
    # Simulamos sucesso para fins de demonstração
    return {
        "status": "success",
        "vulnerabilities": len(simulated_vulnerabilities),
        "details": simulated_vulnerabilities
    }

def generate_vulnerability_report():
    repositories = load_repositories()
    results = []
    
    for repo_info in repositories:
        owner = repo_info.get("owner")
        name = repo_info.get("name")
        
        print(f"Escaneando repositório: {owner}/{name}")
        result = check_repository_vulnerabilities(owner, name)
        results.append({
            "repository": f"{owner}/{name}",
            "scan_time": datetime.now().isoformat(),
            "result": result
        })
    
    # Salvar o resultado em um arquivo para uso posterior
    with open("security-report.json", "w") as f:
        json.dump({
            "generated_at": datetime.now().isoformat(),
            "results": results
        }, f, indent=2)
    
    print("Relatório de vulnerabilidades gerado com sucesso.")

if __name__ == "__main__":
    print("Iniciando análise de segurança...")
    generate_vulnerability_report()
    print("Análise concluída!")