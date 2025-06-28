export interface ApiClientOptions extends RequestInit {
    timeout?: number; // milisegundos
  }
  
  export async function apiClient<T>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<T> {
    const BASE_URL = "http://localhost:4000";
  
    const controller = new AbortController();
    const timeout = options.timeout || 30000; // default 30 segundos
    const timer = setTimeout(() => controller.abort(), timeout);
  
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include",
        ...options,
        signal: controller.signal,
      });
  
      clearTimeout(timer);
  
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("API Error:", res.status, errorBody);
        throw new Error(errorBody.message || `API Error ${res.status}`);
      }
  
      return res.json();
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.error("API Request timed out");
        throw new Error("Tiempo de espera agotado, inténtalo de nuevo");
      }
  
      console.error("API Request failed:", err);
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
  