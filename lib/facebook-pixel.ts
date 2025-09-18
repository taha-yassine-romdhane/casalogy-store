// Facebook Pixel utility functions
type FacebookPixelFunction = (
  action: 'init' | 'track' | 'trackCustom',
  eventNameOrPixelId: string,
  parameters?: Record<string, any>
) => void;

declare global {
  interface Window {
    fbq: FacebookPixelFunction;
  }
}

export const FB_PIXEL_ID = '4253006848354926';

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('init', FB_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
};

// Track page view
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track add to cart event
export const trackAddToCart = (productData: {
  name: string;
  category?: string;
  id: string;
  price: number;
  currency?: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: productData.name,
      content_category: productData.category || '',
      content_ids: [productData.id],
      content_type: 'product',
      value: productData.price,
      currency: productData.currency || 'TND'
    });
  }
};

// Track purchase event
export const trackPurchase = (orderData: {
  orderId: string;
  value: number;
  currency?: string;
  items: Array<{
    id: string;
    name: string;
    category?: string;
    quantity: number;
    price: number;
  }>;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: orderData.value,
      currency: orderData.currency || 'TND',
      content_ids: orderData.items.map(item => item.id),
      content_type: 'product',
      contents: orderData.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price
      }))
    });
  }
};

// Track view content event
export const trackViewContent = (productData: {
  name: string;
  category?: string;
  id: string;
  price: number;
  currency?: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: productData.name,
      content_category: productData.category || '',
      content_ids: [productData.id],
      content_type: 'product',
      value: productData.price,
      currency: productData.currency || 'TND'
    });
  }
};

// Track initiate checkout event
export const trackInitiateCheckout = (cartData: {
  value: number;
  currency?: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: cartData.value,
      currency: cartData.currency || 'TND',
      content_ids: cartData.items.map(item => item.id),
      content_type: 'product',
      contents: cartData.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price
      }))
    });
  }
};

// Track search event
export const trackSearch = (searchTerm: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Search', {
      search_string: searchTerm
    });
  }
};

// Track lead event (for contact forms, newsletter signups, etc.)
export const trackLead = (leadData?: {
  content_name?: string;
  value?: number;
  currency?: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', leadData || {});
  }
};