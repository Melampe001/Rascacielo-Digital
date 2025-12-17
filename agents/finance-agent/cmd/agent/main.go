package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/Melampe001/Rascacielo-Digital/agents/finance-agent/internal/analytics"
)

var (
	// Flags de línea de comandos
	profile  = flag.String("profile", "moderate", "Perfil de riesgo: conservative, moderate, aggressive")
	horizon  = flag.Int("horizon", 5, "Horizonte de inversión en años")
	capital  = flag.Float64("capital", 100000.0, "Capital inicial en USD")
	configFile = flag.String("config", "config/config.yml", "Ruta al archivo de configuración")
)

func main() {
	// Parsear flags
	flag.Parse()

	// Mostrar banner
	printBanner()

	// Validar perfil de riesgo
	var riskProfile analytics.RiskProfile
	switch *profile {
	case "conservative":
		riskProfile = analytics.Conservative
	case "moderate":
		riskProfile = analytics.Moderate
	case "aggressive":
		riskProfile = analytics.Aggressive
	default:
		fmt.Fprintf(os.Stderr, "Error: Perfil de riesgo inválido '%s'. Use: conservative, moderate, o aggressive\n", *profile)
		os.Exit(1)
	}

	// Validar parámetros
	if *horizon <= 0 {
		fmt.Fprintf(os.Stderr, "Error: El horizonte de inversión debe ser mayor a 0 años\n")
		os.Exit(1)
	}

	if *capital <= 0 {
		fmt.Fprintf(os.Stderr, "Error: El capital inicial debe ser mayor a 0\n")
		os.Exit(1)
	}

	// Generar recomendación
	recommendation := analytics.GenerateRecommendation(riskProfile, *horizon, *capital)

	// Mostrar recomendación
	output := analytics.FormatRecommendation(recommendation)
	fmt.Println(output)

	// Mostrar nota sobre futuras expansiones
	printFooter()
}

func printBanner() {
	banner := `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         FINANCE AGENT - RASCACIELOS DIGITAL                  ║
║    Agente Especializado en Finanzas Internacionales         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`
	fmt.Println(banner)
}

func printFooter() {
	footer := `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nota: Esta es una recomendación inicial ficticia con fines
demostrativos. Para inversiones reales, consulte con un
asesor financiero profesional.

Próximas funcionalidades:
  • Conexión con APIs de mercados en tiempo real
  • Dashboard interactivo con gráficos
  • Análisis técnico y fundamental avanzado
  • Sistema de alertas y notificaciones
  • Gestión de múltiples portafolios

Para más información: https://github.com/Melampe001/Rascacielo-Digital
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
	fmt.Println(footer)
}
