import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonCol, IonRow, IonIcon, IonButton, IonButtons } from '@ionic/angular/standalone';
import { ApiService } from '../../service/api.service';
// 导入Ionic图标相关功能
import { addIcons } from 'ionicons';  // 用于注册图标
import { 
  helpCircle      // 帮助图标
} from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonCol,
    IonRow,
    IonIcon,
    IonButton,
    IonButtons
  ]
})
export class Tab3Page {
  items: any[] = [];
  filteredItems: any[] = [];

  constructor(
    private apiService: ApiService,
    private alertController: AlertController
  ) {

    addIcons({
      helpCircle      // 注册帮助图标
    });
  }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.apiService.getAllItems().subscribe({
      next: (data) => this.items = data,
      error: (error) => {
        console.error('Error fetching items:', error);
        this.items = [];
      }
    });
  }




  
  async openUpdateDialog(item: any) {
    const alert = await this.alertController.create({
      header: 'Update Item',
      inputs: [
        {
          name: 'item_name',
          type: 'text',
          placeholder: 'Product Name',
          value: item.item_name
        },
        {
          name: 'category',
          type: 'text',
          placeholder: 'Category',
          value: item.category
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Price',
          value: item.price
        },
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Stock',
          value: item.quantity
        },
        {
          name: 'special_note',
          type: 'text',
          placeholder: 'Notes',
          value: item.special_note
        },
        {
          name: 'supplier_name',
          type: 'text',
          placeholder: 'Supplier',
          value: item.supplier_name
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Update',
          handler: (data) => this.updateItem(item.item_name, {
            ...data,
            price: Number(data.price),
            quantity: Number(data.quantity)
          })
        }
      ]
    });
    await alert.present();
  }


  async confirmDelete(item: any) {

    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${item.item_name}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.deleteItem(item.item_name) }
      ]
    });
    await alert.present();
  }


  updateItem(oldName: string, newData: any) {
    if (!this.validateData(newData)) {
      this.showAlert('Error', 'Please fill in all required fields');
      return;
    }

    this.apiService.updateItem(oldName, newData).subscribe({
      next: () => {
        this.showAlert('Success', 'Item updated successfully');
        this.loadItems();
      },
      error: () => this.showAlert('Error', 'Failed to update item')
    });
  }


  deleteItem(itemName: string) {
    this.apiService.deleteItem(itemName).subscribe({
      next: () => {
        this.showAlert('Success', 'Item deleted successfully');
        this.loadItems();
      },
      error: () => this.showAlert('Error', 'Failed to delete item')
    });
  }


  private validateData(data: any): boolean {
    return !!(data.item_name && data.category && 
      !isNaN(data.price) && !isNaN(data.quantity));
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
