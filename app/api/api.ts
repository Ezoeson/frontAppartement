const API_URL = 'https://backendappartement.onrender.com';

export interface Apartment {
  id?: number;
  numApp: string;
  design: string;
  loyer: number;
  obs?: string;
}

// Fonction utilitaire pour gérer les réponses HTTP
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};
console.log(handleResponse);

// Récupérer tous les appartements
export const getApartments = async () => {
  try {
    const response = await fetch(`${API_URL}/apartments`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching apartments:', error);
    throw error;
  }
};

// Ajouter un nouvel appartement
export const addApartment = async (
  apartment: Apartment
): Promise<Apartment> => {
  try {
    const response = await fetch(`${API_URL}/apartments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apartment),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error adding apartment:', error);
    throw error;
  }
};

// Mettre à jour un appartement existant
export const updateApartment = async (
  id: number,
  apartment: Apartment
): Promise<Apartment> => {
  try {
    const response = await fetch(`${API_URL}/apartments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apartment),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating apartment:', error);
    throw error;
  }
};

// Supprimer un appartement
export const deleteApartment = async (id: number): Promise<void> => {
  try {
    const response: Response = await fetch(`${API_URL}/apartments/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  } catch (error) {
    console.error('Error deleting apartment:', error);
    throw error;
  }
};

// Récupérer les statistiques des loyers
export const getApartmentStats = async (): Promise<{
  total: number;
  min: number;
  max: number;
}> => {
  try {
    const response = await fetch(`${API_URL}/apartments/stats`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching apartment stats:', error);
    throw error;
  }
};
