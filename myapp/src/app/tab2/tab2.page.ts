import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { helpCircle, addOutline, cube, business, create } from 'ionicons/icons';
import { AlertController } from '@ionic/angular/standalone';
import { 

  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonGrid, 
  IonCol, 
  IonRow, 
  IonIcon, 
  IonButton, 
  IonFabButton, 
  IonFab, 
  IonButtons,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonButtons, 
    IonFab, 
    IonFabButton, 
    IonButton, 
    IonIcon, 
    IonRow, 
    IonCol, 
    IonGrid, 
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonLabel,
    FormsModule,
    ReactiveFormsModule,
    IonModal,
    IonInput,
    IonSelect,
    IonSelectOption
  ]
})
export class Tab2Page {
  items: any[] = [];
  filteredItems: any[] = [];
  isModalOpen = false;

  // Defining Category Options
  categories = ['Electronics', 'Tools', 'Furniture', 'Miscellaneous'];
  // Defining Status Options
  statusOptions = ['In Stock', 'Out of Stock', 'Low Stock'];

  // Add new methods to the Tab2Page class
  checkDuplicateItemName(itemName: string): boolean {
    return this.items.some(item => item.item_name.toLowerCase() === itemName.toLowerCase());
  }

  itemForm: FormGroup = this.formBuilder.group({
    item_name: ['', [Validators.required, this.notOnlyNumbersValidator]], // 修改为新的验证器
    category: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    quantity: ['', [Validators.required, Validators.min(0)]],
    special_note: [''],
    supplier_name: ['', [Validators.required, this.noNumberValidator]],
    stock_status: ['', Validators.required]
  });
// New validator: cannot be all numbers
notOnlyNumbersValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  
  // Checks if it contains only numbers
  const isOnlyNumbers = /^\d+$/.test(control.value);
  
  return isOnlyNumbers ? { onlyNumbers: true } : null;
}
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private alertController: AlertController
  ) {
    addIcons({addOutline,cube,business,create,helpCircle});
  }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.apiService.getAllItems().subscribe(
      (data) => {
        this.items = data;
        console.log('Items loaded:', this.items);
      },
      (error) => {
        console.error('Error fetching items:', error);
        this.items = [
          {
            item_id: 1,
            item_name: 'Test Product',
            category: 'Test Category',
            price: 100,
            quantity: 10,
            special_note: 'Test Note',
            supplier_name: 'Test Supplier',
            stock_status: 'In Stock'
          }
        ];
      }
    );
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.itemForm.reset();
  }


  
// Modify the submitForm method
async submitForm() {
  if (this.itemForm.valid) {
    const newItemName = this.itemForm.get('item_name')?.value;
    
    // Check if the product name is repeated
    if (this.checkDuplicateItemName(newItemName)) {
      // Creating and displaying alerts using AlertController
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Product name already exists. Please use a different name.',
        buttons: ['OK']
      });

      await alert.present();
      return; // If duplicate, stop submitting
    }

    const newItem = {
      ...this.itemForm.value,
      featured_item: 1
    };

    this.apiService.createItem(newItem).subscribe(
      (response) => {
        console.log('Item created successfully:', response);
        this.loadItems();
        this.closeModal();
      },
      (error) => {
        console.error('Error creating item:', error);
      }
    );
  }
}


  noNumberValidator(control: any) {
    const hasNumber = /\d/.test(control.value);
    return hasNumber ? { hasNumber: true } : null;
  }

showHelpPopup(): void {
  const helpPopup = document.getElementById('help-popup');
  if (helpPopup) {
    helpPopup.style.display = 'block';
    document.body.style.overflow = 'hidden'; //Prevent background scrolling
  }
}

closeHelpPopup(): void {
  const helpPopup = document.getElementById('help-popup');
  if (helpPopup) {
    helpPopup.style.display = 'none';
    document.body.style.overflow = ''; // Resume Scrolling
  }
}
}
