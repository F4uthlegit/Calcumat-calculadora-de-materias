import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hammer, Truck, Package, Home, Building, HardHat } from 'lucide-react';
import CalculatorForm from '@/components/CalculatorForm';
import MaterialCard from '@/components/MaterialCard';
import BudgetSummary from '@/components/BudgetSummary';
import { Toaster } from '@/components/ui/toaster';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function App() {
  const [area, setArea] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [customPrices, setCustomPrices] = useLocalStorage('construction-calculator-prices-v2', {});

  // Preços médios estimados para a Região Sul (RS) - Junho 2025
  // Estes são valores aproximados e podem variar significativamente.
  // Brita: R$ 70-90/m³
  // Areia Média Lavada: R$ 60-80/m³
  // Cimento CPII 50kg: R$ 35-45/saco
  const marketPricesRS = {
    brita: 80.00, 
    areia: 70.00, 
    cimento: 40.00 
  };

  // Traço de concreto comum (ex: C20 - 1:2.8:3.5 - cimento:areia:brita em volume)
  // Para simplificação, vamos usar proporções aproximadas para o cálculo de materiais por m³ de concreto.
  // Cimento: ~7 sacos/m³ (considerando perdas e um traço médio)
  // Areia: ~0.52 m³/m³ de concreto
  // Brita: ~0.83 m³/m³ de concreto
  // Estas são aproximações. O cálculo exato depende do traço específico e das características dos agregados.
  // Para o cálculo atual, estamos usando:
  // Brita: 60% do volume total (volume * 0.6)
  // Areia: 40% do volume total (volume * 0.4)
  // Cimento: 7 sacos por m³ de volume total (volume * 7)
  // Esta é uma simplificação comum para estimativas rápidas.

  const calculateMaterials = (areaValue, thickness) => {
    const volumeTotalConcreto = areaValue * thickness; // Volume total de concreto necessário

    // Quantidades de material por m³ de concreto (aproximado para traço comum)
    const cimentoPorM3Concreto = 7; // sacos/m³
    const areiaPorM3Concreto = 0.52; // m³/m³
    const britaPorM3Concreto = 0.83; // m³/m³

    const cimentoSacos = volumeTotalConcreto * cimentoPorM3Concreto;
    const areiaVolume = volumeTotalConcreto * areiaPorM3Concreto;
    const britaVolume = volumeTotalConcreto * britaPorM3Concreto;
    
    const calculatedMaterials = [
      {
        id: 'brita',
        material: 'Brita',
        quantity: britaVolume,
        unit: 'm³',
        price: customPrices.brita || marketPricesRS.brita,
        marketPrice: marketPricesRS.brita,
        icon: Package,
        color: 'bg-gradient-to-r from-slate-500 to-slate-700'
      },
      {
        id: 'areia',
        material: 'Areia Média',
        quantity: areiaVolume,
        unit: 'm³',
        price: customPrices.areia || marketPricesRS.areia,
        marketPrice: marketPricesRS.areia,
        icon: Truck,
        color: 'bg-gradient-to-r from-yellow-600 to-amber-700' 
      },
      {
        id: 'cimento',
        material: 'Cimento (saco 50kg)',
        quantity: cimentoSacos,
        unit: 'sacos',
        price: customPrices.cimento || marketPricesRS.cimento,
        marketPrice: marketPricesRS.cimento,
        icon: Hammer,
        color: 'bg-gradient-to-r from-neutral-500 to-neutral-700'
      }
    ];

    setMaterials(calculatedMaterials);
    setArea(areaValue);
  };

  const handlePriceChange = (materialId, newPrice) => {
    const updatedPrices = { ...customPrices, [materialId]: newPrice };
    setCustomPrices(updatedPrices);
    
    setMaterials(prevMaterials =>
      prevMaterials.map(material =>
        material.id === materialId
          ? { ...material, price: newPrice }
          : material
      )
    );
  };

  const constructionIcons = [Home, Building, HardHat];
  const RandomIcon = constructionIcons[Math.floor(Math.random() * constructionIcons.length)];


  return (
    <div className="min-h-screen construction-theme-bg">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-4">
            <RandomIcon className="h-12 w-12 text-amber-400 mr-3" />
            <h1 className="text-5xl font-extrabold text-white tracking-tight">
              CalcuMat <span className="text-amber-400">Calculadora de Materiais</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Planeje sua construção com precisão! Calcule brita, areia, cimento e tenha seu orçamento detalhado na hora. Preços de mercado estimados para RS.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CalculatorForm onCalculate={calculateMaterials} />
            
            {materials.length > 0 && (
              <div className="mt-8">
                <BudgetSummary materials={materials} area={area} />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {materials.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Materiais Necessários
                  </h2>
                  <p className="text-gray-300">
                    Para {area}m² de área construída (aprox. { (area * parseFloat(materials.find(m=>m.id==='brita')?.quantity > 0 ? (materials.find(m=>m.id==='brita').quantity / (area * 0.83) ) : 0.1)).toFixed(2) }m³ de concreto)
                  </p>
                </div>

                <div className="grid gap-6">
                  {materials.map((material, index) => (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <MaterialCard
                        {...material}
                        onPriceChange={(newPrice) => handlePriceChange(material.id, newPrice)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 rounded-xl glass-effect-dark"
              >
                <img  alt="Desenho de ferramentas de construção" class="w-32 h-32 mb-6 opacity-80" src="https://images.unsplash.com/photo-1682542685575-4ae90a5baf07" />
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Pronto para Construir?
                </h3>
                <p className="text-gray-300 text-lg text-center max-w-md">
                  Insira a área e espessura da sua laje ou piso para calcular os materiais e o orçamento da sua obra.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="glass-effect-dark rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              📝 Informações Importantes
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-gray-300 text-sm">
              <div>
                <strong>Traço Estimado:</strong> Baseado em concreto comum (ex: C20).
                <br />Quantidades podem variar com traço específico.
              </div>
              <div>
                <strong>Valores de Mercado (RS):</strong> Preços médios estimados para Rio Grande do Sul.
                <br />Podem variar conforme sua cidade/fornecedor.
              </div>
              <div>
                <strong>Não Esqueça:</strong> Adicione ~10-15% de margem.
                <br />Para perdas e ajustes na obra.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;