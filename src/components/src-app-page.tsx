'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Info, Loader2 } from 'lucide-react'
import { generateInvoice } from "@/utils/invoice_api"
import { invoicelist } from "@/utils/invoice_query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function BlockPage() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [clientName, setClientName] = useState<string>('')
  const [showNameInput, setShowNameInput] = useState<string | null>(null)

  const LOADING_DELAY = 5000; // in milliseconds

  const features = {
    'growth': [
      "1 firm's core operation",
      "Custom AI Workflow Automations",
      "Dedicated Support",
      "Basic Analytics"
    ],
    'accelerator': [
      "2 firm's core operations",
      "Custom AI Workflow Automations",
      "Dedicated Support",
      "Advance Analytics"
    ],
    'mastery': [
      "Complete firm's core operations",
      "Custom AI Workflow Automations",
      "Dedicated Support",
      "Advance Analytics",
      "AI-Driven Insights and Recommendations"
    ],
    'consulting': [
      "Structured Operational Guidance",
      "Actionable Financial Strategy Support"
    ]
  };

  const products = [
    {
      id: 'growth',
      title: '[TEST] Product',
      subtitle: 'Core Focus',
      description: '(1 Pillar)',
      fullDescription: 'Focus on one core area of your firm\'s operations. Whether you\'re looking to enhance lead generation, streamline talent management, improve client delivery, or optimize financial processes, FirmOS provides a tailored solution for your chosen pillar.',
      price: 2450,
      savings: null
    },
    {
      id: 'accelerator',
      title: 'FIRMOS BUSINESS ACCELERATOR',
      subtitle: 'Dual Focus',
      description: '(2 Pillars)',
      fullDescription: 'Optimize two critical aspects of your firm\'s operations. Choose the combination that fits your current needs—whether it\'s increasing client acquisition and improving internal efficiency, or enhancing financial control and client fulfillment.',
      price: 3450,
      savings: 30
    },
    {
      id: 'mastery',
      title: 'FIRMOS OPERATIONS MASTERY',
      subtitle: 'Complete Solution',
      description: '(3 Pillars)',
      fullDescription: 'Full operational support across Business Development, Talent, Fulfillment, and Finance. FirmOS equips you with a complete solution to manage and scale your firm efficiently, ensuring alignment across all key functions.',
      price: 4950,
      savings: 50
    },
    {
      id: 'consulting',
      title: 'FIRMOS CONSULTING',
      subtitle: 'BI-WEEKLY STRATEGY',
      description: 'SESSIONS',
      fullDescription: 'Designed for firms needing structured support, this plan offers two 60-minute sessions monthly with tailored advice, templates, and actionable steps to improve operations, optimize financial strategies, or enhance team performance.',
      price: 750,
      isMonthly: true,
      savings: null
    }
  ]

  const handleSelectPackage = (productId: string) => {
    setShowNameInput(productId)
  }

  const client_name = "Earyl Buque"
  const product_name = "[TEST] Product"

  const handleProceedToPayment = async () => {
    try {
      if (!clientName.trim()) {
        console.error('Client name is required');
        return;
      }
  
      setIsLoading(true);
      console.log("Generating Invoice");
      
      const selectedProductDetails = products.find(p => p.id === showNameInput);
      if (!selectedProductDetails) {
        throw new Error('No product selected');
      }
  
      console.log('Request parameters:', {
        client_name: clientName,
        product_name: selectedProductDetails.title
      });
  
      const invoiceAPIresponse = await generateInvoice(
        clientName.trim(),
        selectedProductDetails.title
      );
  
      console.log('API Response:', invoiceAPIresponse);
  
      await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
      
      setIsLoading(false);
      setShowSuccessModal(true);
  
    } catch (error) {
      console.error("Error generating invoice:", error);
      setIsLoading(false);
      // Maybe show an error message to the user
      // setErrorMessage(error instanceof Error ? error.message : 'Failed to generate invoice');
    }
  };

  const handleInvoiceClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setShowSuccessModal(false)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.open('https://app.firmos.ai/invoices/pay?invoiceId=in_1QKQnXFdviIHOKAnvxdLH7g5', '_blank', 'noopener,noreferrer');
    }, LOADING_DELAY)
  }

  return (
    <div className="min-h-screen bg-[#121212] p-6 relative">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          >
            <div className="text-white text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <p className="text-xl font-semibold">Processing your selected package</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Select Your Package
          </h1>
          <p className="text-gray-400">
            Choose the perfect FirmOS solution for your accounting firm
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.03 }}
              className="relative"
            >
              {product.savings && (
                <Badge 
                  className="absolute -top-3 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full"
                >
                  {product.savings}% SAVINGS
                </Badge>
              )}
              <Card
                className={`
                  relative h-full bg-black border-gray-800 overflow-hidden
                  transition-all duration-300 ease-in-out
                  ${(hoveredProduct === product.id || selectedProduct === product.id) ? 'shadow-lg shadow-blue-500/20 border-blue-500/50' : ''}
                `}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => setSelectedProduct(product.id === selectedProduct ? null : product.id)}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {product.title}
                  </CardTitle>
                  <CardDescription>
                    <div className="text-blue-400 font-medium">{product.subtitle}</div>
                    <div className="text-gray-400">{product.description}</div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-6">
                    ${product.price.toLocaleString()}
                    {product.isMonthly && <span className="text-lg text-gray-400">/month</span>}
                  </div>

                  <div className="space-y-2 mb-6">
                    {features[product.id as keyof typeof features].map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300 text-sm">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {(hoveredProduct === product.id || selectedProduct === product.id) && (
                      <motion.div 
                        className="mb-6 text-sm text-gray-400"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Info className="inline-block mr-2 text-blue-400" size={16} />
                        {product.fullDescription}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>

                <CardFooter>
                  {showNameInput === product.id ? (
                    <div className="w-full space-y-4">
                      <Input
                        type="text"
                        placeholder="Enter your name to confirm the purchase"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="bg-gray-800 text-white border-gray-700"
                      />
                      {clientName && (
                        <Button 
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                          onClick={handleProceedToPayment}
                        >
                          Proceed to Payment
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectPackage(product.id)
                      }}
                    >
                      Select Package
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Visit <span className="text-blue-400">www.firmos.ai</span> for more information
          <br />
          Custom AI Workflow Automations for Accounting Firms
        </footer>

        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Success!</DialogTitle>
              <DialogDescription>
                Your invoice is ready. Click the link below to view it.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <a
                href="https://app.firmos.ai/invoices/pay?invoiceId=in_1QKQnXFdviIHOKAnvxdLH7g5"
                className="text-blue-500 hover:text-blue-600 transition-colors"
                onClick={handleInvoiceClick}
              >
                Click here to go to the invoice
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}