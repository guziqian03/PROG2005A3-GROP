import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';  // 用于注册图标
import { helpCircle, addOutline, cube, business, create } from 'ionicons/icons';

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

  // 定义类别选项
  categories = ['Electronics', 'Tools', 'Furniture', 'Miscellaneous'];

  itemForm: FormGroup = this.formBuilder.group({
    item_name: ['', [Validators.required, this.noNumberValidator]], // 禁止输入数字
    category: ['', Validators.required], // 改为下拉框
    price: ['', [Validators.required, Validators.min(0)]], // 必须为数字且大于等于0
    quantity: ['', [Validators.required, Validators.min(0)]], // 必须为数字且大于等于0
    special_note: [''], // 无特殊校验
    supplier_name: ['', [Validators.required, this.noNumberValidator]], // 禁止输入数字
  });

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    addIcons({addOutline,cube,business,create,helpCircle}); // 注册帮助图标
  }

  ngOnInit() {
    this.loadItems();
  }

  // 加载商品数据
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
            item_name: '测试商品',
            category: '测试类别',
            price: 100,
            quantity: 10,
            special_note: '测试备注',
            supplier_name: '测试供应商',
            stock_status: '有货'
          }
        ];
      }
    );
  }

  // 打开模态框
  openModal() {
    this.isModalOpen = true;
  }
  // 显示帮助弹窗
  showHelpPopup(): void {
    const helpPopup = document.getElementById('help-popup') as HTMLElement;
    if (helpPopup) {
      helpPopup.style.display = 'block';
    }
  }

  // 关闭帮助弹窗
  closeHelpPopup(): void {
    const helpPopup = document.getElementById('help-popup') as HTMLElement;
    if (helpPopup) {
      helpPopup.style.display = 'none';
    }
  }
  // 关闭模态框
  closeModal() {
    this.isModalOpen = false;
    this.itemForm.reset();
  }

  // 提交表单
  submitForm() {
    if (this.itemForm.valid) {
      const newItem = {
        ...this.itemForm.value,
        featured_item: 1,
        stock_status: this.itemForm.value.quantity > 0 ? 'In Stock' : 'Out of Stock'
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

  // 自定义校验器：禁止输入数字
  noNumberValidator(control: any) {
    const hasNumber = /\d/.test(control.value);
    return hasNumber ? { hasNumber: true } : null;
  }
}
