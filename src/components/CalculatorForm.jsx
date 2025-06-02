import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { HardHat, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const CalculatorForm = ({ onCalculate }) => {
  const [area, setArea] = useState('');
  const [thickness, setThickness] = useState('0.10');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const areaValue = parseFloat(area);
    const thicknessValue = parseFloat(thickness);
    
    if (!areaValue || areaValue <= 0) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, insira uma área válida maior que zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (!thicknessValue || thicknessValue <= 0) {
      toast({
        title: "Erro de Validação", 
        description: "Por favor, insira uma espessura válida maior que zero.",
        variant: "destructive"
      });
      return;
    }

    onCalculate(areaValue, thicknessValue);
    
    toast({
      title: "Cálculo Concluído!",
      description: `Materiais calculados para ${areaValue}m² com ${thicknessValue}m de espessura.`,
      className: "bg-green-600 border-green-700 text-white"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect-dark border-amber-500/30 backdrop-blur-xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-amber-500/50">
            <HardHat className="h-8 w-8 text-amber-400" />
          </div>
          <CardTitle className="text-2xl text-white font-semibold">Dados da Obra</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="area" className="text-gray-300 font-medium">
                Área da Laje/Piso (m²)
              </Label>
              <Input
                id="area"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Ex: 50"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:bg-slate-700 focus:border-amber-500"
                step="0.01"
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thickness" className="text-gray-300 font-medium">
                Espessura (metros)
              </Label>
              <Input
                id="thickness"
                type="number"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="Ex: 0.10 (10cm)"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:bg-slate-700 focus:border-amber-500"
                step="0.01"
                min="0"
              />
            </div>
            
            <Button 
              type="submit" 
              className="btn-calculate"
            >
              <Zap className="mr-2 h-5 w-5" />
              Calcular Materiais
            </Button>
          </form>
          
          <div className="text-center text-gray-400 text-sm">
            <p>💡 Dica: A espessura comum para lajes residenciais é 0.10m (10cm).</p>
            <p>Para contrapisos, pode variar entre 0.03m a 0.05m.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CalculatorForm;