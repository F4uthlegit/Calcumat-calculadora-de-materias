import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit3, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const MaterialCard = ({ 
  material, 
  quantity, 
  unit, 
  price, 
  marketPrice, 
  onPriceChange, 
  icon: Icon,
  color 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrice, setTempPrice] = useState(price);

  const handleSave = () => {
    onPriceChange(parseFloat(tempPrice) || 0);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempPrice(price);
    setIsEditing(false);
  };

  const total = quantity * price;
  const marketTotal = quantity * marketPrice;
  const savings = marketTotal - total;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="material-card border-slate-700 overflow-hidden shadow-lg">
        <CardHeader className={`${color} text-white relative py-4 px-6`}>
          <div className="construction-pattern absolute inset-0 opacity-10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="h-7 w-7" />
              <CardTitle className="text-lg font-semibold">{material}</CardTitle>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{quantity.toFixed(2)}</div>
              <div className="text-xs opacity-80">{unit}</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4 bg-slate-800 text-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-400">SEU PREÇO / UNIDADE</Label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    className="price-input h-8 text-sm"
                    step="0.01"
                  />
                  <Button size="sm" onClick={handleSave} className="btn-save-price">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} className="btn-cancel-price">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-green-400">
                    R$ {price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="btn-edit-price"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-400">PREÇO MÉDIO MERCADO / UNIDADE</Label>
              <span className="text-base font-semibold text-orange-400">
                R$ {marketPrice.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">Subtotal (Seu Preço):</span>
              <span className="text-lg font-bold text-green-400">
                R$ {total.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">Subtotal (Mercado):</span>
              <span className="text-base font-semibold text-orange-400">
                R$ {marketTotal.toFixed(2)}
              </span>
            </div>
            
            {savings !== 0 && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`flex justify-between items-center p-2.5 rounded-md ${
                  savings > 0 
                    ? 'bg-green-600/20 border border-green-500/30' 
                    : 'bg-red-600/20 border border-red-500/30'
                }`}
              >
                <span className="font-medium text-sm">
                  {savings > 0 ? 'Economia neste item:' : 'Custo adicional:'}
                </span>
                <span className={`text-base font-bold ${
                  savings > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {savings > 0 ? '-' : '+'}R$ {Math.abs(savings).toFixed(2)}
                </span>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MaterialCard;