import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { ApiService } from '../../service/api.service';
import { addIcons } from 'ionicons';  // 用于注册图标
import { helpCircle, cube, business, create } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
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
    IonSelect,
    IonSelectOption
  ]
})
export class Tab1Page {
  items: any[] = []; // 所有数据
  filteredItems: any[] = []; // 过滤后的数据
  filterCondition: string = 'all'; // 过滤条件
  searchTerm: string = ''; // 搜索关键字

  // 过滤条件选项
  filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'low-stock', label: 'Low Stock' }
  ];

  constructor(private apiService: ApiService) {
    addIcons({cube,business,create,helpCircle}); // 注册帮助图标
  }

  ngOnInit() {
    this.loadItems();
  }

  // 加载数据
  loadItems() {
    this.apiService.getAllItems().subscribe(
      (data) => {
        this.items = data;
        this.applyFilter(); // 初始化时应用过滤
        console.log('Items loaded:', this.items);
      },
      (error) => {
        console.error('Error fetching items:', error);
        // 临时添加测试数据
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
        this.applyFilter(); // 初始化时应用过滤
      }
    );
  }

  // 根据条件过滤数据
  applyFilter() {
    let filtered = this.items;

    // 应用过滤条件
    if (this.filterCondition === 'in-stock') {
      filtered = filtered.filter(item => item.quantity > 0);
    } else if (this.filterCondition === 'out-of-stock') {
      filtered = filtered.filter(item => item.quantity <= 0);
    } else if (this.filterCondition === 'low-stock') {
      filtered = filtered.filter(item => item.quantity > 0 && item.quantity < 5);
    }

    // 应用搜索条件
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.item_name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    this.filteredItems = filtered;
  }

  // 处理过滤条件变化
  onFilterChange(event: any) {
    this.filterCondition = event.detail.value;
    this.applyFilter();
  }

  // 处理搜索
  searchItems(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilter();
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
}
