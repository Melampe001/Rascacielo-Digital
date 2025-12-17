package analytics

import (
	"fmt"
)

// RiskProfile representa el perfil de riesgo de un inversor
type RiskProfile string

const (
	Conservative RiskProfile = "conservative"
	Moderate     RiskProfile = "moderate"
	Aggressive   RiskProfile = "aggressive"
)

// AssetAllocation representa la asignación de activos en un portafolio
type AssetAllocation struct {
	Stocks       float64 // Porcentaje en acciones
	Bonds        float64 // Porcentaje en bonos
	Cash         float64 // Porcentaje en efectivo
	Alternatives float64 // Porcentaje en alternativos
}

// GeographicAllocation representa la diversificación geográfica
type GeographicAllocation struct {
	NorthAmerica     float64 // Porcentaje en América del Norte
	Europe           float64 // Porcentaje en Europa
	AsiaPacific      float64 // Porcentaje en Asia-Pacífico
	EmergingMarkets  float64 // Porcentaje en mercados emergentes
}

// CurrencyExposure representa la exposición a diferentes divisas
type CurrencyExposure struct {
	USD float64 // Dólar estadounidense
	EUR float64 // Euro
	GBP float64 // Libra esterlina
	JPY float64 // Yen japonés
	CHF float64 // Franco suizo
}

// PortfolioRecommendation representa una recomendación completa de portafolio
type PortfolioRecommendation struct {
	Profile              RiskProfile
	InvestmentHorizon    int     // años
	InitialCapital       float64 // USD
	AssetAllocation      AssetAllocation
	GeographicAllocation GeographicAllocation
	CurrencyExposure     CurrencyExposure
	ExpectedReturn       float64 // porcentaje anual
	RiskLevel            string
}

// GetAssetAllocation retorna la asignación de activos basada en el perfil de riesgo
func GetAssetAllocation(profile RiskProfile) AssetAllocation {
	allocations := map[RiskProfile]AssetAllocation{
		Conservative: {
			Stocks:       20.0,
			Bonds:        60.0,
			Cash:         15.0,
			Alternatives: 5.0,
		},
		Moderate: {
			Stocks:       40.0,
			Bonds:        35.0,
			Cash:         15.0,
			Alternatives: 10.0,
		},
		Aggressive: {
			Stocks:       70.0,
			Bonds:        15.0,
			Cash:         5.0,
			Alternatives: 10.0,
		},
	}

	allocation, exists := allocations[profile]
	if !exists {
		// Por defecto, retornar perfil moderado
		return allocations[Moderate]
	}
	return allocation
}

// GetGeographicAllocation retorna la diversificación geográfica recomendada
func GetGeographicAllocation(profile RiskProfile) GeographicAllocation {
	allocations := map[RiskProfile]GeographicAllocation{
		Conservative: {
			NorthAmerica:    50.0,
			Europe:          30.0,
			AsiaPacific:     15.0,
			EmergingMarkets: 5.0,
		},
		Moderate: {
			NorthAmerica:    35.0,
			Europe:          30.0,
			AsiaPacific:     25.0,
			EmergingMarkets: 10.0,
		},
		Aggressive: {
			NorthAmerica:    30.0,
			Europe:          25.0,
			AsiaPacific:     25.0,
			EmergingMarkets: 20.0,
		},
	}

	allocation, exists := allocations[profile]
	if !exists {
		return allocations[Moderate]
	}
	return allocation
}

// GetCurrencyExposure retorna la exposición recomendada a divisas
func GetCurrencyExposure(profile RiskProfile) CurrencyExposure {
	exposures := map[RiskProfile]CurrencyExposure{
		Conservative: {
			USD: 60.0,
			EUR: 20.0,
			GBP: 10.0,
			JPY: 5.0,
			CHF: 5.0,
		},
		Moderate: {
			USD: 45.0,
			EUR: 25.0,
			GBP: 15.0,
			JPY: 10.0,
			CHF: 5.0,
		},
		Aggressive: {
			USD: 35.0,
			EUR: 25.0,
			GBP: 15.0,
			JPY: 15.0,
			CHF: 10.0,
		},
	}

	exposure, exists := exposures[profile]
	if !exists {
		return exposures[Moderate]
	}
	return exposure
}

// GetExpectedReturn retorna el retorno esperado anual según el perfil
func GetExpectedReturn(profile RiskProfile) float64 {
	returns := map[RiskProfile]float64{
		Conservative: 4.0,
		Moderate:     6.5,
		Aggressive:   9.5,
	}

	ret, exists := returns[profile]
	if !exists {
		return returns[Moderate]
	}
	return ret
}

// GetRiskLevel retorna el nivel de riesgo como string
func GetRiskLevel(profile RiskProfile) string {
	levels := map[RiskProfile]string{
		Conservative: "Bajo",
		Moderate:     "Medio",
		Aggressive:   "Alto",
	}

	level, exists := levels[profile]
	if !exists {
		return levels[Moderate]
	}
	return level
}

// GenerateRecommendation genera una recomendación completa de portafolio
func GenerateRecommendation(profile RiskProfile, horizon int, capital float64) PortfolioRecommendation {
	return PortfolioRecommendation{
		Profile:              profile,
		InvestmentHorizon:    horizon,
		InitialCapital:       capital,
		AssetAllocation:      GetAssetAllocation(profile),
		GeographicAllocation: GetGeographicAllocation(profile),
		CurrencyExposure:     GetCurrencyExposure(profile),
		ExpectedReturn:       GetExpectedReturn(profile),
		RiskLevel:            GetRiskLevel(profile),
	}
}

// FormatRecommendation formatea la recomendación para mostrarla de forma legible
func FormatRecommendation(rec PortfolioRecommendation) string {
	output := "=== Finance Agent - Recomendación de Portafolio ===\n\n"
	
	output += fmt.Sprintf("Perfil del Inversor: %s\n", rec.Profile)
	output += fmt.Sprintf("Horizonte de Inversión: %d años\n", rec.InvestmentHorizon)
	output += fmt.Sprintf("Capital Inicial: $%.2f\n\n", rec.InitialCapital)
	
	output += "Recomendación de Asignación:\n"
	output += fmt.Sprintf("  - Acciones: %.2f%% ($%.2f)\n", 
		rec.AssetAllocation.Stocks, rec.InitialCapital*rec.AssetAllocation.Stocks/100)
	output += fmt.Sprintf("  - Bonos: %.2f%% ($%.2f)\n", 
		rec.AssetAllocation.Bonds, rec.InitialCapital*rec.AssetAllocation.Bonds/100)
	output += fmt.Sprintf("  - Efectivo: %.2f%% ($%.2f)\n", 
		rec.AssetAllocation.Cash, rec.InitialCapital*rec.AssetAllocation.Cash/100)
	output += fmt.Sprintf("  - Alternativos: %.2f%% ($%.2f)\n\n", 
		rec.AssetAllocation.Alternatives, rec.InitialCapital*rec.AssetAllocation.Alternatives/100)
	
	output += "Diversificación por Región:\n"
	output += fmt.Sprintf("  - América del Norte: %.0f%%\n", rec.GeographicAllocation.NorthAmerica)
	output += fmt.Sprintf("  - Europa: %.0f%%\n", rec.GeographicAllocation.Europe)
	output += fmt.Sprintf("  - Asia-Pacífico: %.0f%%\n", rec.GeographicAllocation.AsiaPacific)
	output += fmt.Sprintf("  - Mercados Emergentes: %.0f%%\n\n", rec.GeographicAllocation.EmergingMarkets)
	
	output += "Exposición a Divisas:\n"
	output += fmt.Sprintf("  - USD: %.0f%%\n", rec.CurrencyExposure.USD)
	output += fmt.Sprintf("  - EUR: %.0f%%\n", rec.CurrencyExposure.EUR)
	output += fmt.Sprintf("  - GBP: %.0f%%\n", rec.CurrencyExposure.GBP)
	output += fmt.Sprintf("  - JPY: %.0f%%\n", rec.CurrencyExposure.JPY)
	output += fmt.Sprintf("  - CHF: %.0f%%\n\n", rec.CurrencyExposure.CHF)
	
	output += fmt.Sprintf("Retorno Esperado: %.1f%% anual\n", rec.ExpectedReturn)
	output += fmt.Sprintf("Nivel de Riesgo: %s\n", rec.RiskLevel)
	
	return output
}
