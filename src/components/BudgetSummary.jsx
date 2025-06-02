import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Minus, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const BudgetSummary = ({ materials, area }) => {
  const totalCurrent = materials.reduce((sum, material) => sum + (material.quantity * material.price), 0);
  const totalMarket = materials.reduce((sum, material) => sum + (material.quantity * material.marketPrice), 0);
  const totalSavings = totalMarket - totalCurrent;
  const costPerM2 = area > 0 ? totalCurrent / area : 0;

  const getSavingsIcon = () => {
    if (totalSavings > 0) return TrendingDown;
    if (totalSavings < 0) return TrendingUp;
    return Minus;
  };

  const SavingsIcon = getSavingsIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass-effect-dark border-amber-500/30 backdrop-blur-xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-amber-500/50">
            <Landmark className="h-8 w-8 text-amber-400" />
          </div>
          <CardTitle className="text-2xl text-white font-semibold">Resumo do Orçamento</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600">
              <div className="text-gray-300 text-sm mb-1">Total (Seu Preço)</div>
              <div className="text-3xl font-bold text-green-400">
                R$ {totalCurrent.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600">
              <div className="text-gray-300 text-sm mb-1">Total (Preço de Mercado)</div>
              <div className="text-2xl font-semibold text-orange-400">
                R$ {totalMarket.toFixed(2)}
              </div>
            </div>
            
            {totalSavings !== 0 && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`rounded-lg p-4 text-center ${
                  totalSavings > 0 
                    ? 'bg-green-600/20 border border-green-500/30' 
                    : 'bg-red-600/20 border border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <SavingsIcon className="h-5 w-5 text-white" />
                  <div className="text-gray-300 text-sm">
                    {totalSavings > 0 ? 'Economia Estimada' : 'Custo Adicional vs Mercado'}
                  </div>
                </div>
                <div className={`text-2xl font-bold ${
                  totalSavings > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {totalSavings > 0 ? '-' : '+'}R$ {Math.abs(totalSavings).toFixed(2)}
                </div>
              </motion.div>
            )}
            
            {area > 0 && (
              <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600">
                <div className="text-gray-300 text-sm mb-1">Custo por m² (Seu Preço)</div>
                <div className="text-xl font-semibold text-blue-400">
                  R$ {costPerM2.toFixed(2)}/m²
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center text-gray-400 text-xs">
            <p>💰 Valores de mercado são estimativas e podem variar.</p>
            <p>🛠️ Ajuste os preços dos materiais para maior precisão.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BudgetSummary;