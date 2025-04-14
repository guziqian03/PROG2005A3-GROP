import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  // API base URL
  private apiUrl = 'https://prog2005.it.scu.edu.au/ArtGalley';

  constructor(private http: HttpClient) {}

  // Get all items from the database
  getAllItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Get item by name
  getItemByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${name}`);
  }

// Update item details
updateItem(name: string, item: any): Observable<any> {
  // Remove item_id from the request body as it might not be needed by the server
  const { item_id, ...updateData } = item;
  
  // Ensure all numeric values are properly converted

  const payload = {
    ...updateData,
    price: Number(updateData.price),
    quantity: Number(updateData.quantity)
  };


  // Add headers to specify content type
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  

  return this.http.put<any>(`${this.apiUrl}/s${name}`, payload, { headers });
}

  // Create new item
  createItem(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, item);
  }

  // Delete item by name
  deleteItem(name: string): Observable<any> {
    // Special case: Laptop cannot be deleted
    if (name === 'Laptop') {
      return new Observable(observer => {
        observer.error('Error: Deleting "Laptop" is not allowed!');
      });
    }
    return this.http.delete<any>(`${this.apiUrl}/${name}`);
  }

}
