import { createTrackedAbortController } from "../utils/AbortManager";
import { getToken } from "./authService";
import { baseUrl } from "./constService";

interface FixedValueItem {
  id: number;
  value: string;
}

export const handleGetFixedValuesList = async (id: String): Promise<FixedValueItem[]> => {
  
  var result: FixedValueItem[] = [];

  const controller = createTrackedAbortController();
  const signal = controller.signal;

  const token = getToken();
  if (!token) {
      alert("token not found");
      return result;
  }


  const response = await fetch(baseUrl + `/admin/fixed-list-values/${id}`, {
    method: "GET",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json" 
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  var json = await response.json();
  result= json as FixedValueItem[];
  return result;
}

export const handleFixedListValuesEdited = async (id: String, list: String[]): Promise<void> => {
    
    const controller = createTrackedAbortController();
    const signal = controller.signal;
  
    const token = getToken();
    if (!token) {
        alert("token not found");
        return;
    }
  
  const response = await fetch(baseUrl + `/admin/fixed-list-values/${id}`, {
    method: "PUT",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(list),
    signal,
  });
}