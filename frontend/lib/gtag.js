export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Sayfa görüntüleme eventi (SPA route değişimlerinde manuel çağrılır)
export const pageview = (url) => {
  if (!GA_TRACKING_ID || typeof window === "undefined") return;
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// Özel event gönderme (CV analizi, buton tıklamaları vb.)
export const event = (action, params = {}) => {
  if (!GA_TRACKING_ID || typeof window === "undefined") return;
  window.gtag("event", action, params);
};
