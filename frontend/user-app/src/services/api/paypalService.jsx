const API_BASE_URL = import.meta.env.VITE_API_URL

export const createPayPalOrder = async () => {
  const response = await fetch(`${API_BASE_URL}/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const capturePayPalOrder = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/capture-order/${orderId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};