import React, { useState } from 'react';
import { useCreateProduce, ProduceInputCrop } from '@workspace/api-client-react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Sprout } from 'lucide-react';
import { CROP_LABELS } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function NewListing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const createProduce = useCreateProduce();
  
  const [formData, setFormData] = useState({
    crop: 'tomatoes' as ProduceInputCrop,
    quantityKg: '',
    pricePerKg: '',
    region: user?.region || 'Eastern Region',
    community: '',
    harvestDate: new Date().toISOString().split('T')[0],
    isPreHarvest: false,
    pickupPoint: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.quantityKg || !formData.pricePerKg) {
      toast({ title: "Required Fields", description: "Please enter quantity and price.", variant: "destructive" });
      return;
    }

    createProduce.mutate({
      data: {
        ...formData,
        quantityKg: Number(formData.quantityKg),
        pricePerKg: Number(formData.pricePerKg),
        depositRequired: formData.isPreHarvest ? 30 : 0
      }
    }, {
      onSuccess: () => {
        toast({ title: "Success!", description: "Your produce has been listed on the market." });
        setLocation('/farmer/listings');
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [id]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <div className="flex-1 bg-muted/30 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/farmer/listings" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6 font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
        </Link>
        
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-2xl font-serif flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" /> List New Harvest
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="crop">Crop Type</Label>
                  <Select 
                    value={formData.crop} 
                    onValueChange={(val: any) => setFormData(prev => ({ ...prev, crop: val }))}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CROP_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date</Label>
                  <Input 
                    id="harvestDate" 
                    type="date" 
                    value={formData.harvestDate}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantityKg">Total Quantity (kg)</Label>
                  <Input 
                    id="quantityKg" 
                    type="number" 
                    min="1"
                    placeholder="e.g. 500" 
                    value={formData.quantityKg}
                    onChange={handleChange}
                    className="h-12 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pricePerKg">Price per kg (₵)</Label>
                  <Input 
                    id="pricePerKg" 
                    type="number" 
                    min="0.1"
                    step="0.1"
                    placeholder="e.g. 15.50" 
                    value={formData.pricePerKg}
                    onChange={handleChange}
                    className="h-12 text-lg"
                  />
                </div>
              </div>

              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 flex gap-4 items-start">
                <div className="mt-1">
                  <input 
                    type="checkbox" 
                    id="isPreHarvest" 
                    checked={formData.isPreHarvest}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-gray-300 text-secondary focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="isPreHarvest" className="text-base font-bold text-secondary-foreground cursor-pointer">List as Pre-Harvest</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Allow buyers to secure this crop with a 30% MoMo Escrow deposit before it's harvested.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-serif font-bold text-lg">Location Details</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Input 
                      id="region" 
                      value={formData.region}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="community">Community / Town</Label>
                    <Input 
                      id="community" 
                      placeholder="e.g. Suhum"
                      value={formData.community}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupPoint">Specific Pickup Point (Optional)</Label>
                  <Input 
                    id="pickupPoint" 
                    placeholder="e.g. Behind the main market, Stall 4"
                    value={formData.pickupPoint}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
              </div>

            </CardContent>
            <div className="p-6 bg-muted/10 border-t flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setLocation('/farmer/listings')}>
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={createProduce.isPending}>
                {createProduce.isPending ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
