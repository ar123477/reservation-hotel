// src/components/superadmin/CrossHotelAnalytics.js
import React, { useState } from 'react';

const CrossHotelAnalytics = ({ hotels, performanceData }) => {
  const [selectedMetric, setSelectedMetric] = useState('Taux d\'occupation');
  const [dateRange, setDateRange] = useState('mois_courant');

  const activeHotels = hotels.filter(h => h.statut === 'actif');

  const metrics = [
    { value: "Taux d'occupation", label: "📊 Taux d'occupation" },
    { value: "Revenu par chambre", label: "💰 Revenu par chambre" },
    { value: "Réservations directes", label: "📅 Réservations directes" }
  ];

  const getMetricData = (metric) => {
    return performanceData.find(m => m.metrique === metric);
  };

  const currentMetric = getMetricData(selectedMetric);

  const renderComparisonChart = () => {
    if (!currentMetric) return null;

    const maxValue = Math.max(
      currentMetric.sarakawa,
      currentMetric.deuxFevrier,
      currentMetric.palmBeach,
      currentMetric.moyenne
    );

    return (
      <div className="comparison-chart">
        {['sarakawa', 'deuxFevrier', 'palmBeach', 'moyenne'].map(hotel => (
          <div key={hotel} className="chart-item">
            <div className="hotel-label">
              {hotel === 'sarakawa' ? 'Sarakawa' :
               hotel === 'deuxFevrier' ? '2 Février' :
               hotel === 'palmBeach' ? 'Palm Beach' : 'Moyenne'}
            </div>
            <div className="chart-bar-container">
              <div 
                className="chart-bar"
                style={{ 
                  width: `${(currentMetric[hotel] / maxValue) * 100}%`,
                  backgroundColor: hotel === 'moyenne' ? '#6b7280' : '#3b82f6'
                }}
              >
                <span className="bar-value">
                  {selectedMetric === "Taux d'occupation" ? `${currentMetric[hotel]}%` :
                   selectedMetric === "Revenu par chambre" ? `${currentMetric[hotel].toLocaleString()} FCFA` :
                   `${currentMetric[hotel]}%`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getPerformanceInsights = () => {
    const insights = [];
    
    // Analyse taux d'occupation
    const occupationData = getMetricData("Taux d'occupation");
    if (occupationData) {
      if (occupationData.sarakawa > occupationData.moyenne + 5) {
        insights.push({
          type: 'success',
          message: 'Sarakawa excelle avec un taux d\'occupation bien supérieur à la moyenne'
        });
      }
      if (occupationData.palmBeach < occupationData.moyenne - 5) {
        insights.push({
          type: 'warning', 
          message: 'Palm Beach a un taux d\'occupation inférieur à la moyenne'
        });
      }
    }

    // Analyse revenu par chambre
    const revenueData = getMetricData("Revenu par chambre");
    if (revenueData) {
      if (revenueData.palmBeach > revenueData.moyenne + 50000) {
        insights.push({
          type: 'success',
          message: 'Palm Beach génère un excellent revenu par chambre'
        });
      }
    }

    return insights;
  };

  const performanceInsights = getPerformanceInsights();

  return (
    <div className="cross-hotel-analytics">
      <div className="analytics-header">
        <h2>📈 Analytics Croisés Multi-Hôtels</h2>
        <div className="analytics-controls">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            {metrics.map(metric => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
          
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="semaine">7 derniers jours</option>
            <option value="mois_courant">Mois en cours</option>
            <option value="trimestre">Trimestre</option>
            <option value="annee">Année</option>
          </select>
        </div>
      </div>

      {/* Métrique principale */}
      <div className="primary-metric">
        <div className="metric-card">
          <h3>{selectedMetric}</h3>
          <div className="metric-comparison">
            {renderComparisonChart()}
          </div>
        </div>
      </div>

      <div className="analytics-content">
        {/* Insights performance */}
        <div className="performance-insights">
          <h3>💡 Insights de Performance</h3>
          <div className="insights-list">
            {performanceInsights.length > 0 ? (
              performanceInsights.map((insight, index) => (
                <div key={index} className={`insight-card ${insight.type}`}>
                  <div className="insight-icon">
                    {insight.type === 'success' ? '✅' : '⚠️'}
                  </div>
                  <div className="insight-content">
                    <p>{insight.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-insights">
                <p>Aucun insight significatif pour cette période</p>
              </div>
            )}
          </div>
        </div>

        {/* Tableau comparatif détaillé */}
        <div className="comparison-table">
          <h3>📋 Comparaison Détaillée</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Métrique</th>
                <th>Sarakawa</th>
                <th>2 Février</th>
                <th>Palm Beach</th>
                <th>Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map(metric => (
                <tr key={metric.metrique}>
                  <td className="metric-name">{metric.metrique}</td>
                  <td className={metric.sarakawa > metric.moyenne ? 'positive' : metric.sarakawa < metric.moyenne ? 'negative' : ''}>
                    {metric.metrique === "Taux d'occupation" || metric.metrique === "Réservations directes" 
                      ? `${metric.sarakawa}%` 
                      : `${metric.sarakawa.toLocaleString()} FCFA`}
                  </td>
                  <td className={metric.deuxFevrier > metric.moyenne ? 'positive' : metric.deuxFevrier < metric.moyenne ? 'negative' : ''}>
                    {metric.metrique === "Taux d'occupation" || metric.metrique === "Réservations directes" 
                      ? `${metric.deuxFevrier}%` 
                      : `${metric.deuxFevrier.toLocaleString()} FCFA`}
                  </td>
                  <td className={metric.palmBeach > metric.moyenne ? 'positive' : metric.palmBeach < metric.moyenne ? 'negative' : ''}>
                    {metric.metrique === "Taux d'occupation" || metric.metrique === "Réservations directes" 
                      ? `${metric.palmBeach}%` 
                      : `${metric.palmBeach.toLocaleString()} FCFA`}
                  </td>
                  <td className="average">
                    {metric.metrique === "Taux d'occupation" || metric.metrique === "Réservations directes" 
                      ? `${metric.moyenne}%` 
                      : `${metric.moyenne.toLocaleString()} FCFA`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommandations stratégiques */}
      <div className="strategic-recommendations">
        <h3>🎯 Recommandations Stratégiques</h3>
        <div className="recommendations-grid">
          <div className="recommendation-card">
            <h4>📈 Optimisation Tarifaire</h4>
            <p>Augmenter les tarifs de 5% pour Sarakawa qui présente une forte demande</p>
            <div className="impact-estimate">
              <strong>Impact estimé:</strong> +2.5M FCFA/mois
            </div>
          </div>
          
          <div className="recommendation-card">
            <h4>🎪 Promotion Palm Beach</h4>
            <p>Lancer une campagne promotionnelle pour améliorer le taux d'occupation</p>
            <div className="impact-estimate">
              <strong>Impact estimé:</strong> +15% d'occupation
            </div>
          </div>
          
          <div className="recommendation-card">
            <h4>🔄 Processus Standardisés</h4>
            <p>Implémenter les meilleures pratiques de Sarakawa dans les autres hôtels</p>
            <div className="impact-estimate">
              <strong>Impact estimé:</strong> +8% efficacité globale
            </div>
          </div>
        </div>
      </div>

      {/* Tendance du réseau */}
      <div className="network-trends">
        <h3>📈 Tendances du Réseau</h3>
        <div className="trends-grid">
          <div className="trend-card">
            <h4>Croissance du Réseau</h4>
            <div className="trend-chart">
              {/* Graphique simplifié de croissance */}
              <div className="chart-placeholder">
                📈 +25% de croissance sur 6 mois
              </div>
            </div>
          </div>
          
          <div className="trend-card">
            <h4>Répartition Géographique</h4>
            <div className="geo-distribution">
              <div className="geo-item">
                <span>Lomé</span>
                <div className="geo-bar">
                  <div className="geo-fill" style={{width: '75%'}}></div>
                </div>
                <span>75%</span>
              </div>
              <div className="geo-item">
                <span>Kara</span>
                <div className="geo-bar">
                  <div className="geo-fill" style={{width: '25%'}}></div>
                </div>
                <span>25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossHotelAnalytics;