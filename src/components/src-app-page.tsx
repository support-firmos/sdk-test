'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Info, MousePointerClick } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


// Add these new types
type SessionData = {
  client?: {
    givenName: string;
    familyName: string;
  };
  company?: {
    name: string;
  };
};


// export function BlockPage() {
export function BlockPage({ sessionData }: { sessionData: SessionData }) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [loadingText, setLoadingText] = useState("Getting things ready...")
  const [error, setError] = useState<string | null>(null)

  const LOADING_DELAY = 7000; // 7 seconds
  const loadingMessages = [
    "Getting things ready...",
    "Calculating totals...",
    "Almost there!"
  ]

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
      heading: 'FIRMOS GROWTH PLATFORM',
      subtitle: 'Core Focus',
      description: '(1 Pillar)',
      fullDescription: 'Focus on one core area of your firm\'s operations. Whether you\'re looking to enhance lead generation, streamline talent management, improve client delivery, or optimize financial processes, FirmOS provides a tailored solution for your chosen pillar.',
      price: 2450,
      savings: null
    },
    {
      id: 'accelerator',
      title: 'FirmOS Business Accelerator (2 Pillars) - $3,450 (30% Savings)',
      heading: 'FIRMOS BUSINESS ACCELERATOR',
      subtitle: 'Dual Focus',
      description: '(2 Pillars)',
      fullDescription: 'Optimize two critical aspects of your firm\'s operations. Choose the combination that fits your current needs—whether it\'s increasing client acquisition and improving internal efficiency, or enhancing financial control and client fulfillment.',
      price: 3450,
      savings: 30
    },
    {
      id: 'mastery',
      title: 'FirmOS Operations Mastery (3 Pillars) - $4,450 (40% Savings)',
      heading: 'FIRMOS OPERATIONS MASTERY',
      subtitle: 'Complete Solution',
      description: '(3 Pillars)',
      fullDescription: 'Full operational support across Business Development, Talent, Fulfillment, and Finance. FirmOS equips you with a complete solution to manage and scale your firm efficiently, ensuring alignment across all key functions.',
      price: 4450,
      savings: 40
    },
    {
      id: 'consulting',
      title: 'FirmOS Consulting Subscription - $750/month',
      heading: 'FIRMOS CONSULTING',
      subtitle: 'BI-WEEKLY STRATEGY',
      description: 'SESSIONS',
      fullDescription: 'Designed for firms needing structured support, this plan offers two 60-minute sessions monthly with tailored advice, templates, and actionable steps to improve operations, optimize financial strategies, or enhance team performance.',
      price: 750,
      isMonthly: true,
      savings: null
    }
  ]

  const handleSelectPackage = async () => { 
    // Check if a product is selected
    if (!selectedProduct) {
        setError("Please select a package first");
        return;
    }

    setIsLoading(true);
    setError(null);
    let currentMessage = 0;
    setLoadingText(loadingMessages[currentMessage]);

    // Get the selected product details
    const selectedProductDetails = products.find(p => p.id === selectedProduct);
    if (!selectedProductDetails) {
        setError("Selected product not found");
        setIsLoading(false);
        return;
    }

     // Construct the client name
    const clientName = sessionData.client 
      ? `${sessionData.client.givenName} ${sessionData.client.familyName}`
      : sessionData.company?.name || "Unknown Client";
      
    // const clientName = "Earyl Buque";

    // Single encode the parameters with proper space and bracket handling
const encodeParam = (str: string) => {
  return str.split('').map(char => {
    switch(char) {
      case ' ': return '%20';
      case '[': return '%5B';
      case ']': return '%5D';
      case '(': return '%28';
      case ',': return '%2C';
      case ')': return '%29';
      case '%': return '%25';
      default: return char;
    }
  }).join('');
};

    const url = `/generate-invoice?client_name=${encodeParam(clientName)}&product_name=${encodeParam(selectedProductDetails.title)}`;

    console.group('📡 Invoice Generation Request');
    console.log('🏷️ Selected Product:', selectedProductDetails);
    console.log('👤 Client Name:', clientName);
    console.log('🔗 Full URL:', url);
    console.groupEnd();

    try {
        console.time('Invoice Generation Duration');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json'
            },
            body: ''
        });

        console.timeEnd('Invoice Generation Duration');

        const data = await response.json();

        console.group('📥 Invoice Generation Response');
        console.log('📊 Status:', response.status);
        console.log('📄 Response Data:', data);
        console.groupEnd();

        if (!response.ok) {
            throw new Error(`API error: ${response.status} - ${JSON.stringify(data)}`);
        }

        // Process loading messages
        const interval = setInterval(() => {
            currentMessage++;
            if (currentMessage < loadingMessages.length) {
                setLoadingText(loadingMessages[currentMessage]);
            }
            if (currentMessage >= loadingMessages.length) {
                clearInterval(interval);
                setIsLoading(false);
                setShowSuccessModal(true);
            }
        }, LOADING_DELAY / loadingMessages.length);

    } catch (err) {
        console.group('❌ Invoice Generation Error');
        console.error('Error Details:', err);
        console.trace('Error Stack Trace:');
        console.groupEnd();

        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
    }
};


  const handleInvoiceClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setShowSuccessModal(false)
  }

  useEffect(() => {
    document.title = 'Product Selection'
  }, [])

  // Sample Implementation
  // const invoiceurl = `https://app.firmos.ai/invoices/pay?invoiceId=${encodeParam(clientName)}&product_name=${encodeParam(selectedProductDetails.title)}`;

  return (
    <div className="min-h-screen bg-[#121212] p-6 relative">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {error}
        </div>
      )}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          >
            <div className="text-white text-center relative w-80 h-80">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 border-4 border-blue-500 rounded-full"
              />
              
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-4 border-4 border-white rounded-full"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    y: [0, -24, -12, -36, -18, -30, 0],
                  }}
                  transition={{
                    duration: 7,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-24 h-6 bg-white rounded-sm"
                />
                <motion.div
                  animate={{
                    y: [0, -18, -36, -24, -12, -30, 0],
                  }}
                  transition={{
                    duration: 7,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-24 h-6 bg-black rounded-sm border-2 border-white"
                />
                <motion.div
                  animate={{
                    y: [0, -36, -24, -12, -30, -18, 0],
                  }}
                  transition={{
                    duration: 7,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-24 h-6 bg-white rounded-sm"
                />
              </div>

              <motion.div 
                className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-full"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <p className="text-2xl font-bold whitespace-nowrap bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                  {loadingText}
                </p>
              </motion.div>
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
              className="relative h-full"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.03 }}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
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
                  transition-all duration-300 ease-in-out flex flex-col
                  ${(hoveredProduct === product.id || selectedProduct === product.id) ? 'shadow-lg shadow-blue-500/20 border-blue-500/50' : ''}
                `}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => setSelectedProduct(product.id === selectedProduct ? null : product.id)}
              >
                <CardHeader className="relative">
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {product.heading}
                  </CardTitle>
                  <CardDescription>
                    <div className="text-blue-400 font-medium">{product.subtitle}</div>
                    <div className="text-gray-400">{product.description}</div>
                  </CardDescription>
                  {selectedProduct === product.id && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                      Selected
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="text-3xl font-bold text-white mb-6">
                    ${product.price.toLocaleString()}
                    {product.isMonthly && <span className="text-lg text-gray-400">/month</span>}
                  </div>

                  <div className="space-y-2 mb-6">
                    {features[product.id as keyof typeof features].map((feature, index) => (
                      <div key={index} className="flex items-start text-gray-300 text-sm">
                        <Check className="mr-2 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
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

                <CardFooter className="mt-auto">
                  {selectedProduct === product.id && (
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectPackage()
                      }}
                    >
                      Select Package
                    </Button>
                  )}
                </CardFooter>
              </Card>
              <AnimatePresence>
                {hoveredProduct === product.id && selectedProduct !== product.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg"
                    style={{ zIndex: 10 }}
                  >
                    <div className="text-sm font-semibold">Click to Choose</div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-blue-600 rotate-45"></div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                            // Sample Implementation
                // href={invoiceurl}
                //href='https://app.firmos.ai/invoices/pay?invoiceId='
                href="https://app.firmos.ai/invoices"
                className="text-blue-500 hover:text-blue-600 transition-colors"
                onClick={handleInvoiceClick}
                target="_blank"
                rel="noopener noreferrer"
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