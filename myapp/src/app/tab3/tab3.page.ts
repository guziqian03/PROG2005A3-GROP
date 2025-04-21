import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { helpCircle, cube, business, create, trash, search, filter } from 'ionicons/icons';
import { AlertController } from '@ionic/angular/standalone';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonGrid, IonCol, IonRow, IonIcon, IonButton, 
  IonButtons, IonModal, IonInput, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { ApiService, Item } from '../../service/api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
    IonItem, IonLabel, IonGrid, IonCol, IonRow, IonIcon, 
    IonButton, IonButtons, IonModal, IonInput, IonSelect, 
    IonSelectOption
  ]
})
export class Tab3Page implements OnInit {
  items: Item[] = [];
  isModalOpen = false;
  selectedItem: Item | null = null;
  isLoading = false;

  categories = ['Electronics', 'Tools', 'Furniture', 'Miscellaneous'];
  statusOptions = ['In Stock', 'Out of Stock', 'Low Stock'];

  updateForm: FormGroup = this.formBuilder.group({
    item_name: ['', [Validators.required, this.notOnlyNumbersValidator]],
    category: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    quantity: ['', [Validators.required, Validators.min(0)]],
    special_note: [''],
    supplier_name: ['', [Validators.required, this.noNumberValidator]],
    stock_status: ['']
  });

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private alertController: AlertController
  ) {
    addIcons({ helpCircle, cube, business, create, trash, search, filter });
  }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.isLoading = true;
    this.apiService.getAllItems().subscribe({
      next: (data) => {
        // Make sure each item has a status
        this.items = data.map(item => ({
          ...item,
          stock_status: item.stock_status || this.calculateStockStatus(item.quantity)
        }));
        console.log('Items loaded:', this.items);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching items:', error);
        this.showAlert('Error', 'Failed to load items');
        this.items = [];
        this.isLoading = false;
      }
    });
  }

  notOnlyNumbersValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const isOnlyNumbers = /^\d+$/.test(control.value);
    return isOnlyNumbers ? { onlyNumbers: true } : null;
  }

  noNumberValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const hasNumber = /\d/.test(control.value);
    return hasNumber ? { hasNumber: true } : null;
  }

  async openUpdateDialog(item: Item) {
    this.selectedItem = { ...item };
    const currentStatus = this.calculateStockStatus(item.quantity);
    
    this.updateForm.patchValue({
      item_name: item.item_name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      special_note: item.special_note || '',
      supplier_name: item.supplier_name,
      stock_status: currentStatus  // Using the calculated state
    });
    this.isModalOpen = true;
  }
  

public calculateStockStatus(quantity: number): string {
  if (quantity <= 0) return 'Out of Stock';
  if (quantity < 5) return 'Low Stock';
  return 'In Stock';
}
  

  closeModal() {
    this.isModalOpen = false;
    this.updateForm.reset();
    this.selectedItem = null;
  }

  async submitUpdate() {
    if (!this.updateForm.valid || !this.selectedItem) {
      this.showAlert('Error', 'Please fill all required fields correctly');
      return;
    }
  
    try {
      const formValue = this.updateForm.value;
      
      // Check if it is a protected project
      if (['Laptop', 'laptop', 'Iphone 16 Pro'].includes(this.selectedItem.item_name)) {
        this.showAlert('Error', 'This item cannot be modified');
        return;
      }
  
      // Data Validation
      const price = parseFloat(formValue.price);
      const quantity = parseInt(formValue.quantity, 10);
  
      if (isNaN(price) || price < 0) {
        throw new Error('Invalid price value');
      }
  
      if (isNaN(quantity) || quantity < 0) {
        throw new Error('Invalid quantity value');
      }
  
      // Calculation status
      const stockStatus = this.calculateStockStatus(quantity);
  
      const updatedData = {
        item_id: this.selectedItem.item_id,
        item_name: formValue.item_name?.trim(),
        category: formValue.category?.trim(),
        price: price,
        quantity: quantity,
        special_note: formValue.special_note?.trim() || '',
        supplier_name: formValue.supplier_name?.trim(),
        featured_item: 0,
        stock_status: stockStatus  // Using the calculated state
      };
  
      // Validation required fields
      if (!updatedData.item_name || !updatedData.category || !updatedData.supplier_name) {
        throw new Error('Please fill all required fields');
      }
  
      this.isLoading = true;
  
      this.apiService.updateItem(this.selectedItem.item_name, updatedData)
        .subscribe({
          next: (response) => {
            console.log('Update successful:', response);
            this.showAlert('Success', 'Item updated successfully');
            this.loadItems();
            this.closeModal();
          },
          error: (error) => {
            console.error('Update failed:', error);
            let errorMessage = 'Failed to update item';
            
            if (error.status === 403) {
              errorMessage = 'This item cannot be modified';
            } else if (error.status === 500) {
              errorMessage = 'Server error occurred. Please try again later.';
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            this.showAlert('Error', errorMessage);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
  
    } catch (error: any) {
      console.error('Validation error:', error);
      this.showAlert('Error', error.message || 'Invalid input data');
      this.isLoading = false;
    }
  }
  



  async confirmDelete(item: Item) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${item.item_name}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { 
          text: 'Delete', 
          handler: () => this.deleteItem(item.item_name) 
        }
      ]
    });
    await alert.present();
  }

  async deleteItem(itemName: string) {
    this.isLoading = true;
    this.apiService.deleteItem(itemName).subscribe({
      next: () => {
        this.showAlert('Success', 'Item deleted successfully');
        this.loadItems();
      },
      error: (error) => {
        this.showAlert('Error', error.message || 'Failed to delete item');
        console.error('Delete error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  showHelpPopup(): void {
    const helpPopup = document.getElementById('help-popup3');
    if (helpPopup) {
      helpPopup.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }
  
  closeHelpPopup(): void {
    const helpPopup = document.getElementById('help-popup3');
    if (helpPopup) {
      helpPopup.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
}
