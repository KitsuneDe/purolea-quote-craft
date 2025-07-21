import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Download, Sparkles, Beaker, Package, Tag, Factory, MessageCircle, DollarSign, ChevronDown } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  baseFormulaCost: number
  suggestedSize: number
  icon: string
}

interface QuoteData {
  selectedProduct: string
  formulaCost: number
  productSize: number
  packagingCost: number
  labelCost: number
  manufacturingFee: number
  quantity: number
  isClientPackaging: boolean
  isClientLabel: boolean
  notes: string
}

interface CostBreakdown {
  formulaCostPerUnit: number
  packagingCostPerUnit: number
  labelCostPerUnit: number
  manufacturingFeePerUnit: number
  totalUnitCost: number
  totalProjectCost: number
}

const QuoteCalculator = () => {
  const [products] = useState<Product[]>([
    { id: 'serum', name: 'Vitamin C Serum', category: 'Skincare', baseFormulaCost: 15.50, suggestedSize: 1, icon: '✨' },
    { id: 'moisturizer', name: 'Hydrating Moisturizer', category: 'Skincare', baseFormulaCost: 12.50, suggestedSize: 2, icon: '💧' },
    { id: 'cleanser', name: 'Gentle Face Cleanser', category: 'Skincare', baseFormulaCost: 8.75, suggestedSize: 4, icon: '🧼' },
    { id: 'toner', name: 'Balancing Toner', category: 'Skincare', baseFormulaCost: 10.25, suggestedSize: 3, icon: '🌿' },
    { id: 'mask', name: 'Clay Face Mask', category: 'Treatment', baseFormulaCost: 18.00, suggestedSize: 2, icon: '🎭' },
    { id: 'oil', name: 'Facial Oil Blend', category: 'Treatment', baseFormulaCost: 22.50, suggestedSize: 1, icon: '🌸' },
    { id: 'cream', name: 'Anti-Aging Cream', category: 'Skincare', baseFormulaCost: 25.00, suggestedSize: 2, icon: '⭐' },
    { id: 'lotion', name: 'Body Lotion', category: 'Body Care', baseFormulaCost: 6.50, suggestedSize: 8, icon: '🧴' },
    { id: 'custom', name: 'Custom Formula', category: 'Custom', baseFormulaCost: 12.50, suggestedSize: 2, icon: '🔬' }
  ])

  const [quoteData, setQuoteData] = useState<QuoteData>({
    selectedProduct: '',
    formulaCost: 12.50,
    productSize: 2,
    packagingCost: 3.50,
    labelCost: 0.75,
    manufacturingFee: 4.00,
    quantity: 100,
    isClientPackaging: false,
    isClientLabel: false,
    notes: ""
  })

  const [costs, setCosts] = useState<CostBreakdown>({
    formulaCostPerUnit: 0,
    packagingCostPerUnit: 0,
    labelCostPerUnit: 0,
    manufacturingFeePerUnit: 0,
    totalUnitCost: 0,
    totalProjectCost: 0
  })

  // Manufacturing fee tiers based on quantity
  const getManufacturingFee = (quantity: number): number => {
    if (quantity >= 1000) return 2.50
    if (quantity >= 500) return 3.00
    return 4.00
  }

  // Label cost tiers based on quantity
  const getLabelCost = (quantity: number): number => {
    if (quantity >= 1000) return 0.50
    if (quantity >= 500) return 0.65
    return 0.75
  }

  // Recalculate costs whenever inputs change
  useEffect(() => {
    const formulaCostPerUnit = quoteData.formulaCost * quoteData.productSize
    const packagingCostPerUnit = quoteData.isClientPackaging ? 0 : quoteData.packagingCost
    const labelCostPerUnit = quoteData.isClientLabel ? 0 : getLabelCost(quoteData.quantity)
    const manufacturingFeePerUnit = getManufacturingFee(quoteData.quantity)
    
    const totalUnitCost = formulaCostPerUnit + packagingCostPerUnit + labelCostPerUnit + manufacturingFeePerUnit
    const totalProjectCost = totalUnitCost * quoteData.quantity

    setCosts({
      formulaCostPerUnit,
      packagingCostPerUnit,
      labelCostPerUnit,
      manufacturingFeePerUnit,
      totalUnitCost,
      totalProjectCost
    })
  }, [quoteData])

  const updateQuoteData = (field: keyof QuoteData, value: any) => {
    setQuoteData(prev => ({ ...prev, [field]: value }))
  }

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setQuoteData(prev => ({
        ...prev,
        selectedProduct: productId,
        formulaCost: product.baseFormulaCost,
        productSize: product.suggestedSize
      }))
    }
  }

  const generatePDF = () => {
    // Simple print-friendly version
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purolea Quote - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .total { font-weight: bold; background-color: #f0f0f0; }
            .notes { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ccc; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Purolea Production Quote</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h3>Product Specifications</h3>
            <p><strong>Formula Cost:</strong> $${quoteData.formulaCost.toFixed(2)} per oz</p>
            <p><strong>Product Size:</strong> ${quoteData.productSize} oz</p>
            <p><strong>Production Quantity:</strong> ${quoteData.quantity} units</p>
            <p><strong>Packaging:</strong> ${quoteData.isClientPackaging ? 'Client Provided' : '$' + quoteData.packagingCost.toFixed(2) + ' per unit'}</p>
            <p><strong>Labels:</strong> ${quoteData.isClientLabel ? 'Client Provided' : '$' + costs.labelCostPerUnit.toFixed(2) + ' per unit'}</p>
          </div>

          <table>
            <tr><th>Cost Component</th><th>Per Unit</th><th>Total (${quoteData.quantity} units)</th></tr>
            <tr><td>🧪 Formula Cost</td><td>$${costs.formulaCostPerUnit.toFixed(2)}</td><td>$${(costs.formulaCostPerUnit * quoteData.quantity).toFixed(2)}</td></tr>
            <tr><td>📦 Packaging</td><td>$${costs.packagingCostPerUnit.toFixed(2)}</td><td>$${(costs.packagingCostPerUnit * quoteData.quantity).toFixed(2)}</td></tr>
            <tr><td>🏷️ Label Printing</td><td>$${costs.labelCostPerUnit.toFixed(2)}</td><td>$${(costs.labelCostPerUnit * quoteData.quantity).toFixed(2)}</td></tr>
            <tr><td>🏭 Manufacturing</td><td>$${costs.manufacturingFeePerUnit.toFixed(2)}</td><td>$${(costs.manufacturingFeePerUnit * quoteData.quantity).toFixed(2)}</td></tr>
            <tr class="total"><td><strong>Total</strong></td><td><strong>$${costs.totalUnitCost.toFixed(2)}</strong></td><td><strong>$${costs.totalProjectCost.toFixed(2)}</strong></td></tr>
          </table>

          ${quoteData.notes ? `<div class="notes"><h4>Notes:</h4><p>${quoteData.notes}</p></div>` : ''}
          
          <div class="section">
            <p><small>Lead time: 3–4 weeks from order confirmation</small></p>
          </div>
        </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 100)
  }

  return (
    <div className="min-h-screen bg-gradient-soft font-elegant">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Purolea Quote Calculator</h1>
              <p className="text-muted-foreground">Professional cosmetic production cost estimator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Selection */}
            <Card className="shadow-soft border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Beaker className="h-5 w-5" />
                  Product Selection
                </CardTitle>
                <CardDescription>Choose from our product catalog or create a custom formula</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="product">Select Product Type</Label>
                  <Select value={quoteData.selectedProduct} onValueChange={handleProductSelect}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a product or custom formula..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{product.icon}</span>
                            <div className="flex flex-col">
                              <span className="font-medium">{product.name}</span>
                              <span className="text-xs text-muted-foreground">{product.category} • ${product.baseFormulaCost}/oz</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="formulaCost">Formula Cost (per oz)</Label>
                    <Input
                      id="formulaCost"
                      type="number"
                      step="0.01"
                      value={quoteData.formulaCost}
                      onChange={(e) => updateQuoteData('formulaCost', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productSize">Product Size (oz)</Label>
                    <Input
                      id="productSize"
                      type="number"
                      step="0.1"
                      value={quoteData.productSize}
                      onChange={(e) => updateQuoteData('productSize', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Packaging Section */}
            <Card className="shadow-soft border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Packaging Options
                </CardTitle>
                <CardDescription>Container and packaging specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Client Provides Packaging</Label>
                    <p className="text-sm text-muted-foreground">Toggle if client supplies their own containers</p>
                  </div>
                  <Switch
                    checked={quoteData.isClientPackaging}
                    onCheckedChange={(checked) => updateQuoteData('isClientPackaging', checked)}
                  />
                </div>
                {!quoteData.isClientPackaging && (
                  <div>
                    <Label htmlFor="packagingCost">Packaging Cost (per unit)</Label>
                    <Input
                      id="packagingCost"
                      type="number"
                      step="0.01"
                      value={quoteData.packagingCost}
                      onChange={(e) => updateQuoteData('packagingCost', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Label Section */}
            <Card className="shadow-soft border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="h-5 w-5" />
                  Label Printing
                </CardTitle>
                <CardDescription>Label design and printing costs (quantity-based pricing)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Client Provides Labels</Label>
                    <p className="text-sm text-muted-foreground">Toggle if client supplies pre-printed labels</p>
                  </div>
                  <Switch
                    checked={quoteData.isClientLabel}
                    onCheckedChange={(checked) => updateQuoteData('isClientLabel', checked)}
                  />
                </div>
                {!quoteData.isClientLabel && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium">Quantity-Based Pricing:</p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• 100-499 units: $0.75 per label</li>
                      <li>• 500-999 units: $0.65 per label</li>
                      <li>• 1000+ units: $0.50 per label</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manufacturing Section */}
            <Card className="shadow-soft border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Factory className="h-5 w-5" />
                  Manufacturing & Quantity
                </CardTitle>
                <CardDescription>Production volume and associated fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Production Quantity</Label>
                  <Select value={quoteData.quantity.toString()} onValueChange={(value) => updateQuoteData('quantity', parseInt(value))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 units</SelectItem>
                      <SelectItem value="250">250 units</SelectItem>
                      <SelectItem value="500">500 units</SelectItem>
                      <SelectItem value="750">750 units</SelectItem>
                      <SelectItem value="1000">1000 units</SelectItem>
                      <SelectItem value="1500">1500 units</SelectItem>
                      <SelectItem value="2000">2000 units</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">Manufacturing Fee Structure:</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• 100-499 units: $4.00 per unit</li>
                    <li>• 500-999 units: $3.00 per unit</li>
                    <li>• 1000+ units: $2.50 per unit</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card className="shadow-soft border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5" />
                  Additional Notes
                </CardTitle>
                <CardDescription>Special requirements or reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any special requirements, lead time notes, or client-specific details..."
                  value={quoteData.notes}
                  onChange={(e) => updateQuoteData('notes', e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Cost Summary - Sticky on Desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-elegant border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost Summary
                  </CardTitle>
                  <CardDescription>Real-time pricing breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Beaker className="h-3 w-3" /> Formula
                      </span>
                      <span className="font-medium">${costs.formulaCostPerUnit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Package className="h-3 w-3" /> Packaging
                      </span>
                      <span className="font-medium">${costs.packagingCostPerUnit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3" /> Labels
                      </span>
                      <span className="font-medium">${costs.labelCostPerUnit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Factory className="h-3 w-3" /> Manufacturing
                      </span>
                      <span className="font-medium">${costs.manufacturingFeePerUnit.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Cost per Unit</span>
                      <span className="text-primary">${costs.totalUnitCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>× {quoteData.quantity} units</span>
                      <span></span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold bg-primary-soft p-3 rounded-lg">
                      <span>Total Project</span>
                      <span className="text-primary">${costs.totalProjectCost.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button 
                      onClick={generatePDF} 
                      variant="elegant" 
                      className="w-full"
                      size="lg"
                    >
                      <Download className="h-4 w-4" />
                      Export Quote PDF
                    </Button>
                    
                    <div className="text-xs text-muted-foreground text-center space-y-1">
                      <p>🕒 Lead time: 3–4 weeks</p>
                      <p>📋 Quote valid for 30 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuoteCalculator